var config1 = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 300 },
            debug: false
        }
    },
    scale: {
                mode: Phaser.Scale.FIT,
                parent: 'phaser-example',
                width: 800,
                height: 600
            },
    scene:
    {
        preload: preload,
        create: create,
        update: update
    }
};


let info;
let timer;
let alive = 0;
var foodGroup;
var poison;
var player;
var berries;
var bushels;
var test;
var music;
var game = new Phaser.Game(config1);


function init ()
    {
        var element = document.createElement('style');

        document.head.appendChild(element);

        var sheet = element.sheet;

        var styles = '@font-face { font-family: "inconsolata"; src: url("assets/Inconsolata/static/Inconsolata/Inconsolata-SemiBold.ttf") format("opentype"); }\n';

        sheet.insertRule(styles, 0);
    }



function preload ()
    {
        this.add.tileSprite(400, 300, 696, 256, 'girl');
        this.load.image('bg', 'bg.jpg');
        this.load.image('food', 'food.png');
        this.load.image('poison', 'poison.png');
        this.load.image('bushels', 'bushels.png');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
        this.load.spritesheet('load', 'reworked/Sprites/load.png', { frameWidth: 51, frameHeight: 45 }); 
        this.load.spritesheet('girl', 'reworked/Sprites/run.png', { frameWidth: 64, frameHeight: 127 });
        this.load.audio('theme', ['theme.wav']);
    }

function create ()
    {

        // music
        var music = this.sound.add('theme');

        music.loop = true;
        music.play();

        // webfont 
        var add = this.add;
        var input = this.input;

        WebFont.load({
        custom: {
            families: [ 'Inconsolata' ]
        }
        });

        // loading screen

        const config = {
            key: 'load',
            frames: this.anims.generateFrameNumbers('load', { start: 0, end: 27, first: 7 }),
            frameRate: 8,
            repeat: -1
        };

        this.anims.create(config);

        this.add.sprite(400, 300, 'load').play('load');
        

        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
        this.physics.world.setBounds(80, 60, (1920 * 2)-160, (1080 * 2)-120);

        //  Mash 4 images together to create our background
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(1920, 0, 'bg').setOrigin(0).setFlipX(true);
        this.add.image(0, 1080, 'bg').setOrigin(0).setFlipY(true);
        this.add.image(1920, 1080, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);
        this.add.image(0, 0, 'bushels').setOrigin(0);
        this.add.image(1920, 0, 'bushels').setOrigin(0).setFlipX(true);
        this.add.image(0, 1080, 'bushels').setOrigin(0).setFlipY(true);
        this.add.image(1920, 1080, 'bushels').setOrigin(0).setFlipX(true).setFlipY(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        


        // player
        
        player = this.physics.add.sprite(400, 300, 'girl');

        player.setCollideWorldBounds(true);



        // player animation
 
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 11 }),
            frameRate: 8,
            // repeat: -1
         });
        

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('girl', { start: 12, end: 23 }),
            frameRate: 20,
            repeat: -1
         });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('girl', { start: 24, end: 35 }),
            frameRate: 20,
            repeat: -1
         });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('girl', { start: 36, end: 47 }),
            frameRate: 8,
            repeat: -1
         }); 
         
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('girl', { start: 48, end: 59 }),
            frameRate: 8,
            repeat: -1
         });
         

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.startFollow(player, true, 0.05, 0.05);
        

        // Display the game stats
        info = this.add.text(10, 10, '', { fontFamily: 'Inconsolata', fontSize:42, color: '#000000' });

        info.setDepth(2);
    
        berries = 0;

        
        foodGroup = this.physics.add.group({
            key: 'food',
            frameQuantity: 10,
            immovable: true
        });

        var children = foodGroup.getChildren();

        for (var i = 0; i < children.length; i++)
        {
            var x = Phaser.Math.Between(250, 3650);
            var y = Phaser.Math.Between(250, 1990);

            children[i].setPosition(x, y);
        }

        poisonGroup = this.physics.add.group({
            key: 'poison',
            frameQuantity: 1,
            immovable: true
        });

        var children = poisonGroup.getChildren();

        for (var i = 0; i < children.length; i++)
        {
            var x = Phaser.Math.Between(250, 3650);
            var y = Phaser.Math.Between(250, 1990);

            children[i].setPosition(x, y);
        }


        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(player, foodGroup, collectFood, null, this);

        info.setText('Berries: ' + berries).setScrollFactor(0);

        this.physics.add.collider(player, poisonGroup, collectPoison, null, this);

        // make bushels collide with player
        this.physics.add.collider(player, test);
        this.physics.add.collider(foodGroup, test);
        this.physics.add.collider(poisonGroup, test);
    }
    
    
function update ()
    {
        const cursors = this.input.keyboard.createCursorKeys();

        

        player.setVelocity(0);
     
        
    

        if (this.cursors.left.isDown)
        {
            player.setVelocityX(-500);
            if (this.cursors.up.isDown) {
                player.setVelocityY(-500);
            } else if  (this.cursors.down.isDown) {
                player.setVelocityY(500);
            }
            player.anims.play('left', true);
        }

        else if (this.cursors.right.isDown)
        {
            player.setVelocityX(500);
            if (this.cursors.up.isDown) {
                player.setVelocityY(-500);
            } else if  (this.cursors.down.isDown) {
                player.setVelocityY(500);
            }

            player.anims.play('right', true);
        }

        else if (this.cursors.up.isDown)
        {
            player.setVelocityY(-500);

            player.anims.play('up', true);
        }

        else if (this.cursors.up.isDown)
        {
            player.setVelocityY(-500);

            player.anims.play('up', true);
        }

        else if (this.cursors.down.isDown)
        {
            player.setVelocityY(500);

            player.anims.play('down', true);
        }

        else {
            player.anims.play('idle', true);
        }


    
        info.setText('Berries: ' + berries);

        
    }


function collectFood (player, food)
{
    food.disableBody(true, true);

    //  Add and update the score
    berries += 10;

    if (foodGroup.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        foodGroup.children.iterate(function (child) {

            var x = Phaser.Math.Between(250, 3650);
            var y = Phaser.Math.Between(250, 1990);

            child.enableBody(true, x, y, true, true);

        });

        var x = (player.x < 1920) ? Phaser.Math.Between(1920, 3650) : Phaser.Math.Between(100, 1920);
        var y = (player.y < 1080) ? Phaser.Math.Between(1080, 1950) : Phaser.Math.Between(100, 1080);


        var poison = poisonGroup.create(x, y, 'poison');
        

    }
  
}

function collectPoison (player, poison)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('idle');

    gameOver = true;
}