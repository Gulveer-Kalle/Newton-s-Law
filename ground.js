class Ground {
  constructor(x, y, w, h) {
    this.body = Matter.Bodies.rectangle(x, y, w, h, { isStatic: true });
    this.w = w;
    this.h = h;
    Matter.World.add(world, this.body);
  }

  display() {
    let pos = this.body.position;
    fill(100);
    noStroke();
    rectMode(CENTER);
    rect(pos.x, pos.y, this.w, this.h);
  }
}