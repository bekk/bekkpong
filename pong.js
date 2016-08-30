//=============================================================================
// PONG
//=============================================================================
Pong = {

  Defaults: {
    width:            640,   // logical canvas width (browser will scale to physical canvas size - which is controlled by @media css queries)
    height:           480,   // logical canvas height (ditto)
    wallWidth:        12,
    paddleWidth:      12,
    paddleHeight:     60,
    paddleSpeed:      2,     // should be able to cross court vertically   in 2 seconds
    ballSpeed:        4,     // should be able to cross court horizontally in 4 seconds, at starting speed ...
    ballAccel:        8,     // ... but accelerate as time passes
    ballRadius:       5,
    endGameScore:     1,
    endGameScoreDemo: 9999,
    useControllers:   false,
    sound:            true
  },

  Colors: {
    walls:           '#887E6F',
    playerOne:       '#FD5158',
    playerTwo:       '#36BDB2',
    ball:            '#FFFFFF',
    score:           '#FFFFFF',
    footprint:       '#333',
    predictionGuess: 'yellow',
    predictionExact: 'red'
  },

  Images: [
  ],

  Levels: [
    {aiReaction: 0.2, aiError:  40}, // 0:  ai is losing by 8
    {aiReaction: 0.3, aiError:  50}, // 1:  ai is losing by 7
    {aiReaction: 0.4, aiError:  60}, // 2:  ai is losing by 6
    {aiReaction: 0.5, aiError:  70}, // 3:  ai is losing by 5
    {aiReaction: 0.6, aiError:  80}, // 4:  ai is losing by 4
    {aiReaction: 0.7, aiError:  90}, // 5:  ai is losing by 3
    {aiReaction: 0.8, aiError: 100}, // 6:  ai is losing by 2
    {aiReaction: 0.9, aiError: 110}, // 7:  ai is losing by 1
    {aiReaction: 1.0, aiError: 120}, // 8:  tie
    {aiReaction: 1.1, aiError: 130}, // 9:  ai is winning by 1
    {aiReaction: 1.2, aiError: 140}, // 10: ai is winning by 2
    {aiReaction: 1.3, aiError: 150}, // 11: ai is winning by 3
    {aiReaction: 1.4, aiError: 160}, // 12: ai is winning by 4
    {aiReaction: 1.5, aiError: 170}, // 13: ai is winning by 5
    {aiReaction: 1.6, aiError: 180}, // 14: ai is winning by 6
    {aiReaction: 1.7, aiError: 190}, // 15: ai is winning by 7
    {aiReaction: 1.8, aiError: 200}  // 16: ai is winning by 8
  ],

  //-----------------------------------------------------------------------------
  checkControllerStartGame: function (gp1, gp2) {
    /*
    * buttons[9] = start button
    * buttons[8] = select button
    * buttons[1] = a button
    * buttons[2] = b button
    * */

    if(gp1.buttons[9].pressed || gp2.buttons[9].pressed) {
      this.startDoublePlayer();
      this.Defaults.useControllers = true;
    } else if(gp1.buttons[8].pressed) {
      this.startSinglePlayer();
      this.Defaults.useControllers = true;
    } else if(gp1.buttons[1].pressed) {
      this.startDemo();
    } else if(gp1.buttons[2].pressed) {
      if (this.isDemo) {
        this.stop();
      }
    }
  },

  checkControllerMovement: function (gp, paddle) {
    if(this.Defaults.useControllers && !paddle.auto) {
      switch (gp.axes[1]) {
        case 1:
          // Move down
          paddle.stopMovingUp();
          paddle.moveDown();
          break;
        case -1:
          // Move up
          paddle.stopMovingDown();
          paddle.moveUp();
          break;
        default:
          // Stop moving
          paddle.stopMovingDown();
          paddle.stopMovingUp();
      }
    }
  },

  checkControllerButtonPressed: function () {
    // Player one controller
    var gp1 = navigator.getGamepads()[0];
    // Player two controller
    var gp2 = navigator.getGamepads()[1];

    // If player 2 is not connected, and we start two player with controllers
    // we set him to player 1. THIS SHOULD NEVER HAPPEN!
    if (!gp2) {
      gp2 = gp1;
    }

    this.checkControllerStartGame(gp1, gp2);
    // Check movement for player one
    this.checkControllerMovement(gp1, this.leftPaddle);
    // Check movement for player two
    this.checkControllerMovement(gp2, this.rightPaddle);
  },

  updateTime: function () {
    var timeDifference = parseInt((new Date() - this.startTime)/1000, 10);
    var seconds = ('0' + timeDifference % 60).slice(-2);
    var minutes = ('0' + parseInt(timeDifference/60)).slice(-2);

    document.getElementById("timer").innerHTML = minutes + ":" + seconds;
  },

  initialize: function(runner, cfg) {
    Game.loadImages(Pong.Images, function(images) {
      this.cfg         = cfg;
      this.runner      = runner;
      this.width       = runner.width;
      this.height      = runner.height;
      this.images      = images;
      this.playing     = false;
      this.scores      = [0, 0];
      this.menu        = Object.construct(Pong.Menu,   this);
      this.court       = Object.construct(Pong.Court,  this);
      this.leftPaddle  = Object.construct(Pong.Paddle, this);
      this.rightPaddle = Object.construct(Pong.Paddle, this, true);
      this.ball        = Object.construct(Pong.Ball,   this);
      this.sounds      = Object.construct(Pong.Sounds, this);
      this.runner.start();
    }.bind(this));
  },

  startDemo:         function() { this.start(0, true);},
  startSinglePlayer: function() { this.start(1, false);},
  startDoublePlayer: function() { this.start(2, false);},

  start: function(numPlayers, isDemo) {
    if (!this.playing) {
      //remove splash screen:
      document.getElementById("splash-begin").classList = "splash hidden";
      document.getElementById("splash-end").classList = "splash hidden";

      this.startTime = new Date();

      this.isDemo = isDemo;
      this.scores = [0, 0];
      this.playing = true;
      this.leftPaddle.setAuto(numPlayers < 1, this.level(0));
      this.rightPaddle.setAuto(numPlayers < 2, this.level(1));
      this.ball.reset();
      this.runner.hideCursor();

      this.endGameScore = isDemo ? this.Defaults.endGameScoreDemo : this.Defaults.endGameScore;
    }
  },

  stop: function(aborted) {
    if (this.playing) {
      if (this.isDemo || aborted) {
        document.getElementById("splash-begin").classList = "splash";
      } else {
        document.getElementById("splash-end").classList.remove("hidden");
        var diff = this.scores[this.menu.winner] - this.scores[1 - this.menu.winner];
        document.getElementById("end-info").innerHTML = "Spiller  " + (this.menu.winner +1) + " vant med " + diff + " poeng";
      }

      this.playing = false;
      this.leftPaddle.setAuto(false);
      this.rightPaddle.setAuto(false);
      this.runner.showCursor();
    }
  },

  level: function(playerNo) {
    return 8 + (this.scores[playerNo] - this.scores[playerNo ? 0 : 1]);
  },

  goal: function(playerNo) {
    this.sounds.goal();
    this.scores[playerNo] += 1;
    if (this.scores[playerNo] === this.endGameScore) {
      this.sounds.applause();
      this.menu.declareWinner(playerNo);
      this.stop();
    }
    else {
      this.ball.reset(playerNo);
      this.leftPaddle.setLevel(this.level(0));
      this.rightPaddle.setLevel(this.level(1));
    }
  },

  update: function(dt) {
    if (navigator.getGamepads()[0]) {
      this.checkControllerButtonPressed();
    }

    this.leftPaddle.update(dt, this.ball);
    this.rightPaddle.update(dt, this.ball);
    if (this.playing) {
      var dx = this.ball.dx;
      var dy = this.ball.dy;
      this.updateTime();
      this.ball.update(dt, this.leftPaddle, this.rightPaddle);
      if (this.ball.dx < 0 && dx > 0)
        this.sounds.ping();
      else if (this.ball.dx > 0 && dx < 0)
        this.sounds.pong();
      else if (this.ball.dy * dy < 0)
        this.sounds.wall();

      if (this.ball.left > this.width)
        this.goal(0);
      else if (this.ball.right < 0)
        this.goal(1);
    }
  },

  draw: function(ctx) {
    this.court.draw(ctx, this.scores[0], this.scores[1]);
    this.leftPaddle.draw(ctx);
    this.rightPaddle.draw(ctx);
    if (this.playing)
      this.ball.draw(ctx);
  },

  onkeydown: function(keyCode) {
    switch(keyCode) {
      case Game.KEY.ZERO:
        this.Defaults.useControllers = false;
        this.startDemo();
        break;
      case Game.KEY.ONE:
        this.Defaults.useControllers = false;
        this.startSinglePlayer();
        break;
      case Game.KEY.TWO:
        this.Defaults.useControllers = false;
        this.startDoublePlayer();
        break;
      case Game.KEY.ESC:
        this.stop(true);
        break;
      case Game.KEY.Q:
        if (!this.leftPaddle.auto)
          this.leftPaddle.moveUp();
        break;
      case Game.KEY.A:
        if (!this.leftPaddle.auto)
          this.leftPaddle.moveDown();
        break;
      case Game.KEY.P:
        if (!this.rightPaddle.auto)
          this.rightPaddle.moveUp();
        break;
      case Game.KEY.L:
        if (!this.rightPaddle.auto)
          this.rightPaddle.moveDown();
        break;
      default: console.log(keyCode);
    }
  },

  onkeyup: function(keyCode) {
    switch(keyCode) {
      case Game.KEY.Q: if (!this.leftPaddle.auto)  this.leftPaddle.stopMovingUp();    break;
      case Game.KEY.A: if (!this.leftPaddle.auto)  this.leftPaddle.stopMovingDown();  break;
      case Game.KEY.P: if (!this.rightPaddle.auto) this.rightPaddle.stopMovingUp();   break;
      case Game.KEY.L: if (!this.rightPaddle.auto) this.rightPaddle.stopMovingDown(); break;
    }
  },

  showStats:       function(on) { this.cfg.stats = on; },
  showFootprints:  function(on) { this.cfg.footprints = on; this.ball.footprints = []; },
  showPredictions: function(on) { this.cfg.predictions = on; },
  enableSound:     function(on) { this.cfg.sound = on; },

  //=============================================================================
  // MENU
  //=============================================================================

  Menu: {

    declareWinner: function(playerNo) {
      this.winner = playerNo;
    }

  },

  //=============================================================================
  // SOUNDS
  //=============================================================================

  Sounds: {

    initialize: function(pong) {
      this.game      = pong;
      this.supported = Game.ua.hasAudio;
      if (this.supported) {
        this.files = {
          ping: Game.createAudio("sounds/ping.wav"),
          pong: Game.createAudio("sounds/pong.wav"),
          wall: Game.createAudio("sounds/wall.wav"),
          goal: Game.createAudio("sounds/applause.wav"),
          applause: Game.createAudio("sounds/cheering.wav")
        };
      }
    },

    play: function(name) {
      if (this.supported && this.game.cfg.sound && this.files[name])
        this.files[name].play();
    },

    ping: function() { this.play('ping'); },
    pong: function() { this.play('pong'); },
    wall: function() { this.play('wall'); },
    goal: function() { this.play('goal'); },
    applause: function() { this.play('applause'); }

  },

  //=============================================================================
  // COURT
  //=============================================================================

  Court: {

    initialize: function(pong) {
      var w  = pong.width;
      var h  = pong.height;
      var ww = pong.cfg.wallWidth;

      this.ww    = ww;
      this.walls = [];
      this.walls.push({x: 0, y: 0,      width: w, height: ww});
      this.walls.push({x: 0, y: h - ww, width: w, height: ww});
      var nMax = (h / (ww*2));
      for(var n = 0 ; n < nMax ; n++) { // draw dashed halfway line
        this.walls.push({x: (w / 2) - (ww / 2), 
                         y: (ww / 2) + (ww * 2 * n), 
                         width: ww, height: ww});
      }

      var sw = 3*ww;
      var sh = 4*ww;
      this.score1 = {x: 0.5 + (w/2) - 1.5*ww - sw, y: 2*ww, w: sw, h: sh};
      this.score2 = {x: 0.5 + (w/2) + 1.5*ww,      y: 2*ww, w: sw, h: sh};
    },

    draw: function(ctx, scorePlayer1, scorePlayer2) {
      ctx.fillStyle = Pong.Colors.walls;
      for(var n = 0 ; n < this.walls.length ; n++)
        ctx.fillRect(this.walls[n].x, this.walls[n].y, this.walls[n].width, this.walls[n].height);
      this.drawDigit(ctx, scorePlayer1, this.score1.x, this.score1.y, this.score1.w, this.score1.h);
      this.drawDigit(ctx, scorePlayer2, this.score2.x, this.score2.y, this.score2.w, this.score2.h);
    },

    drawDigit: function(ctx, n, x, y, w, h) {
      ctx.fillStyle = Pong.Colors.score;
      var dw = dh = this.ww*4/5;
      var blocks = Pong.Court.DIGITS[n];
      if (blocks[0])
        ctx.fillRect(x, y, w, dh);
      if (blocks[1])
        ctx.fillRect(x, y, dw, h/2);
      if (blocks[2])
        ctx.fillRect(x+w-dw, y, dw, h/2);
      if (blocks[3])
        ctx.fillRect(x, y + h/2 - dh/2, w, dh);
      if (blocks[4])
        ctx.fillRect(x, y + h/2, dw, h/2);
      if (blocks[5])
        ctx.fillRect(x+w-dw, y + h/2, dw, h/2);
      if (blocks[6])
        ctx.fillRect(x, y+h-dh, w, dh);
    },

    DIGITS: [
      [1, 1, 1, 0, 1, 1, 1], // 0
      [0, 0, 1, 0, 0, 1, 0], // 1
      [1, 0, 1, 1, 1, 0, 1], // 2
      [1, 0, 1, 1, 0, 1, 1], // 3
      [0, 1, 1, 1, 0, 1, 0], // 4
      [1, 1, 0, 1, 0, 1, 1], // 5
      [1, 1, 0, 1, 1, 1, 1], // 6
      [1, 0, 1, 0, 0, 1, 0], // 7
      [1, 1, 1, 1, 1, 1, 1], // 8
      [1, 1, 1, 1, 0, 1, 0]  // 9
    ]

  },

  //=============================================================================
  // PADDLE
  //=============================================================================

  Paddle: {

    initialize: function(pong, rhs) {
      this.pong   = pong;
      this.width  = pong.cfg.paddleWidth;
      this.height = pong.cfg.paddleHeight;
      this.minY   = pong.cfg.wallWidth;
      this.maxY   = pong.height - pong.cfg.wallWidth - this.height;
      this.speed  = (this.maxY - this.minY) / pong.cfg.paddleSpeed;
      this.setpos(rhs ? pong.width - this.width : 0, this.minY + (this.maxY - this.minY)/2);
      this.setdir(0);
    },

    setpos: function(x, y) {
      this.x      = x;
      this.y      = y;
      this.left   = this.x;
      this.right  = this.left + this.width;
      this.top    = this.y;
      this.bottom = this.y + this.height;
    },

    setdir: function(dy) {
      this.up   = (dy < 0 ? -dy : 0);
      this.down = (dy > 0 ?  dy : 0);
    },

    setAuto: function(on, level) {
      if (on && !this.auto) {
        this.auto = true;
        this.setLevel(level);
      }
      else if (!on && this.auto) {
        this.auto = false;
        this.setdir(0);
      }
    },

    setLevel: function(level) {
      if (this.auto)
        this.level = Pong.Levels[level];
    },

    update: function(dt, ball) {
      if (this.auto)
        this.ai(dt, ball);

      var amount = this.down - this.up;
      if (amount != 0) {
        var y = this.y + (amount * dt * this.speed);
        if (y < this.minY)
          y = this.minY;
        else if (y > this.maxY)
          y = this.maxY;
        this.setpos(this.x, y);
      }
    },

    ai: function(dt, ball) {
      if (((ball.x < this.left) && (ball.dx < 0)) ||
          ((ball.x > this.right) && (ball.dx > 0))) {
        this.stopMovingUp();
        this.stopMovingDown();
        return;
      }

      this.predict(ball, dt);

      if (this.prediction) {
        if (this.prediction.y < (this.top + this.height/2 - 5)) {
          this.stopMovingDown();
          this.moveUp();
        }
        else if (this.prediction.y > (this.bottom - this.height/2 + 5)) {
          this.stopMovingUp();
          this.moveDown();
        }
        else {
          this.stopMovingUp();
          this.stopMovingDown();
        }
      }
    },

    predict: function(ball, dt) {
      // only re-predict if the ball changed direction, or its been some amount of time since last prediction
      if (this.prediction &&
          ((this.prediction.dx * ball.dx) > 0) &&
          ((this.prediction.dy * ball.dy) > 0) &&
          (this.prediction.since < this.level.aiReaction)) {
        this.prediction.since += dt;
        return;
      }

      var pt  = Pong.Helper.ballIntercept(ball, {left: this.left, right: this.right, top: -10000, bottom: 10000}, ball.dx * 10, ball.dy * 10);
      if (pt) {
        var t = this.minY + ball.radius;
        var b = this.maxY + this.height - ball.radius;

        while ((pt.y < t) || (pt.y > b)) {
          if (pt.y < t) {
            pt.y = t + (t - pt.y);
          }
          else if (pt.y > b) {
            pt.y = t + (b - t) - (pt.y - b);
          }
        }
        this.prediction = pt;
      }
      else {
        this.prediction = null;
      }

      if (this.prediction) {
        this.prediction.since = 0;
        this.prediction.dx = ball.dx;
        this.prediction.dy = ball.dy;
        this.prediction.radius = ball.radius;
        this.prediction.exactX = this.prediction.x;
        this.prediction.exactY = this.prediction.y;
        var closeness = (ball.dx < 0 ? ball.x - this.right : this.left - ball.x) / this.pong.width;
        var error = this.level.aiError * closeness;
        this.prediction.y = this.prediction.y + Game.random(-error, error);
      }
    },

    draw: function(ctx) {
      if(this.x === 0) {
        ctx.fillStyle = Pong.Colors.playerOne;
      } else {
        ctx.fillStyle = Pong.Colors.playerTwo;
      }
      ctx.fillRect(this.x, this.y, this.width, this.height);
      if (this.prediction && this.pong.cfg.predictions) {
        ctx.strokeStyle = Pong.Colors.predictionExact;
        ctx.strokeRect(this.prediction.x - this.prediction.radius, this.prediction.exactY - this.prediction.radius, this.prediction.radius*2, this.prediction.radius*2);
        ctx.strokeStyle = Pong.Colors.predictionGuess;
        ctx.strokeRect(this.prediction.x - this.prediction.radius, this.prediction.y - this.prediction.radius, this.prediction.radius*2, this.prediction.radius*2);
      }
    },

    moveUp:         function() { this.up   = 1; },
    moveDown:       function() { this.down = 1; },
    stopMovingUp:   function() { this.up   = 0; },
    stopMovingDown: function() { this.down = 0; }

  },

  //=============================================================================
  // BALL
  //=============================================================================

  Ball: {

    initialize: function(pong) {
      this.pong    = pong;
      this.radius  = pong.cfg.ballRadius;
      this.minX    = this.radius;
      this.maxX    = pong.width - this.radius;
      this.minY    = pong.cfg.wallWidth + this.radius;
      this.maxY    = pong.height - pong.cfg.wallWidth - this.radius;
      this.speed   = (this.maxX - this.minX) / pong.cfg.ballSpeed;
      this.accel   = pong.cfg.ballAccel;
    },

    reset: function(playerNo) {
      this.footprints = [];
      this.setpos(playerNo == 1 ?   this.maxX : this.minX,  Game.random(this.minY, this.maxY));
      this.setdir(playerNo == 1 ? -this.speed : this.speed, this.speed);
    },

    setpos: function(x, y) {
      this.x      = x;
      this.y      = y;
      this.left   = this.x - this.radius;
      this.top    = this.y - this.radius;
      this.right  = this.x + this.radius;
      this.bottom = this.y + this.radius;
    },

    setdir: function(dx, dy) {
      this.dxChanged = ((this.dx < 0) != (dx < 0)); // did horizontal direction change
      this.dyChanged = ((this.dy < 0) != (dy < 0)); // did vertical direction change
      this.dx = dx;
      this.dy = dy;
    },

    footprint: function() {
      if (this.pong.cfg.footprints) {
        if (!this.footprintCount || this.dxChanged || this.dyChanged) {
          this.footprints.push({x: this.x, y: this.y});
          if (this.footprints.length > 50)
            this.footprints.shift();
          this.footprintCount = 5;
        }
        else {
          this.footprintCount--;
        }
      }
    },

    update: function(dt, leftPaddle, rightPaddle) {

      pos = Pong.Helper.accelerate(this.x, this.y, this.dx, this.dy, this.accel, dt);

      if ((pos.dy > 0) && (pos.y > this.maxY)) {
        pos.y = this.maxY;
        pos.dy = -pos.dy;
      }
      else if ((pos.dy < 0) && (pos.y < this.minY)) {
        pos.y = this.minY;
        pos.dy = -pos.dy;
      }

      var paddle = (pos.dx < 0) ? leftPaddle : rightPaddle;
      var pt     = Pong.Helper.ballIntercept(this, paddle, pos.nx, pos.ny);

      if (pt) {
        switch(pt.d) {
          case 'left':
          case 'right':
            pos.x = pt.x;
            pos.dx = -pos.dx;
            break;
          case 'top':
          case 'bottom':
            pos.y = pt.y;
            pos.dy = -pos.dy;
            break;
        }

        // add/remove spin based on paddle direction
        if (paddle.up)
          pos.dy = pos.dy * (pos.dy < 0 ? 0.5 : 1.5);
        else if (paddle.down)
          pos.dy = pos.dy * (pos.dy > 0 ? 0.5 : 1.5);
      }

      this.setpos(pos.x,  pos.y);
      this.setdir(pos.dx, pos.dy);
      this.footprint();
    },

    draw: function(ctx) {
      var w = h = this.radius * 2;
      ctx.fillStyle = Pong.Colors.ball;
      ctx.fillRect(this.x - this.radius, this.y - this.radius, w, h);
      if (this.pong.cfg.footprints) {
        var max = this.footprints.length;
        ctx.strokeStyle = Pong.Colors.footprint;
        for(var n = 0 ; n < max ; n++)
          ctx.strokeRect(this.footprints[n].x - this.radius, this.footprints[n].y - this.radius, w, h);
      }
    }

  },

  //=============================================================================
  // HELPER
  //=============================================================================

  Helper: {

    accelerate: function(x, y, dx, dy, accel, dt) {
      var x2  = x + (dt * dx) + (accel * dt * dt * 0.5);
      var y2  = y + (dt * dy) + (accel * dt * dt * 0.5);
      var dx2 = dx + (accel * dt) * (dx > 0 ? 1 : -1);
      var dy2 = dy + (accel * dt) * (dy > 0 ? 1 : -1);
      return { nx: (x2-x), ny: (y2-y), x: x2, y: y2, dx: dx2, dy: dy2 };
    },

    intercept: function(x1, y1, x2, y2, x3, y3, x4, y4, d) {
      var denom = ((y4-y3) * (x2-x1)) - ((x4-x3) * (y2-y1));
      if (denom != 0) {
        var ua = (((x4-x3) * (y1-y3)) - ((y4-y3) * (x1-x3))) / denom;
        if ((ua >= 0) && (ua <= 1)) {
          var ub = (((x2-x1) * (y1-y3)) - ((y2-y1) * (x1-x3))) / denom;
          if ((ub >= 0) && (ub <= 1)) {
            var x = x1 + (ua * (x2-x1));
            var y = y1 + (ua * (y2-y1));
            return { x: x, y: y, d: d};
          }
        }
      }
      return null;
    },

    ballIntercept: function(ball, rect, nx, ny) {
      var pt;
      if (nx < 0) {
        pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                   rect.right  + ball.radius, 
                                   rect.top    - ball.radius, 
                                   rect.right  + ball.radius, 
                                   rect.bottom + ball.radius, 
                                   "right");
      }
      else if (nx > 0) {
        pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                   rect.left   - ball.radius, 
                                   rect.top    - ball.radius, 
                                   rect.left   - ball.radius, 
                                   rect.bottom + ball.radius,
                                   "left");
      }
      if (!pt) {
        if (ny < 0) {
          pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                     rect.left   - ball.radius, 
                                     rect.bottom + ball.radius, 
                                     rect.right  + ball.radius, 
                                     rect.bottom + ball.radius,
                                     "bottom");
        }
        else if (ny > 0) {
          pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                     rect.left   - ball.radius, 
                                     rect.top    - ball.radius, 
                                     rect.right  + ball.radius, 
                                     rect.top    - ball.radius,
                                     "top");
        }
      }
      return pt;
    }

  }

  //=============================================================================

}; // Pong
