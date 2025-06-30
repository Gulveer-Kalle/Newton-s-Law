let engine, world;
let ground;
let basket;
let apples = [];
let constraints = [];
let fixedPoints = [];

let treeImage, appleImage, basketImage;

let score = 0;
let gameState = "start";

let titleScale = 1;
let gameOverPulse = 0;
let particles = [];

function preload() {
  treeImage = loadImage('Images/tree.png');
  appleImage = loadImage('Images/apple.png');
  basketImage = loadImage('Images/basket.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Matter.Engine.create();
  world = engine.world;
  world.gravity.y = 1;
  world.gravity.scale = 0.001;

  ground = Matter.Bodies.rectangle(width / 2, height - 10, width, 20, {
    isStatic: true,
    label: "ground"
  });
  Matter.World.add(world, ground);

  basket = Matter.Bodies.rectangle(width / 2, height - 60, 180, 60, {
    isStatic: false,
    friction: 0,
    frictionAir: 0,
    label: "basket"
  });
  Matter.World.add(world, basket);
  basket.speed = 5;
  basket.direction = 1;

  for (let i = 0; i < 5; i++) {
    spawnNewApple();
  }

  Matter.Events.on(engine, 'collisionStart', handleCollisions);
}

function draw() {
  if (gameState === "start") {
    showStartScreen();
    return;
  }

  if (gameState === "end") {
    showEndScreen();
    return;
  }

  imageMode(CORNER);
  image(treeImage, 0, 0, width, height);

  Matter.Engine.update(engine);
  moveBasket();

  imageMode(CENTER);
  image(basketImage, basket.position.x, basket.position.y, 200, 150);

  stroke(0);
  strokeWeight(0);
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];

    if (constraints[i]) {
      let cons = constraints[i];
      line(cons.pointA.x, cons.pointA.y, apple.position.x, apple.position.y);
    }

    noStroke();
    image(appleImage, apple.position.x, apple.position.y, 50, 50);
  }

  fill(0);
  textSize(32);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 20, 20);
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "play";
    return;
  }
  if (gameState === "end") {
    location.reload();
    return;
  }
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    let d = dist(mouseX, mouseY, apple.position.x, apple.position.y);
    if (d < 25 && constraints[i]) {
      Matter.World.remove(world, constraints[i]);
      constraints[i] = null;
      break;
    }
  }
}

function moveBasket() {
  let posX = basket.position.x;

  if (posX <= 60) basket.direction = 1;
  if (posX >= width - 60) basket.direction = -1;

  Matter.Body.setVelocity(basket, {
    x: basket.speed * basket.direction,
    y: 0
  });
  basket.force.x = 0;
}

function handleCollisions(event) {
  let pairs = event.pairs;

  for (let pair of pairs) {
    let labels = [pair.bodyA.label, pair.bodyB.label];

    if (labels.includes("apple") && labels.includes("basket")) {
      let appleBody = pair.bodyA.label === "apple" ? pair.bodyA : pair.bodyB;
      removeApple(appleBody, true);
    }

    if (labels.includes("apple") && labels.includes("ground")) {
      let appleBody = pair.bodyA.label === "apple" ? pair.bodyA : pair.bodyB;
      removeApple(appleBody, false);
    }
  }
}

function removeApple(appleBody, scored) {
  let index = apples.findIndex(a => a === appleBody);
  if (index !== -1) {
    if (scored) {
      score++;
      basket.speed += 20;
      spawnNewApple();
    } else {
      gameState = "end";
    }

    Matter.World.remove(world, apples[index]);
    if (constraints[index]) Matter.World.remove(world, constraints[index]);
    apples.splice(index, 1);
    constraints.splice(index, 1);
  }
}

function spawnNewApple() {
  let pt = {
    x: random(100, width - 100),
    y: random(10, 150)
  };
  let apple = Matter.Bodies.circle(pt.x, pt.y + 50, 25, {
    restitution: 0.5,
    label: "apple"
  });
  let cons = Matter.Constraint.create({
    pointA: pt,
    bodyB: apple,
    length: 50,
    stiffness: 0.9
  });

  Matter.World.add(world, [apple, cons]);
  apples.push(apple);
  constraints.push(cons);
}


function showStartScreen() {
  imageMode(CORNER);
  image(treeImage, 0, 0, width, height);

  titleScale = 1 + Math.sin(frameCount * 0.1) * 0.05;
  textAlign(CENTER, CENTER);

  textSize(60 * titleScale);
  fill(255, 0, 0);
  textFont("Arial Black");
  text("Newton's Law", width / 2, height / 2 - 50);

  textSize(30);
  fill(0);
  text("Click anywhere to start", width / 2, height / 2 + 20);
}

function showEndScreen() {
  imageMode(CORNER);
  image(treeImage, 0, 0, width, height);

  textAlign(CENTER, CENTER);

  titleScale = 1 + Math.sin(frameCount * 0.1) * 0.05;
  textSize(60 * titleScale);
  fill(255, 0, 0);
  textFont("Arial Black");
  text("Game Over", width / 2, height / 2 - 50);

  textSize(32);
  fill(0);
  text(`Final Score: ${score}`, width / 2, height / 2);

  textSize(20);
  fill(0);
  text("Click anywhere to restart", width / 2, height / 2 + 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}