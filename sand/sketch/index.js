import { GridHelper, EMPTY } from "./grid";

const rows = 80;
const cols = 80;
const canvas = { sx: 800, sy: 640 };
const Grid = new GridHelper({ rows, cols, canvas });

class Sketch {
  grid; hue;

  setup() {
    createCanvas(canvas.sx, canvas.sy);
    colorMode(HSB);
    this.hue = 1;
    this.grid = Grid.generate();
  }

  draw() {
    for (let r = rows - 2; r >= 0; r--) { // bottom -> up
      for (let c = 0; c < cols; c++) { // left -> right
        const grain = this.grid[r][c];

        if (grain === EMPTY) continue // nothing to compute

        if (this.grid[r + 1][c] === EMPTY) {
          this.grid[r][c] = EMPTY; // erase
          this.grid[r + 1][c] = grain; // go down
          continue // skip next ifs
        }

        if (Math.random() > 0.7 && this.grid[r + 1][c - 1] === EMPTY) {
          this.grid[r][c] = EMPTY; // erase
          this.grid[r + 1][c - 1] = grain; // go down left
          continue // skip next if
        }

        if (Math.random() > 0.7 && this.grid[r + 1][c + 1] === EMPTY) {
          this.grid[r][c] = EMPTY; // erase
          this.grid[r + 1][c + 1] = grain; // go down right
        }
      }
    }

    if (mouseIsPressed) {
      const { col, row } = Grid.screenToPos(mouseX, mouseY);
      const positionsToFill = Grid.circleAround(row, col, 3)

      for (let { r, c } of positionsToFill) {
        if (this.grid[r][c] === EMPTY) { // do not overwrite
          this.hue = (this.hue + .2) % 360 // change color
          this.grid[r][c] = this.hue;
        }
      }
    }

    Grid.draw(this.grid); //draw
  }
}

const sketch = new Sketch();
setup = sketch.setup;
draw = sketch.draw;
mousePressed = sketch.mousePressed;