import 'phaser';

var platforms;
var player;
var cursors;
var jumpButton;

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade:{
            gravity: {y: 200},
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

function preload ()
{
    this.load.image('tlo', 'assets/tlo.jpg');
    this.load.image('ground','assets/platform.png')
    this.load.image('jupiter','assets/Jupiter.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(400, 300, 'tlo');
    platforms = this.physics.add.staticGroup();

    platforms.create(400,568,'ground').setScale(2).refreshBody();
    platforms.create(600,400,'ground');
    platforms.create(50,250,'ground');
    platforms.create(750,220,'ground');

    player = this.physics.add.sprite(100,450,'dude');
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key:'left',
        frames: this.anims.generateFrameNumbers('dude',{ start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key:'turn',
        frames: [{key:'dude', frame:4}],
        frameRate: 20
    })

    this.anims.create({
        key:'right',
        frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    })

    this.physics.add.collider(player,platforms);

    cursors = this.input.keyboard.createCursorKeys();
    //jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  //  this.add.image(400,300,'jupiter');
    
}

function update(){
    if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.space.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }

}
