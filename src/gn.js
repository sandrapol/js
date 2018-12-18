import 'phaser';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 350 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
       
    }
};
var cursors;
var player;
var platforms;
var diamonds;
var score = 0;
var scoreText;
var bats;
var gameOver = false;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('tlo', 'assets/tlo.jpg');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('jupiter', 'assets/Jupiter.png');
    this.load.image('diamond', 'assets/diament.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('bat', 'assets/bat_sprite.png', { frameWidth: 64, frameHeight: 64 });
}

function create() {
    this.cameras.main.setBounds(0, 0, 3200, 600).setName('main');
    cursors = this.input.keyboard.createCursorKeys();
   // createStarfield();
    //createLandscape();
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.player.setMaxVelocity(1000).setFriction(400, 200).setPassiveCollision();

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    })

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    })

    this.anims.create({
        key: 'move',
        frames: this.anims.generateFrameNumbers('bat', {start: 0, end: 15}),
        frameRate: 20,
        repeat: -1
    });

    

}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
    //  Position the center of the camera on the player
    //  We -400 because the camera width is 800px and
    //  we want the center of the camera on the player, not the left-hand side of it
  //  this.cameras.main.scrollX = this.player.x - 400;

}

function createStarfield() {
    var img = this.add.image(500, 400, 'tlo');
    img.setScrollFactor(0);
}

function createLandscape() {
    //  Draw a random 'landscape'

    var landscape = this.add.graphics();

    landscape.fillStyle(0x008800, 1);
    landscape.lineStyle(2, 0x00ff00, 1);

    landscape.beginPath();

    var maxY = 550;
    var minY = 400;

    var x = 0;
    var y = maxY;
    var range = 0;

    var up = true;

    landscape.moveTo(0, 600);
    landscape.lineTo(0, 550);

    do {
        //  How large is this 'side' of the mountain?
        range = Phaser.Math.Between(20, 100);

        if (up) {
            y = Phaser.Math.Between(y, minY);
            up = false;
        }
        else {
            y = Phaser.Math.Between(y, maxY);
            up = true;
        }

        landscape.lineTo(x + range, y);

        x += range;

    } while (x < 3100);

    landscape.lineTo(3200, maxY);
    landscape.lineTo(3200, 600);
    landscape.closePath();

    landscape.strokePath();
    landscape.fillPath();
}

function createAliens() {
    //  Create some random aliens moving slowly around

    var config = {
        key: 'metaleyes',
        frames: this.anims.generateFrameNumbers('face', { start: 0, end: 4 }),
        frameRate: 20,
        repeat: -1
    };

    this.anims.create(config);

    for (var i = 0; i < 32; i++) {
        var x = Phaser.Math.Between(100, 3100);
        var y = Phaser.Math.Between(100, 300);

        var face = this.impact.add.sprite(x, y, 'face');

        face.setLiteCollision().setBounce(1).setBodyScale(0.5);
        face.setVelocity(Phaser.Math.Between(20, 60), Phaser.Math.Between(20, 60));

        if (Math.random() > 0.5) {
            face.vel.x *= -1;
        }
        else {
            face.vel.y *= -1;
        }
    }
}