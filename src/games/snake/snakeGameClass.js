/*
1. stateType:
  - 0: boolean vector of size 12
  - 1:
2.
*/

import * as tf from '@tensorflow/tfjs';
// var tf = require("tensorflowjs");
import {Snake, Apple} from "./snakeClass";
import {colorGrid, Rect} from "./sprite"
import {generateExtraWalls, getRandInt, arrayEqual, euclidean} from "./util";


export class snakeGame {
    constructor(params) {
        // defaults
        this.FPS = 10;
        this.snakeLength = 3;

        this.collideWall = true;
        this.collideBody = true;
        this.extraWalls = null;

        this.manual = true;

        this.stateType = "12bool";
        this.rewardType = "eat-die-close-away";
        this.rewardValues = {
            eat: 10, die: -100, closer: 1, away: -1
        };

        for (var key in params) {
            // Game-side Attributes
            if (key == "collideWall") this.collideWall = params[key];
            if (key == "collideBody") this.collideBody = params[key];
            if (key == "extraWalls") this.extraWalls = params[key];

            if (key == "FPS") this.FPS = params[key];

            // Train-side Attributes
            if (key == "stateType") this.stateType = params[key];
            if (key == "rewardType") this.rewardType = params[key];
            if (key == "rewardValues") this.rewardValues = params[key];

            // Game Elements
            if (key == "snakeLength") this.snakeLength = params[key];
            if (key == "manual") this.manual = params[key];
        }

        // Mandatory
        this.dpr = 1;
        this.gridSize = params["gridSize"] * this.dpr;
        this.width = params["width"] * this.gridSize;
        this.height = params["height"] * this.gridSize;

        this.extraWalls = generateExtraWalls(this.extraWalls, this.gridSize, true);

        // initialize
        this.timer = null;

        this.snake = null;
        this.apple = null;

        this.done = 0;
        this.score = 0;
        this.best_score = 0;
        this.key_pressed = 0;

        this.reset();
        // this.render(); // now move render() inside reset()

        if (this.manual) {
            // player mode
            this.keyboard_events();
            // this.manual_play();
        }

        // attributes to compute reward
        this.last_snake = null;
        this.last_apple = null;
        this.rewardMeasures = {
            eat: 0, closer: 0, away: 0
        };
    }

    // STATICS
    _direction(action){
      const DIRECTION_ARR = ["U","R","D","L"];
      return DIRECTION_ARR[action];
    }

    _action(direction){
      const DIRECTION_ARR = ["U","R","D","L"];
      return DIRECTION_ARR.indexOf(direction);
    }

    // state space
    update_state() {
        if (this.stateType == "12bool") {
            return this.update_state_12bool();
        }
    }
    
    update_state_12bool() {
        // return a js array
        // update state from this.snake and this.apple
        // called after this.snake and this.apple are updated
        var new_state = Array(12).fill(0);

        // Direction of Snake
        if (this.snake.direction == "U") {
            new_state[0] = 1;
        } else if (this.snake.direction == "R") {
            new_state[1] = 1;
        } else if (this.snake.direction == "D") {
            new_state[2] = 1;
        } else if (this.snake.direction == "L") {
            new_state[3] = 1;
        }

        // Apple position (wrt snake head)
        // (0,0) at Top-Left Corner: U: -y; R: +x
        if (this.apple.y < this.snake.y) {
            // apple north snake
            new_state[4] = 1
        }
        if (this.apple.x > this.snake.x) {
            // apple east snake
            new_state[5] = 1
        }
        if (this.apple.y > this.snake.y) {
            // apple south snake
            new_state[6] = 1
        }
        if (this.apple.x < this.snake.x) {
            // apple west snake
            new_state[7] = 1
        }

        // Obstacle (Walls, body) position (wrt snake head)
        var test_snake;
        const test_case = {
            "U": {oppo: "D", x: 0, y: -this.gridSize, state: 8},
            "R": {oppo: "L", x: this.gridSize, y: 0, state: 9},
            "D": {oppo: "U", x: 0, y: this.gridSize, state: 10},
            "L": {oppo: "R", x: -this.gridSize, y: 0, state: 11}
        };
        for (var key in test_case) {
            var test = test_case[key];
            if (this.snake.direction != test["oppo"]) {
                test_snake = new Snake(
                    this.snake.x + test["x"], this.snake.y + test["y"], 
                    1, "U", this.gridSize, this.width, this.height
                )
                if (test_snake.collideWithWall(this.extraWalls)) {
                    new_state[test["state"]] = 1;
                }
            }
        }
        return tf.tensor2d(new_state, [1,12]);
    }

    // reward function
    reward() {
        if (this.rewardType == "eat-die-close-away") {
            return this.reward_basic();
        }
    }

    reward_basic() {
        const value = this.rewardValues;
        const check = this.rewardMeasures;

        if (this.done) return value["die"];
        if (check["eat"]) return value["eat"];
        if (check["closer"]) return value["closer"];
        if (check["away"]) return value["away"];
        return 0;
    }

    clear_reward() {
        // reset reward_measures
        for (var key in this.rewardMeasures) {
            this.rewardMeasures[key] = 0;
        }
    }

    // functions
    reset() {
        // return a js array
        this.done = 0;
        this.score = 0;

        this.snake = new Snake(
            getRandInt(5*this.gridSize, this.width-5*this.gridSize, this.gridSize),
            getRandInt(5*this.gridSize, this.width-5*this.gridSize, this.gridSize),
            this.snakeLength, this._direction(getRandInt(0,4)), this.gridSize,
            this.width, this.height
        );

        this.apple = new Apple(this.gridSize, 0, 0, this.width, this.height);
        this.move_apple();

        // this.render()

        // restart moving
        if (this.manual) {
            clearInterval(this.timer);
            this.manual_play();
        }
        
        // add update_state if used for training
        return this.update_state();
    }

    move_apple() {
        var avoid = this.snake.body.map(part => [part.x, part.y]);
        if (this.extraWalls != null){
            var avoid_wall = this.extraWalls.map(part => [part.x, part.y]);
            avoid = avoid.concat(avoid_wall);
        }
        this.apple.move(avoid);
    }

    update_score() {
        this.score = this.snake.body.length() - this.snakeLength;
        return this.score;
    }

    render() {
        var context = this.canvas.context;
        context.clearRect(0,0,this.width,this.height);
        // snake
        this.snake.body.forEach((part, i) => {
            part.draw(context, this.snakeSprite);
        });
        // extra wall
        if (this.extraWalls != null){
            this.extraWalls.forEach((part, i) => {
                part.draw(context, this.wallSprite);
            });
        }
        // apple
        this.apple.rect.draw(context, this.appleSprite);
    }

    manual_play() {
        // store value of this
        var self = this;
        this.timer = setInterval(function(){
            self.step();
            self.key_pressed = 0;
        }, 1000/this.FPS);
    }

    end_game() {
        this.done = 1;
        if (this.manual) {
            clearInterval(this.timer);
            console.log("You DIED!");
        } else {

        }
    }

    step(action=null) {
        if (this.done) return;

        // training purpose: change direction
        if (!(this.manual) && action != null) {
            // action: integer in [0, 1, 2, 3]
            this.snake.changeDirection(action);
            this.last_snake = this.snake.head;
            this.last_apple = this.apple.rect;
        }

        // move
        this.snake.addHead(this.collideWall);

        // wall collision
        var tempTail;
        if (this.snake.collideWithWall(this.extraWalls)) {
            this.end_game();
        } else {
            tempTail = this.snake.deleteTail();
        }
        // body collision
        if (this.snake.collideWithBody()) {
            this.end_game();
        }
        // eat apple
        if (this.snake.head.collideRect(this.apple.rect)) {
            // add tail back
            this.snake.addTail(tempTail);
            // move apple
            this.move_apple();
            // update game values (score)
            this.score += 1;
            if (this.score > this.best_score) {
                this.best_score = this.score;
            }
        } else {
            // no longer needs to deleteTail() because we use another time logic
            // this.snake.deleteTail();
        }

        // render
        // this.render();

        // conclude round
        if (this.manual) {
            return null;
        } else {
            return this.conclude_step();
        }
    }

    conclude_step() {
        // update eat-apple: 1 if apple moves
        this.rewardMeasures["eat"] = !(arrayEqual(
            [this.last_apple.x, this.last_apple.y],
            [this.apple.rect.x, this.apple.rect.y]
        ));
        // update closer or not
        const last_distance = euclidean(
            [this.last_snake.x, this.last_snake.y],
            [this.last_apple.x, this.last_apple.y]
        );
        const distance = euclidean(
            [this.snake.head.x, this.snake.head.y],
            [this.apple.rect.x, this.apple.rect.y]
        );
        this.rewardMeasures["closer"] = distance < last_distance;
        this.rewardMeasures["away"] = distance > last_distance;

        // leave for future uss (if adding new rewards)

        const next_state = this.update_state();
        const reward = this.reward();
        // clear reward measures
        this.clear_reward();

        return [next_state, reward, this.done, this.score];
    }

    keyboard_events() {
        // key control of snake
        document.body.addEventListener("keydown", (event) => {
            if (this.done) {
                console.log("Game ended");
                return null;
            }
            if (this.key_pressed) {
                console.log("key pressed in this round");
                return null;
            } else {
                this.key_pressed = 1;
            }
            const ARROW_ACTION = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
            const key = ARROW_ACTION.indexOf(event.key);

            this.snake.changeDirection(key);
        });
    }

}
