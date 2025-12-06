// Start of jQuery and Semantic UI 
$(document).ready(function () {
  // //////////////////
  // Global Variables
  ////////////////////
  const yourPoint = document.querySelector('#yourPoint');
  const scoreKeeper = document.querySelector('#scoreKeeper');
  const userMessage = document.querySelector('#userMessage');
  const generateRandom = () => Math.floor((Math.random() * 6) + 1);
  const randDirection = () => Math.floor(Math.random() * 4);
  const $diceFirst = $('.shape.demos .ui.shape.first');
  const $diceSecond = $('.shape.demos .ui.shape.second');
  const $directionButton = $('.shape.demos .direction .button');
  let playerScore = 0;
  let playersPointToHit = 0;
  let playersMoneyTextHolder = document.querySelector('#playersMoney');
  let playersBetTextHolder = document.querySelector('#playersBet');
  let playersMoney = 1000;
  let playersBet = 0;
  let userBetInput = document.querySelector('#betAmount');
  let playersMoneyText = playersMoneyTextHolder.textContent = `Your Money ${playersMoney}`;
  let betForm = document.querySelector('#betForm');
  const gameOverModal = document.querySelector('#gameOverModal');
  const betUpdater = () => {
    // 2nd jQuery method
    playersBet = +$(userBetInput).val();
    // 3rd jQuery method
    $(playersBetTextHolder).text(`Your Bet: ${playersBet}`)
    return playersBet;
  };

  // event listener
  betForm.addEventListener('submit', (e) => {
    e.preventDefault();
    betUpdater();
    if (playersBet > playersMoney) {
      playersMoneyTextHolder.textContent = 'You Do Not Have Enough For This Bet'
      setTimeout(() => { playersMoneyTextHolder.textContent = `Your Money:${playersMoney}` }, 2000)
      playersBet = 0;
      playersBetTextHolder.textContent = `Your Bet: ${playersBet}`
    }
  // end of event listener
  });
    
    // event handlers
  const handler = {
    rotate: function () {
      if (!playersBet) {
        playersMoneyTextHolder.textContent = 'You must place a bet first!'
        setTimeout(() => { playersMoneyTextHolder.textContent = `Your Money:${playersMoney}`}, 2000)
        return
      }
      
      let activeSides = document.querySelectorAll('.active');
      let randDieFlip1 = generateRandom();
      let randDieFlip2 = generateRandom();
      const die1Inc = randDieFlip1;
      const die2Inc = randDieFlip2;
      const direction = $(this).data('direction') || false;
      const animation = $(this).data('animation') || false;
      const die1Direction = ['up', 'left', 'right', 'down'];
      const die2Direction = ['down', 'up', 'right', 'left'];
      if (direction && animation) {
        while (randDieFlip1 > 0) {
          $diceFirst.shape(animation + '.' + die2Direction[randDirection()]);
          randDieFlip1 --;
        }
        while (randDieFlip2 > 0) {
          $diceSecond.shape(animation + '.' + die1Direction[randDirection()]);
          randDieFlip2--;
        }
      }

      const firstDiceValue = (+activeSides[0].dataset.val + Number(die1Inc)) % 6 || 6;
      const secondDiceValue = (+activeSides[1].dataset.val + Number(die2Inc)) % 6 || 6;
      playerScore = firstDiceValue + secondDiceValue;
      let playersPoint = `${playerScore} is your point.`
      scoreKeeper.textContent = `Current Roll: ${playerScore}`

        // //////////////////
        // Functions
        ////////////////////
      const isGameOver = (money) => {
        if (!money) {
          setTimeout(() => gameOverModal.classList.add('show'), 1500)
        }
      }
      
      const playerPointUpdater = () => {
        pointToHit = 0;
        playersPointToHit = 0;
        playerScore = 0;
      }

      const playerMoneyUpdater = () => {
        playersBet = 0;
        playersMoneyTextHolder.textContent = `Your Money: ${playersMoney}`
        playersBetTextHolder.textContent = `Your Bet: ${playersBet}`
      }
      
      const gameLogicBeforePoint = (score) => {
        const crappedOutLookup = [2, 3, 12];
        const beforePtWinLookup = [7,11];
        const pointLookup = [4,5,6,8,9,10];
        if (!playersPointToHit && crappedOutLookup.includes(score)) {
          userMessage.textContent = 'You Crapped Out';
          playerPointUpdater()
          playersMoney = playersMoney - playersBet;
          playerMoneyUpdater()
        } else if ((!playersPointToHit) && beforePtWinLookup.includes(score)) {
          userMessage.textContent = 'Winner';
          playersMoney = playersMoney + playersBet;
          playerMoneyUpdater()
        } else if (!playersPointToHit && pointLookup.includes(score)) {
          playersPointToHit = score;
          yourPoint.textContent = `Your Point: ${playersPointToHit}`;
          userMessage.textContent = playersPoint;
        }
        isGameOver(playersMoney)
      };
    
      const gameLogicAfterPoint = (pointToHit, score) => {
        if (pointToHit && (score === 7)) {
          userMessage.textContent = 'You Crapped Out';
          playerPointUpdater()
          yourPoint.textContent = 'Your Point:';
          playersMoney = playersMoney - playersBet;
          playerMoneyUpdater()
        } else if (pointToHit && (pointToHit == score)) {
          userMessage.textContent = 'You Win';
          playerPointUpdater()
          yourPoint.textContent = 'Your Point:';
          playersMoney = playersMoney + playersBet;
          playerMoneyUpdater()
        }
        isGameOver(playersMoney)
     };
  gameLogicAfterPoint(playersPointToHit, playerScore);
  gameLogicBeforePoint(playerScore);
    } // end of rotate FN

    // end of handler
  };
    $diceFirst.shape();
    $directionButton.on('click',handler.rotate); // end of event listener
}); // end of document get ready
    