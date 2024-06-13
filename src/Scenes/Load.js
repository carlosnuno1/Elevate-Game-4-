class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.atlas("platformer_characters", "monochrome_tilemap_transparent_packed.png", "mycharacter.json");

        this.load.image("tilemap_tiles", "monochrome_tilemap_packed.png");
        this.load.tilemapTiledJSON("platformer-level-1", "myplatformermap.tmj");
        this.load.tilemapTiledJSON("platformer-level-2", "level.tmj");
        this.load.tilemapTiledJSON("platformer-level-3", "thatnew.tmj");
        this.load.tilemapTiledJSON("platformer-level-4", "thefourth.tmj");

        this.load.spritesheet("tilemap_sheet", "monochrome_tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.audio("jump", "newjumpsound.mp3");
        this.load.audio("jump2", "secondjumpsound.mp3");
        this.load.audio("pickup", "pickupsound.mp3");
        this.load.audio("spikedeath", "spikedeath.mp3");

        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        cursors = this.input.keyboard.createCursorKeys();
        this.spacekey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 2,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

    }

    update() {
        this.add.text(200, 200, '                                      Elevate\n \n                                A to move left\n                              D to move right\n                               Space to jump\n    Collect butterflies to use them as double jumps\n           Reach the Door to get to the next level\n\n\n                          Press Space to Begin\n', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '50px'});
        if(this.spacekey.isDown) {
            this.scene.start("level2Scene");
        }
        
    }
}