import Individual from '../genetic_algorithm/individual';
import {FeedForwardNetwork, linear, sigmoid, tanh, relu, get_activation_by_name} from './neural_network';

// var nj = require('numjs');

class Paddle extends Individual{
    constructor(p5, xPaddle=0, yPaddle=200, ySpeed=0, boardSize, chromosome=null, hidden_layer_architecture=[20,12], hidden_activation='relu', output_activation='sigmoid') {
        super(Individual());
        this.xPaddle = xPaddle;
        this.yPaddle = yPaddle;
        this.ySpeed = ySpeed;
        this.board_size = boardSize;

        this.fitness = 0;
        this.hit = 0;
        this.distance_travelled = 0;
        this.ball_travelled = 0;
        this.distance_to_ball = 0;
        this.is_alive = true;

        this.hidden_layer_architecture = hidden_layer_architecture;
        this.hidden_activation = hidden_activation;
        this.output_activation = output_activation;

        // Setting up network architecture
        // Each "Vision" has 3 distances it tracks: wall, apple and self
        // there are also one-hot encoded direction and one-hot encoded tail direction,
        // each of which have 4 possibilities.
        const num_inputs = 5  
        this.network_architecture = [num_inputs]                          // Inputs
        this.network_architecture.push(...this.hidden_layer_architecture)  // Hidden layers
        this.network_architecture.push(3)                               // 3 outputs, ['left', 'still', 'right']
        this.network = new FeedForwardNetwork(this.network_architecture,
                                          get_activation_by_name(this.hidden_activation),
                                          get_activation_by_name(this.output_activation)
        )

        // If chromosome is set, take it
        if (chromosome) {
            // this._chromosome = chromosome
            this.network.params = chromosome
            // this.decode_chromosome()
        } else {
            // this._chromosome = {}
            // this.encode_chromosome()
        }
        
    }

    fitness = () => {
        return this.fitness;
    }

    calculate_fitness = () => {
        this.fitness = (2 ** this.hit + this.hit * 2.1) * 200 + ((1 - Math.min(this.distance_travelled / this.ball_travelled, 1)) * 400) + (this.board_size[0] - this.distance_to_ball) * 0.5;
        this.fitness = Math.max(this.fitness, .1);
    }

    reset = () => {
        this.fitness = 0;
        this.hit = 0;
        this.distance_travelled = 0;
        this.distance_to_ball = 0;
        this.is_alive = 0;
    }

    update = (inputs=null, ball=null) => {
        if (inputs !== null) {
            this.network.feed_forward(inputs);
        } else if (ball !== null) {
            this.yPaddle = ball.yBall - 45;
        }
        if (this.network.out === 0) {
            this.ySpeed = -15;
        } else if (this.network.out === 1) {
            this.ySpeed = 15;
        } else if (this.network.out === 2) {
            this.ySpeed = 0;
        }
        return true;
    }

    move = () => {
        this.yPaddle += this.ySpeed;
        this.distance_travelled += Math.abs(this.ySpeed);
    }

    draw = (p5, winner=false, champion=false) => {
        if (!this.is_alive) {
            return;
        } else if (champion) {
            p5.fill('#FFD700');
            p5.rect(this.xPaddle, this.yPaddle, 15, 90);
        } else if (winner) {
            p5.fill('#00FFFF');
            p5.rect(this.xPaddle, this.yPaddle, 15, 90);
        } else {
            p5.fill('#FFFFFF');
            p5.rect(this.xPaddle, this.yPaddle, 15, 90);
        }
    }
}

export default Paddle;