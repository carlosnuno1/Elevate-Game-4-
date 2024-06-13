class End extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    //key pulling
    preload() {
        this.rKey = this.input.keyboard.addKey('R');

    }

    create() {

    }


    update() {
        //text
        this.add.text(200, 200, '                             You Did It!!\n \n                                  Nice!!\n                      Press R to play again\n\n\n\n                             Dev Times: \n                             Level1 3.6\n                             Level2 5.7\n                             Level3 3.6\n                             Level4 8.0', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '50px'});
        //event handling
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start("level2Scene");
        }
        
    }
}