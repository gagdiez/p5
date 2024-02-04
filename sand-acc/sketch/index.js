import { GridHelper, EMPTY } from "./grid";

const rows = 80;
const cols = 80;
const canvas = { sx: 800, sy: 640 };
const Grid = new GridHelper({ rows, cols, canvas });

class Sketch {
  grid; hue; velocity;

  setup() {
    createCanvas(canvas.sx, canvas.sy);
    colorMode(HSB);
    this.hue = 1;
    this.grid = Grid.generate();

    // track velocity: how many rows a grain must fall
    this.velocity = this.grid.map(c => c.map(_ => 1))
  }

  draw() {
    for (let r = rows - 2; r >= 0; r--) {  // bottom -> up
      for (let c = 0; c < cols; c++) {  // left -> right
        const grain = this.grid[r][c];

        if (grain === EMPTY) continue  // nothing to compute

        let moved = false; // track if the grain moved

        for (let v = Math.floor(this.velocity[r][c]); v > 0; v--) {
          // check `a` rows below the current grain (v goes decreasing until 1)
          if (r + v < rows && this.grid[r + v][c] === EMPTY) {
            this.grid[r][c] = EMPTY;
            this.grid[r + v][c] = grain;

            this.velocity[r + v][c] = this.velocity[r][c] * 1.2; // increase velocity on the new position
            this.velocity[r][c] = 1; // clear velocity

            moved = true; break // it moved, no need to check further
          }
        }

        if (moved) continue;

        if (Math.random() > 0.7 && this.grid[r + 1][c - 1] === EMPTY) {
          this.grid[r][c] = EMPTY;  // erase
          this.grid[r + 1][c - 1] = grain;  // go down left
          continue
        }

        if (Math.random() > 0.7 && this.grid[r + 1][c + 1] === EMPTY) {
          this.grid[r][c] = EMPTY;  // erase
          this.grid[r + 1][c + 1] = grain;  // go down right
        }
      }
    }

    if (mouseIsPressed) {
      const { col, row } = Grid.screenToPos(mouseX, mouseY);
      const positionsToFill = Grid.circleAround(row, col, 3)

      for (let { r, c } of positionsToFill) {
        if (this.grid[r][c] === EMPTY) {
          this.hue = (this.hue + .2) % 360
          this.grid[r][c] = this.hue;
        }
      }
    }

    Grid.draw(this.grid);
  }
}

const sketch = new Sketch();
setup = sketch.setup;
draw = sketch.draw;
mousePressed = sketch.mousePressed;