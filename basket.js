class Basket {
  constructor(x, y, width, height) {
    this.body = Matter.Bodies.rectangle(x, y, width, height, { isStatic: true });
    this.width = width;
    this.height = height;
    this.speed = 20;
    this.direction = 1;
    Matter.World.add(world, this.body);
  }

  display() {
    let pos = this.body.position;
    imageMode(CENTER);
    image(basketImage, pos.x, pos.y, this.width, this.height);
  }

  move() {
    let pos = this.body.position;
    if (pos.x < 0 + this.width / 2 || pos.x > width - this.width / 2) {
      this.direction *= -1;
    }
    Matter.Body.translate(this.body, { x: this.speed * this.direction, y: 0 });
  }
}