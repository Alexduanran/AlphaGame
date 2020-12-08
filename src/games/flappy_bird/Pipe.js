import settings from './settings';

const random = require('random');

class Pipe {
    // (x,y) is the coordinate of the midtop or midbottom of the pipe, depending on if the pipe is at top or bottom
    constructor(isBottom, x, y, height, width) {
        this.isBottom = isBottom
        this.x = x
        this.y = y
        this.height = height
        this.width = width
    }

    right_x = () => {
        return this.x + this.width / 2
    }

    left_x = () => {
        // console.log("left_x = () => {")
        // console.log(this.x)
        // console.log(this.width)
        return this.x - this.width / 2
    }

    top_or_bottom_y = () => {
        return this.y
    }

    top_y = () => {
        if (this.isBottom) 
            return this.y
        return this.y - this.height
    }

    bottom_y = () => {
        if (this.isBottom) 
            return this.y + this.height
        return this.y 
    }

    move = () => {
        this.x -= 5
    }
    
    collide = (x_pos, y_pos, target_sprite) => {
        const target_hwidth = target_sprite.width / 2 
        const target_hheight = target_sprite.height / 2
        if (x_pos >= this.left_x()-target_hwidth 
            && x_pos <= this.right_x()+target_hwidth 
            && y_pos >= this.top_y()-target_hheight 
            && y_pos <= this.bottom_y()+target_hheight) {
            // (x_pos,y_pos) is within the pipe with added padding of half of the width and height of the target_sprite on all 4 sides --> collision
            return true
        }
        return false
    }

    draw = (p5, pipe_sprite) => {
        p5.push()
        // translate(this.x_pos - this.size / 2 - 8 + birdSprite.width / 2, this.y_pos - this.size / 2 + birdSprite.height / 2);

        if (!this.isBottom) {
            p5.translate(this.left_x() + pipe_sprite.width, this.bottom_y());
            p5.rotate(Math.PI)
        } else {
            p5.translate(this.left_x(), this.top_y());
        }
        // p5.image(pipe_sprite, -pipe_sprite.width / 2, -pipe_sprite.height / 2)
        p5.image(pipe_sprite, 0, 0)

        // p5.image(pipe_sprite, 100, 100, 100, 100)
        p5.pop()
    }

    static create_pipe_pair = (Window_Width, height, width) => {
        // random_pipe_pos = random.choice([400, 500, 600, 700, 800])
        const random_pipe_pos = Math.floor(Math.random()*5)*25 + 120


        const bottom_pipe = new Pipe(true, Window_Width + settings['pipe_interval_in_pixels'], random_pipe_pos, height, width)
        const top_pipe = new Pipe(false, Window_Width + settings['pipe_interval_in_pixels'], random_pipe_pos - 100, height, width)
        console.log("Generating new pipe pair")
        console.log([bottom_pipe, top_pipe])
        return [bottom_pipe, top_pipe]


        // const bottom_pipe = new Pipe(true, Window_Width + 200, 200, height, width)
        // const top_pipe = new Pipe(false, Window_Width + 200, 100, height, width)
        // console.log("Generating new pipe pair")
        // console.log(bottom_pipe.x, bottom_pipe.y, bottom_pipe.left_x(), bottom_pipe.top_y())
        // console.log(top_pipe.x, top_pipe.y, top_pipe.left_x(), top_pipe.bottom_y())
        // return [bottom_pipe, top_pipe]

    }
}

export default Pipe;