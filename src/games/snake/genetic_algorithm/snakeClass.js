import Individual from '../../genetic_algorithm/individual';
import * as util from '../reinforcement_learning/util';
import { colorGrid, Rect } from '../reinforcement_learning/sprite';
import {FeedForwardNetwork, linear, sigmoid, tanh, relu, get_activation_by_name} from './neural_network';

// var nj = require('numjs');

export class Snake_ extends Individual{
    constructor(p5, x=200, y=200, length, direction, boxSize, boardSize, chromosome=null, hidden_layer_architecture=[20,12], hidden_activation='relu', output_activation='sigmoid') {
        super(Individual());
        this.x = x
        this.y = y
        this.length = length
        this.direction = direction
        this.boxSize = boxSize
        this.board_size = boardSize
        this.body = []
        this.initialize();
        this.head = this.body[0];

        this._fitness = 0
        this.is_alive = true
        this.reach_apple = false
        this.apples = 0
        this.total_steps = 0
        this.steps = 0
        this.distance = 0

        this.winner = false
        this.champion = false

        this.hidden_layer_architecture = hidden_layer_architecture;
        this.hidden_activation = hidden_activation;
        this.output_activation = output_activation;

        // Setting up network architecture
        // Each "Vision" has 3 distances it tracks: wall, apple and this
        // there are also one-hot encoded direction and one-hot encoded tail direction,
        // each of which have 4 possibilities.
        const num_inputs = 12 
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

    initialize() {
        var k1 = 0; var k2 = 0;
        if (this.direction == "R") k1 = -1;
        if (this.direction == "L") k1 = 1;
        if (this.direction == "U") k2 = 1;
        if (this.direction == "D") k2 = -1;

        for (var i = 0; i < this.length; i++){
            var tempRect = new Rect(
                this.x + k1*i * this.boxSize,
                this.y + k2*i * this.boxSize,
                this.boxSize, this.boxSize
            );
            this.body.push(tempRect);
        }
    }

    fitness = () => {
        return this.fitness;
    }

    calculate_fitness = () => {
        this.fitness = this.total_steps + (2 ** this.apples + 500 * this.apples ** 2.1) - (0.25 * this.total_steps ** 1.3 * this.apples ** 1.2);
        this.fitness = Math.max(this.fitness, .1);
    }

    reset = () => {
        this._fitness = 0
        this.apples = 0
        this.is_alive = true
        this.steps = 0
        this.total_steps = 0
        this.distance = 0
        this.x = 200
        this.y = 200
        this.length = 3

        this.initialize();
        this.head = this.body[0];
    }

    updateDirection = (inputs) => {
        this.network.feed_forward(inputs);
        if (this.network.out === 0) {
            if (this.direction !== "D")
                this.direction = "U";
        }
        else if (this.network.out === 1) {
            if (this.direction !== "U")
                this.direction = "D";
        }
        else if (this.network.out === 2) {
            if (this.direction !== "L")
                this.direction = "R";
        }
        else if (this.network.out === 3) {
            if (this.direction !== "R")
                this.direction = "L";
        }
    }

    // move a step forward
    addHead(collideWall=true) {
        var k1 = 0; var k2 = 0;
        if (this.direction == "R") k1 = 1;
        if (this.direction == "L") k1 = -1;
        if (this.direction == "U") k2 = -1;
        if (this.direction == "D") k2 = 1;

        if (!(collideWall)) {
            this.x = (this.x + k1*this.boxSize) % this.board_size[0];
            this.y = (this.y + k2*this.boxSize) % this.board_size[1];
        } else {
            this.x = (this.x + k1*this.boxSize);
            this.y = (this.y + k2*this.boxSize);
        }

        var newHead = new Rect(
            this.x, this.y,
            this.boxSize, this.boxSize
        );
        this.body.unshift(newHead);
        this.head = this.body[0];
    }

    deleteTail() {
        return this.body.pop();
    }

    collideWithBody() {
        for (var i = 1; i < this.body.length; i++) {
            var part = this.body[i];
            if (this.head.collideRect(part)) {
                return true
            }
        }
        return false;
    }

    collideWithWall(extraWalls=null) {
        // normal wall check
        var wallRect = new Rect(0, 0, this.board_size[0], this.board_size[1]);
        if ( !(wallRect.contains([this.x, this.y])) ) {
            return true;
        }
        // extra wall check
        if (extraWalls == null) return false;

        var bool = false;
        extraWalls.forEach(part => {
            if (this.head.collideRect(part)) {
                bool = true;
            }
        });
        return bool;
    }

    draw(p5) {
        p5.fill("#7ffc03");
        for (var i=0; i < this.body.length; i++) {
            var rect = this.body[i];
            p5.rect(rect.x, rect.y, this.boxSize, this.boxSize);
        }
    }
}

export class Apple {
    /*
    Apple Object for the snake game.
    Attributes:
    - boxLength
    - x
    - y
    */
    constructor(boxLength, x, y, board_x, board_y) {
        this.boxLength = boxLength;
        this.x = x;
        this.y = y;
        this.board_x = board_x;
        this.board_y = board_y;
        this.rect = new Rect(this.x, this.y, this.boxLength, this.boxLength);
    }

    // avoid: list of (x,y) arrays
    move(avoid=null) {
      const avoidCompare = (a, b) => util.arrayEqual(a, b);
      while (true) {
          var rand_x = util.getRandInt(0, this.board_x, this.boxLength);
          var rand_y = util.getRandInt(0, this.board_y, this.boxLength);
          var inAvoid = util.arrayContains(avoid, [rand_x,rand_y], avoidCompare);
          if (avoid == null || !(inAvoid)){
              break;
          }
      }
      // to do construct a more efficient random for large avoid.
      this.rect = new Rect(rand_x, rand_y, this.boxLength, this.boxLength);
      this.x = rand_x;
      this.y = rand_y;
    }

    draw(p5) {
        p5.fill('#ff0000');
        p5.rect(this.x, this.y, this.boxLength, this.boxLength);
        // p5.rect(0,0,50,50);
    }
}