import 'phaser';

var platforms;
var player;
var cursors;
var cursors2;
var diamonds;
var score = 0;
var scoreText;
var bats;
var doors;
var gameOver = false;

var config_music =
{
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
}


var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 350 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);

function preload() {
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    this.load.image('tlo', 'assets/tlo.jpg');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('jupiter', 'assets/Jupiter.png');
    this.load.image('diamond', 'assets/diament.png');
    this.load.image('door', 'assets/doors.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('bat', 'assets/bat_sprite.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('skeleton', 'assets/skeleton.png', { frameWidth: 48, frameHeight: 48 });
    this.load.audio('Spooky', 'assets/Spooky.mp3');

    this.load.on('progress', function (value) {
        console.log(value);
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
        console.log(file.src);
    });

    this.load.on('complete', function () {
        console.log('complete');
        loadingText.destroy();
        progressBar.destroy();
        progressBox.destroy();
    });
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
}

function create() {
    
    var img= this.add.image(400, 300, 'tlo');
    
    platforms = this.physics.add.staticGroup();
    this.sound.add('Spooky', config_music);
    this.sound.play('Spooky', config_music);
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');



    console.log(platforms);

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setDepth(2);
    doors = this.physics.add.group();
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
        frames: this.anims.generateFrameNumbers('bat', { start: 0, end: 15 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'move_left',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 12, end: 14 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'move_right',
        frames: this.anims.generateFrameNumbers('skeleton', { start: 24, end: 26 }),
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
    var bat = bats.create(500, 200, 'bat');
    var bat2 = bats.create(500, 130, 'bat');
    bat.setCollideWorldBounds(true);
    bat.setBounceY(0);
    bat.setGravityY(0.3);
    bat.setBounceX(0.9);
    bat.setVelocityX(150);
    bat.anims.play('move', true);

    bat2.setCollideWorldBounds(true);
    bat2.setBounceY(0);
    bat2.setGravityY(0.3);
    bat2.setBounceX(0.9);
    bat2.setVelocityX(140);
    bat2.anims.play('move', true);





    /*  var bat = bats.create(16, 16, 'bat');
         bat.setBounce(0.8);
         bat.setCollideWorldBounds(true);
         if (bat.x = 10)
         bat.setVelocity(Phaser.Math.Between(0, 200), 20);
         else
         bat.setVelocity(Phaser.Math.Between(-200, 0), 20);
         bat.anims.play('move', true);
         bat.allowGravity = false; */

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: 'white' });
    /* bats.prototype.update = function () {
  
         game.physics.arcade.collide(this, platforms, function (bats, platform) {
             // if slime is moving to the right, 
             // check if its position greater than the width of the platform minus its width
             // if slime is moving to the left, 
             // check if its position exceeds the left-most point of the platform
             if (bats.body.velocity.x > 0 && bats.x > platform.x + (platform.width - bats.width) ||
                     bats.body.velocity.x < 0 && bats.x < platform.x) {
                 bats.body.velocity.x *= -1; 
             } 
             if (bats.body.velocity.x > 0) {
                 bats.animations.play('move');
             } else {
                 bats.animations.play('move');
             }
         });
      
         game.physics.arcade.collide(this, bats, function (bat, bats) {
             bat.body.velocity.x *= -1.0001;
         });
      
     }; */



    this.physics.add.collider(bats, player, hitBat, null, this);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(bats, platforms, getback, null, this);
    this.physics.add.collider(diamonds, platforms);
    this.physics.add.collider(doors, platforms);
    this.physics.add.overlap(player, diamonds, collectDiamond, null, this);
    this.physics.add.overlap(player, doors, nextLevel, null, this);


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

function openTheDoor(player,door){
    if (diamonds.countActive(true) === 0){
        doors = this.physics.add.group({
            key: 'door',
            repeat: 1,
            setXY: {x: 760, y: 360}
        });
        doors.children.iterate(function(child){
            child.setScale(0.05);
        })
    }
}

function collectDiamond(player, diamond) {
    diamond.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);
    if (diamonds.countActive(true) === 0) {
        var door = doors.create(760, 360, 'door').setScale(0.05);
        door.setDepth(1);
        //  bat.setBounce(1);
        //bat.setCollideWorldBounds(true);
        //bat.setVelocity(Phaser.Math.Between(-200, 200), 20);
        //bat.anims.play('move', true);
        door.allowGravity = false;

    }
}

function nextLevel(door) {
    game.scene.add('Level', Level2, true, { x: 0, y: 0 });
    door.disableBody(true, true);
    // this.scene.remove();
    this.scene.start('Level', score);
}




function getback(bat, platforms) {

    // if slime is moving to the right, 
    // check if its position greater than the width of the platform minus its width
    // if slime is moving to the left, 
    // check if its position exceeds the left-most point of the platform

    if (bat.body.velocity.x > 0 && (bat.x + 200) > (platforms.x + platforms.width) ||
        (bat.body.velocity.x < 0 && bat.x < platforms.x - 200)) {
        bat.setVelocityX(bat.body.velocity.x * -1.1);
    }
}

function getback_skeleton(bat, platforms) {

    // if slime is moving to the right, 
    // check if its position greater than the width of the platform minus its width
    // if slime is moving to the left, 
    // check if its position exceeds the left-most point of the platform

    if (bat.body.velocity.x > 0 && (bat.x + 200) > (platforms.x + platforms.width) ||
        (bat.body.velocity.x < 0 && bat.x < platforms.x - 200)) {
        bat.setVelocityX(bat.body.velocity.x * -1.1);
    }
    if (bat.body.velocity.x > 0) {
        bat.anims.play('move_right', true);
    } else {
        bat.anims.play('move_left', true);
    }
}


function hitBat(player, bat) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
   game.scene.add('Highscore',Highscore,true,{x:0,y:0});
   this.input.keyboard.enabled = false;

}

class InputPanel extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'InputPanel', active: false });

        this.chars = [
            [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
            [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
            [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
        ];

        this.cursor = new Phaser.Math.Vector2();

        this.text;
        this.block;

        this.name = '';
        this.charLimit = 3;
    }

    create ()
    {
        let text = this.add.bitmapText(130, 50, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-');

        text.setLetterSpacing(20);
        text.setInteractive();

        this.add.image(text.x + 430, text.y + 148, 'rub');
        this.add.image(text.x + 482, text.y + 148, 'end');

        this.block = this.add.image(text.x - 10, text.y - 2, 'block').setOrigin(0);

        this.text = text;

        this.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
        this.input.keyboard.on('keyup_RIGHT', this.moveRight, this);
        this.input.keyboard.on('keyup_UP', this.moveUp, this);
        this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
        this.input.keyboard.on('keyup_ENTER', this.pressKey, this);
        this.input.keyboard.on('keyup_SPACE', this.pressKey, this);
        this.input.keyboard.on('keyup', this.anyKey, this);

        text.on('pointermove', this.moveBlock, this);
        text.on('pointerup', this.pressKey, this);

        
    }

    moveBlock (pointer, x, y)
    {
        let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
        let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
        let char = this.chars[cy][cx];

        this.cursor.set(cx, cy);

        this.block.x = this.text.x - 10 + (cx * 52);
        this.block.y = this.text.y - 2 + (cy * 64);
    }

    moveLeft ()
    {
        if (this.cursor.x > 0)
        {
            this.cursor.x--;
            this.block.x -= 52;
        }
        else
        {
            this.cursor.x = 9;
            this.block.x += 52 * 9;
        }
    }

    moveRight ()
    {
        if (this.cursor.x < 9)
        {
            this.cursor.x++;
            this.block.x += 52;
        }
        else
        {
            this.cursor.x = 0;
            this.block.x -= 52 * 9;
        }
    }

    moveUp ()
    {
        if (this.cursor.y > 0)
        {
            this.cursor.y--;
            this.block.y -= 64;
        }
        else
        {
            this.cursor.y = 2;
            this.block.y += 64 * 2;
        }
    }

    moveDown ()
    {
        if (this.cursor.y < 2)
        {
            this.cursor.y++;
            this.block.y += 64;
        }
        else
        {
            this.cursor.y = 0;
            this.block.y -= 64 * 2;
        }
    }

    anyKey (event)
    {
        //  Only allow A-Z . and -

        let code = event.keyCode;

        if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD)
        {
            this.cursor.set(6, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS)
        {
            this.cursor.set(7, 2);
            this.pressKey();
        }
        else if (code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE)
        {
            this.cursor.set(8, 2);
            this.pressKey();
        }
        else if (code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z)
        {
            code -= 65;

            let y = Math.floor(code / 10);
            let x = code - (y * 10);

            this.cursor.set(x, y);
            this.pressKey();
        }
    }

    pressKey ()
    {
        let x = this.cursor.x;
        let y = this.cursor.y;
        let nameLength = this.name.length;

        this.block.x = this.text.x - 10 + (x * 52);
        this.block.y = this.text.y - 2 + (y * 64);

        if (x === 9 && y === 2 && nameLength > 0)
        {
            //  Submit
            this.events.emit('submitName', this.name);
        }
        else if (x === 8 && y === 2 && nameLength > 0)
        {
            //  Rub
            this.name = this.name.substr(0, nameLength - 1);

            this.events.emit('updateName', this.name);
        }
        else if (this.name.length < this.charLimit)
        {
            //  Add
            this.name = this.name.concat(this.chars[y][x]);

            this.events.emit('updateName', this.name);
        }
    }
}

class Starfield extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Starfield', active: true });

        this.stars;

        this.distance = 300;
        this.speed = 250;

        this.max = 500;
        this.xx = [];
        this.yy = [];
        this.zz = [];
    }

    preload ()
    {
        this.load.image('star', 'assets/star4.png');
    }

    create ()
    {
        //  Do this, otherwise this Scene will steal all keyboard input
        this.input.keyboard.enabled = false;

        this.stars = this.add.blitter(0, 0, 'star');

        for (let i = 0; i < this.max; i++)
        {
            this.xx[i] = Math.floor(Math.random() * 800) - 400;
            this.yy[i] = Math.floor(Math.random() * 600) - 300;
            this.zz[i] = Math.floor(Math.random() * 1700) - 100;

            let perspective = this.distance / (this.distance - this.zz[i]);
            let x = 400 + this.xx[i] * perspective;
            let y = 300 + this.yy[i] * perspective;

            this.stars.create(x, y);
        }
    }

    update (time, delta)
    {
        for (let i = 0; i < this.max; i++)
        {
            let perspective = this.distance / (this.distance - this.zz[i]);
            let x = 400 + this.xx[i] * perspective;
            let y = 300 + this.yy[i] * perspective;

            this.zz[i] += this.speed * (delta / 1000);

            if (this.zz[i] > 300)
            {
                this.zz[i] -= 600;
            }

            let bob = this.stars.children.list[i];

            bob.x = x;
            bob.y = y;
        }
    }

}

class Highscore extends Phaser.Scene {

    constructor(score) {
        super({ key: 'Highscore', active: true });
        this.score
        this.playerText;
    }

    preload ()
    {
        this.load.image('block', 'assets/block.png');
        this.load.image('rub', 'assets/rub.png');
        this.load.image('end', 'assets/end.png');

        this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');
    }

    create ()
    {
        this.add.bitmapText(100, 260, 'arcade', 'RANK  SCORE   NAME').setTint(0xff00ff);
        this.add.bitmapText(100, 310, 'arcade', '1ST   50000').setTint(0xff0000);

        this.playerText = this.add.bitmapText(580, 310, 'arcade', '').setTint(0xff0000);

        //  Do this, otherwise this Scene will steal all keyboard input
        this.input.keyboard.enabled = true;
        game.scene.add('InputPanel',InputPanel,true,{x:0,y:0});
        this.scene.launch('InputPanel');

        let panel = this.scene.get('InputPanel');

        //  Listen to events from the Input Panel scene
        panel.events.on('updateName', this.updateName, this);
        panel.events.on('submitName', this.submitName, this);
    }

    submitName ()
    {
        this.scene.stop('InputPanel');

        this.add.bitmapText(100, 360, 'arcade', '2ND   40000    ANT').setTint(0xff8200);
        this.add.bitmapText(100, 410, 'arcade', '3RD   30000    .-.').setTint(0xffff00);
        this.add.bitmapText(100, 460, 'arcade', '4TH   20000    BOB').setTint(0x00ff00);
        this.add.bitmapText(100, 510, 'arcade', '5TH   10000    ZIK').setTint(0x00bfff);
    }

    updateName (name)
    {
        this.playerText.setText(name);
    }

}


class Level2 extends Phaser.Scene {

    constructor() {
        super({ key: 'Level', active: true });
        this.cursors2;
    }

    preload() {
        this.load.image('tlo', 'assets/tlo.jpg');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('jupiter', 'assets/Jupiter.png');
        this.load.image('diamond', 'assets/diament.png');
        this.load.image('door', 'assets/doors.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('bat', 'assets/bat_sprite.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('skeleton', 'assets/skeleton.png', { frameWidth: 48, frameHeight: 48 });
        this.load.audio('Spooky', 'assets/Spooky.mp3');


    }

    create() {
        this.add.image(400, 300, 'tlo');
        platforms = this.physics.add.staticGroup();
        this.sound.add('Spooky', config_music);
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');



        console.log(platforms);

        player = this.physics.add.sprite(100, 450, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.setDepth(2);
        doors = this.physics.add.group();




        cursors2 = this.input.keyboard.createCursorKeys();


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
        var bat = bats.create(16, 150, 'skeleton');
        var bat2 = bats.create(500, 130, 'skeleton');
        bat.setCollideWorldBounds(true);
        bat.setBounceY(0);
        bat.setGravityY(0.3);
        bat.setBounceX(0.9);
        bat.setVelocityX(150);
        // bat.anims.play('move_left', true);

        bat2.setCollideWorldBounds(true);
        bat2.setBounceY(0);
        bat2.setGravityY(0.3);
        bat2.setBounceX(0.9);
        bat2.setVelocityX(190);
        //  bat2.anims.play('move_right', true); 





        /*  var bat = bats.create(16, 16, 'bat');
             bat.setBounce(0.8);
             bat.setCollideWorldBounds(true);
             if (bat.x = 10)
             bat.setVelocity(Phaser.Math.Between(0, 200), 20);
             else
             bat.setVelocity(Phaser.Math.Between(-200, 0), 20);
             bat.anims.play('move', true);
             bat.allowGravity = false; */

        scoreText = this.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', fill: 'white' });
        /* bats.prototype.update = function () {
      
             game.physics.arcade.collide(this, platforms, function (bats, platform) {
                 // if slime is moving to the right, 
                 // check if its position greater than the width of the platform minus its width
                 // if slime is moving to the left, 
                 // check if its position exceeds the left-most point of the platform
                 if (bats.body.velocity.x > 0 && bats.x > platform.x + (platform.width - bats.width) ||
                         bats.body.velocity.x < 0 && bats.x < platform.x) {
                     bats.body.velocity.x *= -1; 
                 } 
                 if (bats.body.velocity.x > 0) {
                     bats.animations.play('move');
                 } else {
                     bats.animations.play('move');
                 }
             });
          
             game.physics.arcade.collide(this, bats, function (bat, bats) {
                 bat.body.velocity.x *= -1.0001;
             });
          
         }; */



        this.physics.add.collider(bats, player, hitBat, null, this);
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(bats, platforms, getback_skeleton, null, this);
        this.physics.add.collider(diamonds, platforms);
        this.physics.add.collider(doors, platforms);
        this.physics.add.overlap(player, diamonds, collectDiamond, null, this);


        //  this.add.image(400,300,'jupiter');
    }

    update() {
        if (cursors2.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors2.right.isDown) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors2.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }





}


