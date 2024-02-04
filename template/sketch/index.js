class Sketch {
  setup() {
    createCanvas(400, 400);
    background('#028af8');
  }

  draw() {
    if (mouseIsPressed) {
      fill(0);
    } else {
      fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
  }
}

const sketch = new Sketch();
setup = sketch.setup;
draw = sketch.draw;