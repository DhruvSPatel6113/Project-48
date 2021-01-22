var player, Virus, BackGround, BackGround2, InvisibleGround, sanitizer, health,
  bottles, bonusElement;

var enemy, sanitizers, players, bonusGroup;

var virusImage1, virusImage2, virusImage3, sanitizerimg, playerAnimation, BackGroundImg, BackGroundImg2,
  life1img, life2img, life3img;

var sanitizerBottles = 10;

var bottlesGroup, BottlesS;

var gameState = "start";

var life = 3;

var level = 0;

var score = 0;

function preload() {

  virusImage1 = loadImage("images/coronavirus.png");
  virusImage2 = loadImage("images/coronavirus2.png");
  virusImage3 = loadImage("images/coronavirus3.png");

  playerAnimation = loadAnimation("images/sprite1.png", "images/sprite2.png",
    "images/sprite3.png", "images/sprite4.png", "images/sprite5.png",
    "images/sprite6.png", "images/sprite7.png", "images/sprite8.png");

  BackGroundImg = loadImage("images/Background.jpg");
  BackGroundImg2 = loadImage("images/Background2.jpg");

  sanitizerimg = loadImage("images/sanitizer.png");

  life1img = loadImage("images/Full_life.png");
  life2img = loadImage("images/Half_life.png");
  life3img = loadImage("images/last_life.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  enemy = new Group();
  sanitizers = new Group();
  players = new Group();
  bottlesGroup = new Group();
  bonusGroup = new Group();

  BackGround = createSprite(width / 2, height / 2, width, height);
  BackGround2 = createSprite(width + (width / 2) - 75, height / 2, width, height + 50);

  InvisibleGround = createSprite(width / 2, height - 30, width, 5);

  player = createSprite(200, height - 60, 20, 20);
  player.addAnimation("animation", playerAnimation);
  player.scale = 0.5;

  health = createSprite(width / 2 - 200, 30, 10, 10);

  bottles = createSprite(width / 2 - 100, 30, 10, 10);
  bottles.addImage(sanitizerimg);
  bottles.scale = 0.2;

  InvisibleGround.visible = false;

}

function draw() {

  players.add(player);
  player.collide(InvisibleGround);
  player.setCollider("rectangle", 0, 0, 160, 270);

  if (gameState === "start") {

    background(0);

    textSize(25);
    fill("white");
    text("How to play the game?", width / 2 - 100, 100);

    textSize(20);
    fill("white");
    text("1) Use 'up' arrow key to move the player up.", width / 2 - 300, 200);
    text("2) press 's' to shoot sanitier on virus to kill it.", width / 2 - 300, 250);
    text("3) You will get only 10 sanitizer bottles and you will be able to collect another bottles in the game.", width / 2 - 300, 300);
    text("4) If your score reaches the target score you will win.", width / 2 - 300, 350);
    text("Press enter to start the game", width / 2 - 250, 400);

    if (keyDown("enter")) {

      reset();
      gameState = "play";

    }

  }

  if (gameState === "play") {

    BackGround.addImage(BackGroundImg);

    BackGround2.addImage(BackGroundImg2);

    BackGround.velocityX = -(2 + score / 5);
    BackGround2.velocityX = -(2 + score / 5);

    if (BackGround.x <= -width / 2 + 100) {

      BackGround.x = width + (width / 2) - 55;

    }

    if (BackGround2.x <= -width / 2 + 100) {

      BackGround2.x = width + (width / 2) - 55;

    }

    virus();
    creatingBottles();
    Sanitizer();
    distroyCorona();
    movingPlayer();
    addBottles();
    drawSprites();

    fill(0);
    textSize(20);
    text("score:" + score, width / 2, 30);

    text(" : " + sanitizerBottles, bottles.x + 10, bottles.y);

    text("Target score : 50", width / 2 - 150, bottles.y + 50);

    if (life === 3) {

      health.addImage(life1img);
      health.scale = 0.5;

    }

    else if (life === 2) {

      health.addImage(life2img);
      health.scale = 0.5;

    }

    else if (life === 1) {

      health.addImage(life3img);
      health.scale = 0.5;

    }

    for (var i = 0; i < enemy.length; i++) {

      if (life !== 1) {

        if (players.isTouching(enemy.get(i))) {

          enemy.get(i).destroy();
          life = life - 1;

        }
      }
    }

    for (var i = 0; i < enemy.length; i++) {

      if (life === 1) {

        if (players.isTouching(enemy.get(i))) {

          //background("red");
          textSize(30);
          stroke(0);
          fill(0);
          text("You Loose!", width / 2 - 150, height / 2 - 100);
          text("Press enter to restart the game or press q to quit", width / 2 - 300, height / 2);
          gameState = "end";

        }
      }
    }

    if (score === 50 && life !== 0) {

      //background("red");
      textSize(30);
      stroke(0);
      fill(0);
      text("You Win!", width / 2 - 150, height / 2 - 100);
      text("Press enter to restart the game or press q to quit", width / 2 - 300, height / 2);
      gameState = "end";

    }
  }

  else if (gameState === "end") {

    if (keyDown("enter")) {

      reset();
      gameState = "play";

    }

    if (keyDown("q")) {

      gameState = "start";

    }

  }

}

function virus() {

  var rand = Math.round(random(40, 80));

  if (frameCount % rand === 0) {

    var ran = Math.round(random(0, height - 50));
    Virus = createSprite(width + 20, ran, 10, 10);
    Virus.scale = 0.5;
    Virus.velocityX = -(2 + score / 5);
    Virus.lifetime = 700;
    Virus.setCollider("circle", 15, 0, 95);

    var rand = Math.round(random(1, 3));

    switch (rand) {

      case 1: Virus.addImage(virusImage1);
        break;
      case 2: Virus.addImage(virusImage2);
        break;
      case 3: Virus.addImage(virusImage3);
      default: break;

    }

    enemy.add(Virus);

    health.depth = Virus.depth;
    health.depth = health.depth + 1;
    bottles.depth = Virus.depth;
    bottles.depth = bottles.depth + 1;

  }
}

function Sanitizer() {

  if (keyWentDown("S") && sanitizerBottles !== 0) {

    sanitizer = createSprite(player.x, player.y, 10, 15);
    sanitizer.addImage(sanitizerimg);
    sanitizer.scale = 0.3;
    sanitizer.velocityX = 4;
    sanitizer.lifetime = 300;
    sanitizer.setCollider("rectangle", 0, 0, 100, 175);

    sanitizers.add(sanitizer);

    sanitizerBottles = sanitizerBottles - 1;

  }
}

function distroyCorona() {

  for (var k = 0; k < sanitizers.length; k++) {

    for (var i = 0; i < enemy.length; i++) {

      if (enemy.get(i).isTouching(sanitizers.get(k))) {

        enemy.get(i).destroy();
        score = score + 1;
        sanitizers.get(k).lifetime = 5;

      }
    }
  }
}

function addBottles() {

  for (var i = 0; i < bottlesGroup.length; i++) {

    if (players.isTouching(bottlesGroup.get(i))) {

      sanitizerBottles += 1;
      bottlesGroup.get(i).destroy();

    }

  }

}

function movingPlayer() {

  if (touches.length > 0 || keyDown("up")) {

    if (player.y > 90) {

      player.y = player.y - 4;

    }

  }

  player.y = player.y + 2;

}

function creatingBottles() {

  var rand = Math.round(random(80, 500));

  if (frameCount % rand === 0) {

    var ran = Math.round(random(0, height - 50));
    BottlesS = createSprite(width + 10, ran, 10, 15);
    BottlesS.addImage(sanitizerimg);
    BottlesS.scale = 0.3;
    BottlesS.velocityX = -(2 + score / 5);
    BottlesS.setCollider("rectangle", 0, 0, 100, 175);

    bottlesGroup.add(BottlesS);

  }
}

function reset() {

  BackGround.x = width / 2;
  BackGround2.x = width + (width / 2) - 75;
  player.y = height - 60;
  life = 3;
  score = 0;
  sanitizerBottles = 10;
  enemy.destroyEach();
  sanitizers.destroyEach();
  bottlesGroup.destroyEach();

}