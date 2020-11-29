class Ball {
    constructor(xBall, yBall, xSpeed, ySpeed) {
        this.xBall = xBall;
        this.yBall = yBall;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.xLast = xBall - xSpeed;
        this.yLast = yBall - ySpeed;

        this.is_alive = true;
        this.distance_travelled = 0;
    }
    

    update = (paddle, boardSize) => {
        this.distance_travelled += Math.abs(this.ySpeed);

        if (this.yBall < 0) {
            this.yBall = 0;
            this.ySpeed *= -1;
        }
        else if (this.yBall > boardSize[1]-20) {
            this.yBall = boardSize[1]-20;
            this.ySpeed *= -1;
        }
        else if (this.xBall > boardSize[0]-35) {
            this.xBall = boardSize[0]-35;
            this.xSpeed *= -1;
        }
        else if (this.yBall > paddle.yPaddle-10 && this.yBall < paddle.yPaddle + 80 && this.xLast > 15 && this.xBall <= 15) {
            this.xSpeed *= -1;
            paddle.hit += 1;
            paddle.distance_to_ball = 0;
        }
        else if (this.xBall < 0) {
            this.xSpeed *= -1;
            paddle.ball_travelled = this.distance_travelled;
            paddle.is_alive = false;
            paddle.distance_to_ball = Math.abs(this.xBall - paddle.xPaddle);
        }
    }

    move = () => {
        this.xLast = this.xBall;
        this.yLast = this.yBall;

        this.xBall += this.xSpeed;
        this.yBall += this.ySpeed;
    }

    draw = (p5) => {
        p5.fill('#d9c3f7');
        p5.ellipse(this.xBall, this.yBall, 20, 20);
    }
}

export default Ball;