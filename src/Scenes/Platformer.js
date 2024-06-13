class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        //inital variables
        this.ACCELERATION = 250;
        this.DRAG = 1000;  
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.5;
        this.butterflycount = 0;
        this.sound.volume = .5;
        this.debug = true;
        this.physics.world.drawDebug = false;
        this.end = false;
    }

    create() {
        //create world
        this.map = this.add.tilemap("platformer-level-1", 19, 19, 40, 90);

        this.tileset = this.map.addTilesetImage("myplatformermap", "tilemap_tiles");

        this.groundLayer = this.map.createLayer("platforms", this.tileset, 0, 0);
        this.decorationLayer = this.map.createLayer("decoration", this.tileset, 0, 0);

        //set collisions and objects
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.butterflys = this.map.createFromObjects("Objects", {
            name: "butterfly",
            key: "tilemap_sheet",
            frame: 346
        });
        this.spikes = this.map.createFromObjects("spikeLayer", {
            name: "spikes",
            key: "tilemap_sheet",
            frame: 183
        });
        this.door = this.map.createFromObjects("Door", {
            name: "door",
            key: "tilemap_sheet",
            frame: 57
        });

        this.physics.world.enable(this.butterflys, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.spikes, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.door, Phaser.Physics.Arcade.STATIC_BODY);

        this.butterflysGroup = this.add.group(this.butterflys);
        this.spikeGroup = this.add.group(this.spikes);
        this.Door = this.add.group(this.door);

        //setup player
        my.sprite.player = this.physics.add.sprite(10, 400, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        this.physics.add.collider(my.sprite.player, this.groundLayer);

        //collision handling
        this.physics.add.overlap(my.sprite.player, this.butterflysGroup, (obj1, obj2) => {
            obj2.destroy();
            this.sound.play("pickup", {volume: 1});
            this.butterflycount++;
        });
        this.physics.add.overlap(my.sprite.player, this.spikeGroup, (obj1, obj2) => {
            this.sound.play("spikedeath");
            this.scene.restart();
        });
        this.physics.add.overlap(my.sprite.player, this.Door, (obj1, obj2) => {
            this.timerEvent.delay = 999999999999999999999999999999;
            this.end = true;
        });

        //key pulling
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');
        this.akey = this.input.keyboard.addKey('A');
        this.dkey = this.input.keyboard.addKey('D');
        this.ekey = this.input.keyboard.addKey('E');
        this.spacekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        //animations
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            scale: {start: .03, end: 0.0},
            maxAliveParticles: 6,
            lifespan: 350,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.doublejump = this.add.particles(0, 0, "kenny-particles", {
            frame: ['circle_01.png', 'circle_02.png'],
            scale: {start: .1, end: 0.01},
            maxAliveParticles: 1,
            lifespan: 100,
            delay: 0,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        //setup camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25)
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        //setup timer
        this.startTime = performance.now();
        this.timerText = this.add.text(970, 300, `${this.formatTime(this.levelTime)}`, { fontSize: '32px', fill: '#fff' });
        this.timerText.setScrollFactor(0);
        this.timerText.setScale(.5)

        this.timerEvent = this.time.addEvent({
            delay: 10,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - this.startTime;
        this.timerText.setText(`${this.formatTime(elapsedTime)}`);
    }

    formatTime(milliseconds) {
        const seconds = (milliseconds / 1000).toFixed(1);
        return seconds;
    }

    update() {
        //movement and animations
        if(!this.end){
            if(this.akey.isDown) {
                my.sprite.player.setAccelerationX(-this.ACCELERATION);
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
                my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2, false);
                my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                if (my.sprite.player.body.blocked.down) {
                    my.vfx.walking.start();
                } else {
                    my.vfx.walking.stop();
                }
            } else if(this.dkey.isDown) {
                my.sprite.player.setAccelerationX(this.ACCELERATION);
                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);
                my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-15, my.sprite.player.displayHeight/2, false);

                my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                if (my.sprite.player.body.blocked.down) {
                    my.vfx.walking.start();
                } else {
                    my.vfx.walking.stop();
                }
            } else {
                my.sprite.player.setAccelerationX(0);
                my.sprite.player.setDragX(this.DRAG);
                my.sprite.player.anims.play('idle');
                my.vfx.walking.stop();
            }
            if(!my.sprite.player.body.blocked.down) {
                my.sprite.player.anims.play('jump');
            }
            if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.spacekey)) {
                this.sound.play("jump");
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            }
            if(!my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.spacekey) && this.butterflycount > 0) {
                this.sound.play("jump2", {volume: .6});
                my.vfx.doublejump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2, false);
                my.vfx.doublejump.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                my.vfx.doublejump.start();
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.butterflycount--;
                this.time.delayedCall(100, () => {
                    my.vfx.doublejump.stop();
                });
            }
        }
        //level complete handling
        if (this.end){
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
            this.add.text(900, 180, 'E to continue to the next level.\nR to play to the level again.', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '25px'});
            if(this.ekey.isDown){
                this.scene.start("level3Scene");
            }
        }
        //restart handling
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}
