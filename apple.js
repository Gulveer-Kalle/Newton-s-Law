class Apple {
  constructor(x, y, radius) {
    let options = {
      isStatic: true,
      restitution: 0.4,
      friction: 0.5
    };
    this.body = Matter.Bodies.circle(x, y, radius, options);
    this.radius = radius;
    Matter.World.add(world, this.body);
  }

  display() {
    let pos = this.body.position;
    imageMode(CENTER);
    image(appleImage, pos.x, pos.y, this.radius * 2, this.radius * 2);
  }

  fall() {
    Matter.Body.setStatic(this.body, false);
    Matter.Body.setVelocity(this.body, { x: 0, y: 1 }); // slower fall
  }
}