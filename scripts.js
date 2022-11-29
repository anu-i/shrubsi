var config1 = {
    type: Phaser.AUTO,
    // width: 800,
    // height: 600,
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
var score;
var game = new Phaser.Game(config1);

// class Example extends Phaser.Scene
// {
//     constructor ()
//     {
//         super();
//     }

function preload ()
    {
        this.load.image('bg', 'mountain-lake.jpg');
        this.load.image('block', 'pin2.svg');
        this.load.image('food', 'pin.svg');
        this.load.image('poison', 'pin3.svg');
    }

function create ()
    {
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);
        this.physics.world.setBounds(0, 0, 1920 * 2, 1080 * 2);

        //  Mash 4 images together to create our background
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(1920, 0, 'bg').setOrigin(0).setFlipX(true);
        this.add.image(0, 1080, 'bg').setOrigin(0).setFlipY(true);
        this.add.image(1920, 1080, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        player = this.physics.add.image(400, 300, 'block');

        player.setCollideWorldBounds(true);

     
        this.cameras.main.startFollow(player, true, 0.05, 0.05);
        

        // Display the game stats
        info = this.add.text(10, 10, '', { font: '48px Arial', fill: '#000000' });

        timer = this.time.addEvent({ delay: 10000, callback: this.gameOver, callbackScope: this });
    
        score = 0;

        
        foodGroup = this.physics.add.group({
            key: 'food',
            frameQuantity: 10,
            immovable: true
        });

        var children = foodGroup.getChildren();

        for (var i = 0; i < children.length; i++)
        {
            var x = Phaser.Math.Between(150, 3750);
            var y = Phaser.Math.Between(150, 2050);

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
            var x = Phaser.Math.Between(150, 3750);
            var y = Phaser.Math.Between(150, 2050);

            children[i].setPosition(x, y);
        }


        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.overlap(player, foodGroup, collectFood, null, this);

        info.setText('Score: ' + score + '\nTime: ' + Math.floor(10000 - timer.getElapsed()));

        this.physics.add.collider(player, poisonGroup, collectPoison, null, this);
    }
    
    
function update ()
    {
        player.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            player.setVelocityX(-500);
        }
        else if (this.cursors.right.isDown)
        {
            player.setVelocityX(500);
        }

        if (this.cursors.up.isDown)
        {
            player.setVelocityY(-500);
        }
        else if (this.cursors.down.isDown)
        {
            player.setVelocityY(500);
        }

        info.setText('Score: ' + score + '\nTime: ' + Math.floor(10000 - timer.getElapsed()));
    }

// function gameOver ()
// {
//     {
//         this.input.off('gameobjectup');
//     }

// }


function collectFood (player, food)
{
    food.disableBody(true, true);

    //  Add and update the score
    score += 10;

    if (foodGroup.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        foodGroup.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 1400) ? Phaser.Math.Between(150, 3070) : Phaser.Math.Between(150, 2000);

        // var poison = poisonGroup.create(x, 16, 'poison');
        // // poisonGroup.setBounce(1);
        // poisonGroup.setCollideWorldBounds(true);
        // poisonGroup.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
  
}

function collectPoison (player, poison)
{
    this.physics.pause();

    // player.setTint(0xff0000);

    // player.anims.play('turn');

    gameOver = true;
}