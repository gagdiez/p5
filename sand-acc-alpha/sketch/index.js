import { GridHelper, EMPTY } from "./grid";

const rows = 80;
const cols = 80;
const canvas = { sx: 800, sy: 640 };
const Grid = new GridHelper({ rows, cols, canvas });

class Sketch {
  grid; alpha; hue; velocity;

  setup() {
    createCanvas(canvas.sx, canvas.sy);
    colorMode(HSB);
    this.hue = 1;
    this.grid = Grid.generate();
    this.velocity = this.grid.map(c => c.map(_ => 1))
    this.alpha = this.grid.map(c => c.map(_ => 100))
  }

  draw() {
    for (let r = rows - 2; r >= 0; r--) {
      for (let c = 0; c < cols; c++) {
        const grain = this.grid[r][c];

        if (grain === EMPTY) continue

        if (this.alpha[r][c] < 100) {
          // clear grain trails
          this.grid[r][c] = EMPTY;
          this.alpha[r][c] = 100;
          continue
        }

        let moved = false;
        let alpha_factor = 1;
        for (let v = Math.floor(this.velocity[r][c]); v > 0; v--) {
          if (r + v < rows && this.grid[r + v][c] === EMPTY) {
            this.grid[r][c] = EMPTY;
            this.grid[r + v][c] = grain;
            this.velocity[r + v][c] = this.velocity[r][c] * 1.2;
            this.velocity[r][c] = 1;

            // leave a trail behind
            this.alpha[r + v][c] = 100 / alpha_factor;
            alpha_factor *= 1.3;

            moved = true;
          }
        }

        if (moved) continue;

        if (Math.random() > 0.7 && this.grid[r + 1][c - 1] === EMPTY) {
          this.grid[r][c] = EMPTY;
          this.grid[r + 1][c - 1] = grain;
          continue
        }

        if (Math.random() > 0.7 && this.grid[r + 1][c + 1] === EMPTY) {
          this.grid[r][c] = EMPTY;
          this.grid[r + 1][c + 1] = grain;
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

    Grid.draw(this.grid, this.alpha);
  }
}

const sketch = new Sketch();
setup = sketch.setup;
draw = sketch.draw;
mousePressed = sketch.mousePressed;