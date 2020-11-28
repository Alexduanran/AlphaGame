import {HTML} from "./canvas";
import {snakeGame} from "./snakeGameClass";
import {Snake, Apple, Dummy} from "./snakeClass";
import React from "react";
import Sketch from 'react-p5';
import "p5";
import {
    CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE, 
    MANUAL_FPS, TEST_FPS, SNAKE_LENGTH,
    COLLIDE_WALL, COLLIDE_BODY, EXTRA_WALL,
    MANUAL,
    STATE_TYPE, REWARD_TYPE
} from "./config";
import * as util from "./util";

function SnakeEnv() {
    // var mutation_bins = null;

    const env_params = {
        width: CANVAS_WIDTH, height: CANVAS_HEIGHT, gridSize: GRID_SIZE, 
        FPS: MANUAL_FPS,
        snakeLength: SNAKE_LENGTH, 
        extraWalls: EXTRA_WALL,
        stateType: STATE_TYPE, rewardType: REWARD_TYPE,
        manual: MANUAL
    };

    let game = new snakeGame(env_params);

    const setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        p5.createCanvas(400, 400).parent(canvasParentRef);
    };
 
    const draw = (p5) => {
        p5.background(220);
        // p5.ellipse(50,50,80,80);

        // plot snake and apple
        game.snake.draw(p5);
        game.apple.draw(p5);

        // plot extra walls
        p5.fill("#999999")
        for (var i=0; i < game.extraWalls.length; i++) {
            var rect = game.extraWalls[i];
            p5.rect(rect.x, rect.y, game.gridSize, game.gridSize);
        }

        // draw a restart button
        p5.fill("#ffffff");
        p5.ellipse(375,25,20,20);
        p5.textSize(16);
        p5.fill("#ff0000");
        p5.text('R', 370, 30);

        p5.mouseClicked = () => {
            if (util.euclidean([p5.mouseX, p5.mouseY], [375,25]) <= 18){
                game.reset();
            }
        };

        // draw score
        p5.fill("#000000");
        p5.textSize(16);
        p5.text("Score: " + game.score, 10, 20);
        p5.text("Best Score: " + game.best_score, 10, 40);

    };

    return (
        <div width="400" id="snake_div">
            <Sketch setup={setup} draw={draw} />
        </div>
    );
}

export default SnakeEnv;