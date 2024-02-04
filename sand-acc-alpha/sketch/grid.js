export const EMPTY = '#000';

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

  draw(grid, alpha) {
    background(EMPTY)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const { x, y } = { x: j * this.width, y: i * this.height };
        if (grid[i][j] === EMPTY) continue;
        fill(grid[i][j], 255, alpha[i][j])
        stroke(grid[i][j], 255, alpha[i][j])
        rect(x, y, this.width, this.height);
      }
    }
  }

  generate() {
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