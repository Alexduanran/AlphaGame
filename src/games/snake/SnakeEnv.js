import {snakeGame} from "./snakeGameClass";
import {Agent} from "./agentClass";
import {train} from "./train.js";
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

function SnakeEnv(props) {
    // resize parameters

    // screen
    var screen_width = props.dimension[0];
    var screen_height = props.dimension[1];
    var adaptive_grid_size = Math.min(
        Math.floor(screen_width/CANVAS_WIDTH), Math.floor(screen_height/CANVAS_HEIGHT)
    );
    var screen_size = Math.min(screen_width, screen_height);
    // score text
    var text_size = Math.round(0.06*screen_size);
    // restart button
    var button_radius = Math.round(0.05*screen_width);
    var button_x = Math.round(0.9*screen_size);
    var button_y = Math.round(0.1*screen_size);

    // variables

    const env_params = {
        width: CANVAS_WIDTH, height: CANVAS_HEIGHT, 
        gridSize: adaptive_grid_size, 
        FPS: MANUAL_FPS,
        snakeLength: SNAKE_LENGTH, 
        extraWalls: EXTRA_WALL,
        stateType: STATE_TYPE, rewardType: REWARD_TYPE,
        manual: props.doManual
    };

    const agent_params  = {
        state_size: 12, action_size: 4 
    };

    let game = new snakeGame(env_params);
    let agent = new Agent(agent_params);

    let img_restart;

    const setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        var cnv = p5.createCanvas(screen_size, screen_size).parent(canvasParentRef);
        cnv.position(
            (screen_width - screen_size)/2, (screen_height - screen_size)/2
        );

        // train / test the model
        if (props.doTrain) {
            // alert("starting training");
            const train_params = {
                batch_size: 512, n_episodes: 100,
                max_moves: 1000, last_episode: 0,
                exp_replay: true
            };
            train(game, agent, train_params);
        }
    };
 
    const draw = (p5) => {
        p5.background(220);
        // p5.ellipse(50,50,80,80);

        // plot snake and apple
        p5.stroke(0, 0, 0);
        game.snake.draw(p5);
        game.apple.draw(p5);

        // plot extra walls
        p5.stroke(0, 0, 0);
        p5.fill("#999999");
        for (var i=0; i < game.extraWalls.length; i++) {
            var rect = game.extraWalls[i];
            p5.rect(rect.x, rect.y, game.gridSize, game.gridSize);
        }

        // draw a restart button
        p5.stroke(255,0,0);
        p5.fill(255, 0, 0, 200);
        p5.ellipse(button_x, button_y, button_radius, button_radius);

        p5.mouseClicked = () => {
            if (util.euclidean([p5.mouseX, p5.mouseY], [button_x, button_y]) <= 0.8*button_radius){
                game.reset();
            }
        };

        // draw score
        p5.stroke(0,0,0,0);
        p5.fill("#000000");
        p5.textSize(text_size);
        p5.text("Score: " + game.score, 0.5*text_size, text_size);
        p5.text("Best Score: " + game.best_score, 0.5*text_size, 2*text_size);

    };

    if (props.doTest) {
        return null;
    }

    return (
        <div id="snake_div">
            <Sketch setup={setup} draw={draw} />
        </div>
    );
}

export default SnakeEnv;