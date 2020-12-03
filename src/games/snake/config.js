import Sprite from "./sprite"

export const CANVAS_WIDTH = 20;
export const CANVAS_HEIGHT = 20;
export const GRID_SIZE = 20;

export const MANUAL_FPS = 3;
export const TEST_FPS = 10;

export const SNAKE_LENGTH = 1;

export const COLLIDE_WALL = true;
export const COLLIDE_BODY = true;
export const EXTRA_WALL = [
    // [6,7], [7,7], [8,7], [7,6], [7,8],
];
for (var row = 10; row <= 11; row++) {
    for (var col = 6; col <= 15; col++) {
        EXTRA_WALL.push([col, row]);
    }
}
// export const WALL_PIX_POS = true; // assume to be always true

export const MANUAL = true;

export const STATE_TYPE = "12bool";
export const REWARD_TYPE = "basic";

export const snakeSprite = new Sprite("image/skin_1.png");
export const appleSprite = new Sprite("image/star.png");
export const wallSprite = new Sprite("image/tile.png");
