import Zombie from './zombie';
import Player from './player';
import Dictionary from './dictionary';
import GameOverScreen from './game_over_screen';

class Game {
  constructor(page, ctx, canvas, wordList, input, scoreInput, highScores) {
    this.page = page;
    this.ctx = ctx;
    this.canvas = canvas;
    this.wordList = wordList;
    this.input = input;
    this.scoreInput = scoreInput;
    this.highScores = highScores

    this.player = new Player(ctx);
    this.dictionary = new Dictionary();
    this.gameOverScreen = new GameOverScreen(page, ctx, canvas, input, scoreInput, wordList, highScores);

    this.zombies = {};
    this.dx = 2.5;
    this.dy = 0;
    this.zombieCount = 0;
    this.counter = 0;
    this.round = 1;
    this.alive = true;
    this.inputTimer = 0;
    this.attackTimer;
    this.typeStart = 0;
    this.typeEnd = 0;

    this.handleZombie = this.handleZombie.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  resetGame() {
    this.zombies = {};
    this.dx = 2.5;
    this.dy = 0;
    this.player.health = 100;
    this.zombieCount = 0;
    this.counter = 0;
    this.round = 1;
    this.alive = true;
    this.player.killCount = 0;
  }

  spawnZombies() {
    let x = -100;
    let y = Math.floor(Math.random() * (this.canvas.height-150)) + 50;
    
    for (let zomb in this.zombies) {
      if (this.zombies[zomb].x <= 150) {
        while (y < this.zombies[zomb].y + 100 && y > this.zombies[zomb].y - 100) {
          y = Math.floor(Math.random() * (this.canvas.height-150)) + 50;
        }
      }
    }
    let randomSpawn = Math.floor(Math.random() * 2.5) + (250 - this.round);
    if (this.counter % randomSpawn <= 2) {
      this.zombies[`zombie${this.zombieCount}`] = new Zombie(ctx, dictionary.randomWord(), 
                                                        x, y, this.dy, this.alive);
      this.zombieCount += 1;
    }
  }

  startTimer(e) {
    if (this.typeStart === 0 && e.target.value != " ") {
      this.typeStart = Date.now();
    }
  }

  handleZombie(e) {
    if (e.keyCode === 32 || e.keyCode === 13) {
      let value = this.input.value.trim();
      for (let zomb in this.zombies) {
        if (value === this.zombies[zomb].word) {
          this.attackTimer = counter;
          this.player.playerAttack = true;
          this.player.killCount += 1;
          this.zombies[zomb].word = null;
          this.zombies[zomb].alive = false;
          break;
        }
      }
      this.input.value = "";
      if (this.typeStart > 0) {
        this.typeEnd = Date.now();
        this.timer += (this.typeEnd - this.typeStart)/1000;
      }
      this.typeStart = 0;
    } 
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.addEventListener('click', this.input.focus())
    this.input.addEventListener('keydown', this.handleZombie);
    this.input.addEventListener('input', this.startTimer);
    let request = requestAnimationFrame(render);

    let fps = 12;
    let interval = 1000 / fps;
    let interval2 = 1000 / 300;

    let then = Date.now();
    let now = Date.now();
    let delta = now - then;
    
    if ((this.player.killCount / (this.inputTimer / 60))) {
      this.player.wpm = (this.player.killCount / (this.inputTimer / 60)).toFixed(2);
    } else {
      this.player.wpm = 0;
    }

    spawnZombies();
    this.player.drawWordList(this.zombies);
    this.player.drawWPM();
    this.player.drawKillCount();
      
    if (delta > interval2) {
      then = now - (delta % interval);
      for (let zomb in this.zombies) {
        let { x } = this.zombies[zomb];
        if (this.zombies[zomb].alive) {
          if (x < this.canvas.width - 200) {
            this.zombies[zomb].draw()
            if (this.zombies[zomb].x > 350) {
              if (this.zombies[zomb].y < this.canvas.height / 2) {
                this.zombies[zomb].dy = 2;
              } else if (this.zombies[zomb].y > this.canvas.height / 2) {
                this.zombies[zomb].dy = -2;
              } else {
                this.zombies[zomb].dy = 0;
              }
            }
            if (delta > interval) {
              then = now - (delta % interval);
              this.zombies[zomb].x += this.dx;
              this.zombies[zomb].y += this.zombies[zomb].dy;
              this.zombies[zomb].shift += 100.75;
              if (this.zombies[zomb].shift >= 1155) {
                this.zombies[zomb].shift = 0;
              }
            }

            Object.values(this.zombies).forEach((zombie, idx) => {
              if (idx < parseInt(zomb.slice(6))+3 && idx > parseInt(zomb.slice(6))) {
                if (this.zombies[zomb].x >= 20) {
                  if (this.zombies[zomb].y < zombie.y && this.zombies[zomb].y > zombie.y - 30) {
                    this.zombies[zomb].dy = -1;
                  } else if (this.zombies[zomb].y <= zombie.y + 30 && this.zombies[zomb].y >= zombie.y) {
                    this.zombies[zomb].dy = 1;
                  } else if (this.zombies[zomb].y === zombie.y) {
                    this.zombies[zomb].dy = 1;
                  } else {
                    this.zombies[zomb].dy = 0;
                  }
                }
              }
            })
          } else {
            this.zombies[zomb].drawAttack();
            if (delta > interval) {
              then = now - (delta % interval);
              this.zombies[zomb].deadShift += 97;
              if (this.zombies[zomb].deadShift >= 1140) {
                this.zombies[zomb].deadShift = 0;
              }
              this.player.health -= .3;
            }
          }
        } else {
          this.zombies[zomb].drawDead();
          if (delta > interval) {
            then = now - (delta % interval);
            this.zombies[zomb].deadShift += 97;
            if (this.zombies[zomb].deadShift >= 1250) {
              this.zombies[zomb].deadShift = 1254;
            }
          }
        }
      }
    }

    for (let zomb in zombies) {
      if (this.zombies[zomb].alive) {
        this.zombies[zomb].drawText()
      }
    }

    if (this.counter % 1000 === 0) {
      this.round += .5
    }

    setInterval(() => {
      this.counter += 10
    }, 500)

    if (this.player.health > 0) {
      this.player.drawHealth();
      this.player.draw();
      if (this.counter - this.attackTimer > 50) {
        this.player.playerAttack = false;
      }
    } else if (this.player.health <= 0) {
      this.player.health = 0;
      this.player.drawHealth();
      clearInterval(window.intervalId);
      cancelAnimationFrame(request)
      gameOverScreen.gameOver(this.player.wpm, this.player.killCount);
    }
  }
}

export default Game;