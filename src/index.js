import 'phaser';

var platforms;
var player;
var cursors;
var diamonds;
var score = 0;
var scoreText;
var bats;
var gameOver = false;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
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
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('tlo', 'assets/tlo.jpg');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('jupiter', 'assets/Jupiter.png');
    this.load.image('diamond', 'assets/diament.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('bat','assets/bat_sprite.png',{frameWidth:64, frameHeight:64});
}

function create() {
    this.add.image(400, 300, 'tlo');
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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

    cursors = this.input.keyboard.createCursorKeys();

    diamonds = this.physics.add.group({
        key: 'diamond',
        repeat: 6,
        setXY: { x: 12, y: 0, stepX: 120 }
    });

    diamonds.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
        child.setScale(0.1);
    });

    bats = this.physics.add.group();



    scoreText = this.add.text(16,16,'Score: 0', {fontSize: '32px', fill:'white'});
    this.physics.add.collider(bats,platforms);
    this.physics.add.collider(bats,player,hitBat,null,this);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(diamonds, platforms);

    this.physics.add.overlap(player, diamonds, collectDiamond, null, this);

    
    //  this.add.image(400,300,'jupiter');

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

}

function collectDiamond(player, diamond) {
    diamond.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if(diamonds.countActive(true) === 0){
        diamonds.children.iterate(function(child){
            child.enableBody(true,child.x,0,true,true);
        });
        var x = (player.x < 400) ? Phaser.Math.Between(400,800) : Phaser.Math.Between(0,400);
        var bat = bats.create(x,16,'bat');
        bat.setBounce(1);
        bat.setCollideWorldBounds(true);
        bat.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bat.anims.play('move',true);
        
    }
}

function hitBat(player,bat){
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}
