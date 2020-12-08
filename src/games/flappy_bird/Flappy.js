import React from 'react';
import Sketch from 'react-p5';
import Bird from './Bird';
import Pipe from './Pipe';
import settings from './settings';
import Population from '../genetic_algorithm/population';
import {FeedForwardNetwork, sigmoid, linear, relu} from './neural_network'
import {elitism_selection, roulette_wheel_selection} from '../genetic_algorithm/selection';
import {gaussian_mutation, random_uniform_mutation} from '../genetic_algorithm/mutation';
import {simulated_binary_crossover as SBX} from '../genetic_algorithm/crossover';
import {uniform_binary_crossover, single_point_binary_crossover} from '../genetic_algorithm/crossover';
import { image } from '@tensorflow/tfjs';

// import background_sprite_import from "./assets/background-day.png"
import background_sprite_import from "./assets/background-day_horizontal.png"
import base_sprite_imoprt from "./assets/base.png"
import pipe_sprite_import from "./assets/pipe-green.png"

const random = require('random');
var nj = require('@aas395/numjs');


function Flappy(props) {
    const cumulativeSum = (sum => value => sum += value)(0);
    var _mutation_bins = [settings['probability_gaussian'], settings['probability_random_uniform']].map(cumulativeSum);
    var _crossover_bins = [settings['probability_SBX'], settings['probability_SPBX']].map(cumulativeSum);
    var _SPBX_type = settings['SPBX_type'].toLowerCase();
    var _SBX_eta = settings['SBX_eta'];
    var _mutation_rate = settings['mutation_rate'];

    // Determine size of next gen based off selection type
    var _next_gen_size = null;
    if (settings['selection_type'].toLowerCase() == 'plus')
        _next_gen_size = settings['num_parents'] + settings['num_offspring'];
    else if (settings['selection_type'].lower() == 'comma')
        _next_gen_size = settings['num_offspring'];
    else
        throw new Error('Selection type "{}" is invalid'.format(settings['selection_type']));

    var board_size = props.dimension;
    // console.log(board_size)
    // var Window_Width = settings['Window_Width']
    // var Window_Height = settings['Window_Height']
    var Window_Width = props.dimension[0]   
    var Window_Height = props.dimension[1]  
    console.log(Window_Width, Window_Height)        //493 – 295

    var individuals = [];

    var population = new Population(individuals);
    var current_generation = 0;
    var winner = null;
    var winner_index = -1;
    var champion = null;
    var champion_index = -1;
    var champion_fitness = Number.NEGATIVE_INFINITY;



    // game params

    // load assets
    var bg_sprite = null

    var floor_sprite = null
    var floor_x = 0

    var pipe_sprite = null
    var pipe_list = []
    
    
    var spawn_pipe_counter = 0


    // scores
    var score = 0
    var high_score = 0


    const setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        console.log('=================Flappy setup==========================');
        console.log('=================Flappy setup==========================');
        console.log('=================Flappy setup==========================');

        bg_sprite = p5.loadImage(background_sprite_import)
        floor_sprite = p5.loadImage(base_sprite_imoprt)
        pipe_sprite = p5.loadImage(pipe_sprite_import)


        // var temp = Pipe.create_pipe_pair(Window_Width, pipe_sprite.height, pipe_sprite.width)
        // pipe_list.push(temp[0])
        // pipe_list.push(temp[1])
        // pipe_list.push(...Pipe.create_pipe_pair(Window_Width, pipe_sprite.height, pipe_sprite.width))
        // pipe_list.push.apply(Pipe.create_pipe_pair(Window_Width))
        
        console.log(pipe_list)

        



        p5.createCanvas(board_size[0], board_size[1]).parent(canvasParentRef);
        for (var i=0; i < settings['num_parents']; i++) {
            // const individual = new Bird(p5=p5, 
            //                         hidden_layer_architecture=settings['hidden_network_architecture'],
            //                         hidden_activation=settings['hidden_layer_activation'],
            //                         output_activation=settings['output_layer_activation']);
            const individual = new Bird(p5, 
                                        null,
                                        settings['hidden_network_architecture'],
                                        settings['hidden_layer_activation'],
                                        settings['output_layer_activation'],
                                        settings['init_bird_x_pos'],
                                        settings['init_bird_y_pos'],
                                        0);
            individuals.push(individual);
        }
    };

    
    const draw = (p5) => {
        p5.background(99);
        // p5.push()
        // p5.fill('#00ff00');
        // p5.rect(10, 10, 15, 90);
        // p5.pop()
        
        p5.push()
        p5.scale(1.75)
        p5.image(bg_sprite, 0, 0, Window_Width, Window_Height);
        p5.pop()

        // # Pipes
        spawn_pipe_counter += 1
        
        
        // if (spawn_pipe_counter % settings['pipe_interval_in_frames'] == 0) {
        //     pipe_list.push(...Pipe.create_pipe_pair(Window_Width, pipe_sprite.height, pipe_sprite.width))
        // }

        if (pipe_list.length <= 1 || pipe_list[pipe_list.length - 1].x <= Window_Width) {
            pipe_list.push(...Pipe.create_pipe_pair(Window_Width, pipe_sprite.height, pipe_sprite.width))
        }


        pipe_list = move_pipes(pipe_list)
        draw_pipes(p5, pipe_list) 
        
        // # Floor
        floor_x = (floor_x - 6) % - Window_Width
        draw_floor(p5)

        // # TODO: should change this for better visibility
        p5.push()
        p5.textSize(14)
        p5.text('Generation: ' + Math.floor(current_generation), Window_Width - 150, 30)
        p5.text('Score: ' + Math.floor(Math.max(score-1.2, 0)), Window_Width - 150, 60)
        p5.text('Best: ' + Math.floor(Math.max(high_score-1.2, 0)), Window_Width - 150, 90)
        // p5.text('Score: ' + Math.max(score-1.7, 0), Window_Width - 150, 60)
        // p5.text('Best: ' + Math.max(high_score-1.7, 0), Window_Width - 150, 90)
        p5.pop()



        var still_alive = 0;
        // Loop through the birds in the generation
        for (var i=0; i < population.individuals.length; i++) {
            var bird = population.individuals[i];

            if (bird.is_alive) {
                still_alive++;
                // console.log(bird.y_pos, bird.x_pos)
                //----------------------------------------inputs for neural network--------------------------------------------

                var next_pipe = get_next_pipe(false)
                var next_next_pipe = get_next_pipe(true)
                
                bird.x_distance_to_next_pipe_center = next_pipe.right_x() - settings['init_bird_x_pos']
                bird.y_distance_to_next_pipe_center = (next_pipe.top_or_bottom_y() - 50) - bird.y_pos
                if (next_next_pipe != null) {
                    bird.x_distance_to_next_next_pipe_center = next_next_pipe.right_x() - settings['init_bird_x_pos']
                    bird.y_distance_to_next_next_pipe_center = (next_next_pipe.top_or_bottom_y() - 50) - bird.y_pos
                } else {
                    bird.x_distance_to_next_next_pipe_center = 0
                    bird.y_distance_to_next_next_pipe_center = 0
                }
                const inputs = [[bird.y_speed], [bird.y_pos], [bird.x_distance_to_next_pipe_center], [bird.y_distance_to_next_pipe_center], [bird.y_distance_to_next_next_pipe_center]]
                //----------------------------------------inputs for neural network--------------------------------------------

                bird.update(inputs)
                bird.move(pipe_list)
                score = Math.max(score, bird.score)
                high_score = Math.max(score, high_score)
            }


            // Draw every paddle except the best ones
            if (bird.is_alive && bird !== winner && bird !== champion) {
                bird.draw(p5)
            }
        }
        // Generate new generation when all have died out
        // console.log(still_alive)
        if (still_alive === 0){
            // console.log('============================================================= pre NEW Generation =============================================================');
            next_generation(p5);
        }

        // Draw the winning and champion paddle last
        if (winner !== null && winner.is_alive) {
            winner.draw(p5, true, false);
        }
        if (champion !== null && champion.is_alive) {
            champion.draw(p5, false, true);
        }

        // Limit to 60 frames per second
        p5.frameRate(60)
    };

    const draw_floor = (p5) => {
        p5.push()
        p5.image(floor_sprite, floor_x, Window_Height - 50) 
        p5.image(floor_sprite, floor_x + floor_sprite.width, Window_Height - 50) 
        p5.image(floor_sprite, floor_x + floor_sprite.width * 2, Window_Height - 50)
        p5.image(floor_sprite, floor_x + floor_sprite.width * 3, Window_Height - 50) 
        p5.pop()
    }

    const move_pipes = (pipes) => {
        for (var pipe of pipes)
            pipe.move()
        return pipes
    }

    const draw_pipes = (p5, pipes) => {
        for (var pipe of pipes)
            pipe.draw(p5, pipe_sprite)
    }

    const get_next_pipe = (nextnext) => {
        var next_pipe = null
        var next_next_pipe = null
        // console.log("===get_next_pipe===")
        // console.log(pipe_list)
        for (var pipe of pipe_list) {
            // console.log(pipe.right_x())
            // console.log(settings['init_bird_x_pos'])
            if (pipe.right_x() > settings['init_bird_x_pos'] && next_pipe == null)
                next_pipe = pipe
            else if (next_pipe != null && next_next_pipe == null) 
                next_next_pipe = pipe
        }
        // console.log(next_pipe)
        // console.log(next_next_pipe)
        if (nextnext)
            return next_next_pipe
        return next_pipe
    }













    // #### GA Related ####

    const next_generation = (p5) => {
        // console.log('============================================================= NEW Generation =============================================================');
        current_generation++;
        score = 0
        pipe_list.length = 0            // clear the array to []
        pipe_list.push.apply(Pipe.create_pipe_pair(Window_Width, pipe_sprite.height, pipe_sprite.width))
        spawn_pipe_counter = 0
        
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

        props.addAvgFitness(population.average_fitness());
        props.addMaxFitness(population.fittest_individual().fitness);
        
        population.individuals = elitism_selection(population, settings['num_parents']);
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
            var c1 = new Bird(p5, 
                            c1_params,
                            settings['hidden_network_architecture'],
                            settings['hidden_layer_activation'],
                            settings['output_layer_activation'],
                            settings['init_bird_x_pos'],
                            settings['init_bird_y_pos'],
                            0);
            var c2 = new Bird(p5, 
                            c2_params,
                            settings['hidden_network_architecture'],
                            settings['hidden_layer_activation'],
                            settings['output_layer_activation'],
                            settings['init_bird_x_pos'],
                            settings['init_bird_y_pos'],
                            0);

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
        if (settings['mutation_rate_type'].toLowerCase() === 'decaying')
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

export default React.memo(Flappy, (prevProps, nextProps) => {return true});