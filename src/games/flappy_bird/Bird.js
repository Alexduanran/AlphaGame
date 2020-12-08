import settings from './settings';
import Individual from '../genetic_algorithm/individual';
import {FeedForwardNetwork, linear, sigmoid, tanh, relu, get_activation_by_name} from './neural_network';
import bluebird_sprite from "./assets/bluebird-midflap.png"
import redbird_sprite from "./assets/redbird-midflap.png"
import yellowbird_sprite from "./assets/yellowbird-midflap.png"



class Bird extends Individual{
    constructor(p5, 
                chromosome=null, 
                hidden_layer_architecture=[12, 20], 
                hidden_activation='relu', 
                output_activation='sigmoid',
                x_pos=settings['init_bird_x_pos'], 
                y_pos=settings['init_bird_y_pos'],
                y_speed=0) {

        super(Individual());

        this.Window_Width = settings['Window_Width'];
        this.Window_Height = settings['Window_Height'];

        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.y_speed = y_speed;
            
        // this.bird_surface = pygame.image.load("assets/bluebird-midflap.png").convert_alpha();
        // this.bird_surface = pygame.transform.scale2x(self.bird_surface);
        // this.bird_rect = self.bird_surface.get_rect(center = (self.x_pos, self.y_pos));
        this.bird_sprite = p5.loadImage(bluebird_sprite);
        this.champbird_sprite = p5.loadImage(redbird_sprite);
        this.winnerbird_sprite = p5.loadImage(yellowbird_sprite);
        // this.bird_surface = pygame.transform.scale2x(self.bird_surface);
        // this.bird_rect = self.bird_surface.get_rect(center = (self.x_pos, self.y_pos));

        this.fitness = 0;  // Overall fitness
        this.score = 0;
        this.x_distance_to_next_pipe_center = 0;
        this.y_distance_to_next_pipe_center = 0;
        this.is_alive = true;

        this.hidden_layer_architecture = hidden_layer_architecture;
        this.hidden_activation = hidden_activation;
        this.output_activation = output_activation;



        // Setting up network architecture
        const num_inputs = 5 //@TODO: how many
        this.network_architecture = [num_inputs]                          // Inputs
        this.network_architecture.push(...this.hidden_layer_architecture)  // Hidden layers
        this.network_architecture.push(2)                               // 2 output, jump or not jump
        this.network = new FeedForwardNetwork(this.network_architecture,
                                          get_activation_by_name(this.hidden_activation),
                                          get_activation_by_name(this.output_activation)
        )

        // If chromosome is set, take it
        if (chromosome) {
            // self._chromosome = chromosome
            this.network.params = chromosome
            // self.decode_chromosome()
        } 
    }







    fitness = () => {
        return this.fitness
    }

    bird_top = () => {
        return this.y_pos - this.bird_sprite.height / 2
    }
    bird_bottom = () => {
        return this.y_pos + this.bird_sprite.height / 2
    }
    bird_left = () => {
        return this.x_pos - this.bird_sprite.width / 2
    }
    bird_right = () => {
        return this.x_pos + this.bird_sprite.width / 2
    }

    
    calculate_fitness = () => {
        // # Give positive minimum fitness for roulette wheel selection
        // # self._fitness = (self._frames) + ((2**self.score) + (self.score**2.1)*500) - (((.25 * self._frames)**1.3) * (self.score**1.2))
        // # self._fitness = (self._frames) + ((2**self.score) + (self.score**2.1)*500) - (((.25 * self._frames)) * (self.score))
        // print(self.y_distance_to_next_pipe_center)
        this.fitness = (2 ** this.score + this.score * 2.1) * 200 + 1000 - this.x_distance_to_next_pipe_center - Math.abs(this.y_distance_to_next_pipe_center) * 20
        this.fitness = Math.max(this.fitness, .1)
    }

    // def chromosome(self):
    //     # return self._chromosome
    //     pass

    // def encode_chromosome(self):
    //     # # L = len(self.network.params) // 2
    //     # L = len(self.network.layer_nodes)
    //     # # Encode weights and bias
    //     # for layer in range(1, L):
    //     #     l = str(layer)
    //     #     self._chromosome['W' + l] = self.network.params['W' + l].flatten()
    //     #     self._chromosome['b' + l] = self.network.params['b' + l].flatten()
    //     pass

    // def decode_chromosome(self):
    //     # # L = len(self.network.params) // 2
    //     # L = len(self.network.layer_nodes)
    //     # # Decode weights and bias
    //     # for layer in range(1, L):
    //     #     l = str(layer)
    //     #     w_shape = (self.network_architecture[layer], self.network_architecture[layer-1])
    //     #     b_shape = (self.network_architecture[layer], 1)
    //     #     self.network.params['W' + l] = self._chromosome['W' + l].reshape(w_shape)
    //     #     self.network.params['b' + l] = self._chromosome['b' + l].reshape(b_shape)
    //     pass

    // restart the game for this individual
    reset= () => {
        this.fitness = 0
        this.score = 0
        this.x_distance_to_next_pipe_center = 0
        this.y_distance_to_next_pipe_center = 0
        this.x_pos = settings['init_bird_x_pos']
        this.y_pos = settings['init_bird_y_pos']
        this.y_speed = 0
        this.is_alive = true 
    }

    update = (inputs=null) => {
        this.network.feed_forward(inputs)
        if (this.network.out == 1) {
            // jump
            this.y_speed = settings['bird_jump_speed']
        }
        // console.log(this.is_alive)
        return true
    }

    move = (pipes) => {
        this.y_pos += this.y_speed
        this.y_speed += settings['gravity']
        // this.score += 1/1.2/60
        
        this.score += 1 / (settings['pipe_interval_in_pixels'] / 5)

        this.check_collision(pipes)
    }





    // ################################################################################################################
    // TODO: makes pipe class and make the pipe.collide()
    check_collision = (pipes) => {
        for (var pipe of pipes) {
            // if (this.bird_rect.colliderect(pipe)) {
            if (pipe.collide(this.x_pos, this.y_pos, this.bird_sprite)) {
                // console.log("collision detected with pipe")
                this.is_alive = false 
            }
        }
        if (this.bird_top() <= 0 || this.bird_bottom() >= this.Window_Height - 50) {
            // console.log("*****************************collision detected with floor/ceiling")
            this.is_alive = false 
        }
        // if (this.y_pos <= 0 || this.y_pos >= this.Window_Height - 50) {
        //     console.log(this.y_pos, this.bird_top, this.bird_bottom)
        //     console.log("*****************************collision detected with floor/ceiling")
        //     this.is_alive = false 
        // }
    }
    




   
    // rotate_bird = (bird_surface) => {
    //     new_bird = pygame.transform.rotozoom(bird_surface, self.y_speed * -3, 1)
    //     return new_bird
    // }



    // ################################################################################################################
    // TODO: what to do with the surfaces without pygame
    // # Draw the bird
    draw = (p5, winner=false, champion=false) => {
        if (!this.is_alive) {
            return
        } 

        p5.push()
        p5.translate(this.x_pos, this.y_pos);
        p5.rotate(this.y_speed / 20)
        if (champion) {
            p5.image(this.champbird_sprite, -this.champbird_sprite.width / 2, -this.champbird_sprite.height / 2)
        } else if (winner) {
            p5.image(this.winnerbird_sprite, -this.winnerbird_sprite.width / 2, -this.winnerbird_sprite.height / 2)
        } else {
            p5.image(this.bird_sprite, -this.bird_sprite.width / 2, -this.bird_sprite.height / 2)
        }
        p5.pop()
    }
}


export default Bird;













