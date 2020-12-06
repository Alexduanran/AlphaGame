import Sketch from 'react-p5';
import Paddle from './Paddle';
import Ball from './Ball';
import settings from './settings';
import Population from '../genetic_algorithm/population';
import {FeedForwardNetwork, sigmoid, linear, relu} from './neural_network'
import {elitism_selection, roulette_wheel_selection} from '../genetic_algorithm/selection';
import {gaussian_mutation, random_uniform_mutation} from '../genetic_algorithm/mutation';
import {simulated_binary_crossover as SBX} from '../genetic_algorithm/crossover';
import {uniform_binary_crossover, single_point_binary_crossover} from '../genetic_algorithm/crossover';
const random = require('random');
var nj = require('@aas395/numjs');

function Pong(props) {
    const cumulativeSum = (sum => value => sum += value)(0);
    var _mutation_bins = [settings['probability_gaussian'], settings['probability_random_uniform']].map(cumulativeSum);
    var _crossover_bins = [settings['probability_SBX'], settings['probability_SPBX']].map(cumulativeSum);
    var _SPBX_type = settings['SPBX_type'].toLowerCase();
    var _SBX_eta = settings['SBX_eta'];
    var _mutation_rate = props.settings['mutationRate'];

    // Determine size of next gen based off selection type
    var _next_gen_size = null;
    if (settings['selection_type'].toLowerCase() == 'plus')
        _next_gen_size = props.settings['numParents'] + props.settings['numOffsprings'];
    else if (settings['selection_type'].lower() == 'comma')
        _next_gen_size = props.settings['numOffsprings'];
    else
        throw new Error('Selection type "{}" is invalid'.format(settings['selectionType']));

    var board_size = props.dimension;

    var individuals = [];
    var balls = [];

    var population = new Population(individuals);
    var current_generation = 0;
    var winner = null;
    var winner_index = -1;
    var champion = null;
    var champion_index = -1;
    var champion_fitness = Number.NEGATIVE_INFINITY;

    var num_hit = 0;
    var best_hit = 0;

    var training_paddle = null;
    var newball = true;

    const setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        p5.createCanvas(board_size[0], board_size[1]).parent(canvasParentRef);
        training_paddle = new Paddle(p5, board_size[0]-15, board_size[1]/2-45, 0, board_size);
        for (var i=0; i < props.settings['numParents']; i++) {
            const individual = new Paddle(p5, 0, board_size[1]/2-45, 0, board_size, null,
                                    props.settings['hiddenLayerArchitecture'], 
                                    settings['hidden_layer_activation', 
                                    settings['output_activation']]);
            individuals.push(individual);
        }
        const button = p5.createButton('Return').parent(canvasParentRef);
        button.position(30, 10);
        button.style('background-color', '#8A2BE2')
        button.mousePressed(props.updateStart);
    };
 
    const draw = (p5) => {
        p5.background(0);
        p5.textSize(20);
        p5.fill('#8A2BE2');
        p5.text('Generation: '+current_generation, board_size[0]-180, 30);
        p5.text('Hit: '+num_hit, board_size[0]-180, 60);
        p5.text('Best: '+best_hit, board_size[0]-180, 90);
        // New set of balls
        if (newball) {
            balls = [];
            const bally = random.int(0, board_size[1]);
            const speedy = random.int() === 1 ? 15 : -15;
            for (var i=0; i < _next_gen_size+1; i++) {
                balls.push(new Ball(board_size[0] / 2, bally, 15, speedy));
            }
            newball = false;
        }

        // Update training paddle
        training_paddle.update(null, balls[balls.length-1]);
        balls[balls.length-1].update(training_paddle, board_size);
        balls[balls.length-1].move();
        training_paddle.is_alive = true;
        training_paddle.draw(p5);

        var still_alive = 0;
        // Loop through the paddles in the generation
        for (var i=0; i < population.individuals.length; i++) {
            var paddle = population.individuals[i];

            if (paddle.is_alive) {
                still_alive++;
                //----------------------------------------inputs for neural network--------------------------------------------
                // const distance = ((balls[i].y - paddle.y_pos) ** 2 + (balls[i].x - paddle.x_pos) ** 2) ** 0.5;
                // const ball_distance_left_wall = balls[i].yBall - 0;
                // const ball_distance_right_wall = board_size[1] - balls[i].yBall;
                const inputs = [[paddle.yPaddle], [balls[i].ySpeed], [paddle.ySpeed], [balls[i].yBall], [balls[i].xSpeed]];
                // inputs = np.array([[paddle.x_pos], [balls[i].xspeed], [paddle.xspeed], [balls[i].x]])
                //----------------------------------------inputs for neural network--------------------------------------------
                paddle.update(inputs);
                balls[i].update(paddle, board_size);
                num_hit = Math.max(num_hit, paddle.hit);
                best_hit = Math.max(num_hit, best_hit);
                balls[i].move();
                paddle.move();
            }

            // Draw every paddle except the best ones
            if (paddle.is_alive && paddle !== winner && paddle !== champion) {
                // paddle.winner = False
                // paddle.champion = False
                balls[i].draw(p5);
                paddle.draw(p5);
            }
        }
        // Generate new generation when all have died out
        if (still_alive === 0)
            next_generation(p5);

        // Draw the winning and champion paddle last
        if (winner !== null && winner.is_alive) {
            balls[winner_index].draw(p5);
            winner.draw(p5, true, false);
        }
        if (champion !== null && champion.is_alive) {
            balls[champion_index].draw(p5);
            champion.draw(p5, false, true);
        }
    };

    const next_generation = (p5) => {
        current_generation++;
        newball = true;
        num_hit = 0;
        
        // Calculate fitness of individuals
        for (var individual of population.individuals)
            individual.calculate_fitness();
        
        // Find winner from each generation and champion
        winner = population.fittest_individual();
        winner_index = population.individuals.indexOf(winner);
        if (winner.fitness > champion_fitness) {
            champion_fitness = winner.fitness;
            champion = winner;
            champion_index = winner_index;
        }
        winner.reset();
        champion.reset();

        // Print results from each generation
        console.log('======================= Generation', current_generation, '=======================');
        console.log('----Max fitness:', population.fittest_individual().fitness);
        // print('----Best Score:', self.population.fittest_individual.score);
        console.log('----Average fitness:', population.average_fitness());
        
        population.individuals = elitism_selection(population, props.settings['numParents']);
        population.individuals = shuffle(population.individuals);
        var next_pop = [];

        // parents + offspring selection type ('plus')
        if (settings['selection_type'].toLowerCase() === 'plus') {
            next_pop.push(winner);
            next_pop.push(champion);
        }

        while (next_pop.length < _next_gen_size) {
            var [p1, p2] = roulette_wheel_selection(population, 2);
            const L = p1.network.layer_nodes.length;
            var c1_params = {};
            var c2_params = {};

            // Each W_l and b_l are treated as their own chromosome.
            // Because of this I need to perform crossover/mutation on each chromosome between parents
            for (var l = 1; l < L; l++) {
                const p1_W_l = p1.network.params['W' + l.toString()]
                const p2_W_l = p2.network.params['W' + l.toString()]  
                const p1_b_l = p1.network.params['b' + l.toString()]
                const p2_b_l = p2.network.params['b' + l.toString()]

                var c1_W_l = null, c2_W_l = null, c1_b_l = null, c2_b_l = null;

                // Crossover
                // @NOTE: I am choosing to perform the same type of crossover on the weights and the bias.
                [c1_W_l, c2_W_l, c1_b_l, c2_b_l] = _crossover(p1_W_l, p2_W_l, p1_b_l, p2_b_l);

                // Mutation
                // @NOTE: I am choosing to perform the same type of mutation on the weights and the bias.
                _mutation(c1_W_l, c2_W_l, c1_b_l, c2_b_l);

                // Assign children from crossover/mutation
                c1_params['W' + l.toString()] = c1_W_l;
                c2_params['W' + l.toString()] = c2_W_l;
                c1_params['b' + l.toString()] = c1_b_l;
                c2_params['b' + l.toString()] = c2_b_l;

                // Clip to [-1, 1]
                for (var i=0; i<c1_params['W'+l.toString()].shape[0]; i++) {
                    for (var j=0; j<c1_params['W'+l.toString()].shape[1]; j++) {
                        c1_params['W'+l.toString()].set(i, j, c1_params['W'+l.toString()].get(i, j) < -1 ? -1 : c1_params['W'+l.toString()].get(i, j));
                        c1_params['W'+l.toString()].set(i, j, c1_params['W'+l.toString()].get(i, j) > 1 ? 1 : c1_params['W'+l.toString()].get(i, j));
                        c2_params['W'+l.toString()].set(i, j, c2_params['W'+l.toString()].get(i, j) < -1 ? -1 : c2_params['W'+l.toString()].get(i, j));
                        c2_params['W'+l.toString()].set(i, j, c2_params['W'+l.toString()].get(i, j) > 1 ? 1 : c2_params['W'+l.toString()].get(i, j));
                        c1_params['b'+l.toString()].set(i, j, c1_params['b'+l.toString()].get(i, j) < -1 ? -1 : c1_params['b'+l.toString()].get(i, j));
                        c1_params['b'+l.toString()].set(i, j, c1_params['b'+l.toString()].get(i, j) > 1 ? 1 : c1_params['b'+l.toString()].get(i, j));
                        c2_params['b'+l.toString()].set(i, j, c2_params['b'+l.toString()].get(i, j) < -1 ? -1 : c2_params['b'+l.toString()].get(i, j));
                        c2_params['b'+l.toString()].set(i, j, c2_params['b'+l.toString()].get(i, j) > 1 ? 1 : c2_params['b'+l.toString()].get(i, j));
                    }
                }
            }

            // Create children from chromosomes generated above
            var c1 = new Paddle(p5, 0, board_size[1]/2-45, 0, board_size, c1_params,
                        props.settings['hiddenLayerArchitecture'], 
                        settings['hidden_layer_activation', 
                        settings['output_activation']]);
            var c2 = new Paddle(p5, 0, board_size[1]/2-45, 0, board_size, c2_params,
                        props.settings['hiddenLayerArchitecture'], 
                        settings['hidden_layer_activation', 
                        settings['output_activation']]);

            // Add children to the next generation
            next_pop.push(...[c1,c2]);
        }
        shuffle(next_pop);
        population.individuals = next_pop;
        
    }

    const _crossover = (parent1_weights, parent2_weights, parent1_bias, parent2_bias) => {
        const rand_crossover = random.float();
        var crossover_bucket = null;
        for (var i = 1; i < _crossover_bins.length; i++) {
            if (rand_crossover < _crossover_bins[i])
                crossover_bucket = i-1;
        }
        var child1_weights = null;
        var child2_weights = null;
        var child1_bias = null;
        var child2_bias = null;

        // SBX
        if (crossover_bucket === 0) {
            [child1_weights, child2_weights] =  SBX(parent1_weights, parent2_weights, _SBX_eta);
            [child1_bias, child2_bias] = SBX(parent1_bias, parent2_bias, _SBX_eta);
        }

        // Single point binary crossover (SPBX)
        else if (crossover_bucket === 1) {
            [child1_weights, child2_weights] = single_point_binary_crossover(parent1_weights, parent2_weights, _SPBX_type);
            [child1_bias, child2_bias] =  single_point_binary_crossover(parent1_bias, parent2_bias, _SPBX_type);
        }

        else
            throw new Error('Unable to determine valid crossover based off probabilities');
        
        return [child1_weights, child2_weights, child1_bias, child2_bias];
    }

    const _mutation = (child1_weights, child2_weights, child1_bias, child2_bias) => {
        const scale = 0.2;
        const rand_mutation = random.float();
        var mutation_bucket = null;
        for (var i = 1; i < _mutation_bins.length; i++) {
            if (rand_mutation < _mutation_bins[i])
                mutation_bucket = i-1;
        }

        var mutation_rate = _mutation_rate;
        if (props.settings['mutationRateType'].toLowerCase() === 'decaying')
            mutation_rate = mutation_rate / Math.sqrt(current_generation + 1);
        
        if (mutation_bucket === 0) {
            // Mutate weights
            gaussian_mutation(child1_weights, mutation_rate, scale);
            gaussian_mutation(child2_weights, mutation_rate, scale);

            // Mutate bias
            gaussian_mutation(child1_bias, mutation_rate, scale);
            gaussian_mutation(child2_bias, mutation_rate, scale);
        }
        
        // Uniform random
        else if (mutation_bucket === 1) {
            // Mutate weights
            random_uniform_mutation(child1_weights, mutation_rate, -1, 1);
            random_uniform_mutation(child2_weights, mutation_rate, -1, 1);

            // Mutate bias
            random_uniform_mutation(child1_bias, mutation_rate, -1, 1);
            random_uniform_mutation(child2_bias, mutation_rate, -1, 1);
        }

        else
            throw new Error('Unable to determine valid mutation based off probabilities.');
    }

    const shuffle = array => {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
    }


    return (
        <div>
            <Sketch setup={setup} draw={draw} />
        </div>
    );
}

export default Pong;