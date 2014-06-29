window.onload = function(){ //wait until the DOM's loaded
  //basically the test code from the website
  //initialize Quintus
  console.log("Hello?");
  Q = Quintus()
          .include("Sprites, Scenes, Input, 2D, Touch, UI")
          //.setup({ maximize: true })
          .setup({maximize:true})
          .controls().touch();
          
  //set up the player (Player extends Sprite)
  Q.Sprite.extend("Player",{
    init: function(p) { //when a Player is initialized
      this._super(p, { sheet: "player", x: 410, y: 90 }); //set his sprite to the player sprite
      this.add('2d, platformerControls'); // add physics
      
      this.on("hit.sprite",function(collision) { //if I touch another sprite
        if(collision.obj.isA("Tower")) { //that is a tower
          Q.stageScene("endGame",1, { label: "You Won!" }); //set the stage to the end game thing
          this.destroy(); //destroy self :D
        }
      });
    }
  });
  //set up the tower (Tower extends Sprite)
  Q.Sprite.extend("Tower", {
    init: function(p) {
      this._super(p, { sheet: 'tower' });
    }
  });

  Q.Sprite.extend("Enemy",{
    init: function(p) {
      this._super(p, { sheet: 'enemy', vx: 100 }); //do stuff but also set velocityX = 100
      this.add('2d, aiBounce');
      
      this.on("bump.left,bump.right,bump.bottom",function(collision) {
        if(collision.obj.isA("Player")) { 
          Q.stageScene("endGame",1, { label: "You Died" }); 
          collision.obj.destroy();
        }
      });
      
      this.on("bump.top",function(collision) {
        if(collision.obj.isA("Player")) { 
          this.destroy();
          collision.obj.p.vy = -300; //make the player hop
        }
      });
    }
  });

  Q.scene("level1",function(stage) {
    stage.collisionLayer(new Q.TileLayer({ dataAsset: '/game/levels/level.json', sheet: 'tiles' })); //load the level
    var player = stage.insert(new Q.Player());
    
    stage.add("viewport").follow(player); //camera follows player
    
    stage.insert(new Q.Enemy({ x: 700, y: 0 })); //put in some enemies
    stage.insert(new Q.Enemy({ x: 800, y: 0 }));
    
    stage.insert(new Q.Tower({ x: 180, y: 50 }));
  });

  Q.scene('endGame',function(stage) { //when the game ends
    var box = stage.insert(new Q.UI.Container({ //make a container
      x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)" //with these attributes
    }));
    
    var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", //button
                                             label: "Play Again" }))         
    var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h,  //label
                                          label: stage.options.label }));
    button.on("click",function() { //set event for button click
      Q.clearStages();
      Q.stageScene('level1');
    });
    box.fit(20);
  });

  Q.load("/game/img/sprites.png, /game/img/sprites.json, /game/levels/level.json, /game/img/tiles.png", function() { //load everything, and once we're done:
    console.log("loading stuff");
    Q.sheet("tiles","/game/img/tiles.png", { tilew: 32, tileh: 32 }); //store the sheet as "tiles"
    Q.compileSheets("/game/img/sprites.png","/game/img/sprites.json"); //compile the sprites
    Q.stageScene("level1"); //load the level1 stage
  });
};