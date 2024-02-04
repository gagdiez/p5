export const EMPTY = '#000';

// Class that helps handling grids (generating, drawing, etc...)
export class GridHelper {
  rows; cols;
  height; width;
  offset; scene;

  constructor({ rows, cols, canvas }) {
    this.rows = rows;
    this.cols = cols;
    this.width = canvas.sx / cols;
    this.height = canvas.sy / rows;
  }

  validPos(c, r) { return r >= 0 && r < this.rows && c >= 0 && c < this.cols }

  circleAround(row, col, radius) {
    let positions = [];
    for (let r = row - radius; r <= row + radius; r++) {
      for (let c = col - radius; c <= col + radius; c++) {
        if (this.validPos(c, r) && ((r - row) ** 2 + (c - col) ** 2 <= radius ** 2)) {
          positions.push({ c, r })
        }
      }
    }
    return positions;
  }

  deepCopy(grid) {
    return JSON.parse(JSON.stringify(grid))
  }

  draw(grid) {
    background(EMPTY) // clear screen

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (grid[i][j] === EMPTY) continue; //nothing to draw

        fill(grid[i][j], 255, 255) // set color
        stroke(grid[i][j], 255, 255) // set stroke

        // compute pixel position and draw rectangle
        const { x, y } = { x: j * this.width, y: i * this.height };
        rect(x, y, this.width, this.height);
      }
    }
  }

  generate() {
    // create a grid of #rows by #cols
    let grid = []
    for (let r = 0; r < this.rows; r++) {
      const row = new Array(this.cols).fill(EMPTY)
      grid.push(row)
    }
    return grid
  }

  screenToPos(x, y) {
    let col = Math.floor(x / this.width);
    let row = Math.floor(y / this.height);

    col = col >= 0 && col < this.cols ? col : undefined;
    row = row >= 0 && row < this.rows ? row : undefined;

    return { col, row }
  }
}