// import Sketch from 'react-p5';
// import Paddle from './Paddle';
// import Ball from './Ball';
// // import {FeedForwardNetwork, sigmoid, linear, relu} from './neural_network'
// // import Population from '../genetic_algorithm/population';
// // import {elitism_selection, roulette_wheel_selection} from '../genetic_algorithm/selection';
// // import {gaussian_mutation} from '../genetic_algorithm/mutation';
// // import {simulated_binary_crossover as SBX} from '../genetic_algorithm/crossover';
// // import {uniform_binary_crossover, single_point_binary_crossover} from '../genetic_algorithm/crossover';

// function Pong() {
//     var mutation_bins = null;

//     const setup = (p5, canvasParentRef) => {
//         // use parent to render the canvas in this ref
//         // (without that p5 will render the canvas outside of your component)
//         p5.createCanvas(500, 500).parent(canvasParentRef);
//         paddle = new Paddle(p5, 200, 375, 5, (500,500));
//         ball = new Ball(p5, 200, 200, 5, 5);
//     };
 
//     const draw = (p5) => {
//         p5.background(0);
//         // Paddle
//         paddle.draw(p5);
//         ball.draw(p5);
//         paddle.move();
//         ball.move();
//         ball.update(paddle, (500,500));
//         // paddle_(p5);
//     };

//     // const move = () => {
//     //     xBall += xSpeed;
//     //     yBall += ySpeed;
//     // } 

//     // const bounce = () => {
//     //     if (xBall < 10 ||
//     //         xBall > 400 - 10) {
//     //         xSpeed *= -1;
//     //       }
//     //       if (yBall < 10 ||
//     //         yBall > 400 - 10) {
//     //         ySpeed *= -1;
//     //     }
//     // }

//     const paddle_ = (p5) => {
//         if ((xBall > p5.mouseX &&
//             xBall < p5.mouseX + 90) &&
//           (yBall + 10 >= 375)) {
//           xSpeed *= -1;
//           ySpeed *= -1;
//           score++;
//           }
//     }

//     return (
//         <div>
//             <Sketch setup={setup} draw={draw} />
//         </div>
//     );
// }

// export default Pong;