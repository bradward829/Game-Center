// ///////////////////////
// global variables
// ///////////////////////
const userImg = document.querySelector('.userImg');
const computerImg = document.querySelector('.computerImg');
const userHealth = document.querySelector('#userHealth')
const computerHealth = document.querySelector('#computerHealth')
let userFightChoice = null;
let computerFightChoice = null;
const computerWinModal = document.querySelector('#computerWinModal');
const userWinModal = document.querySelector('#userWinModal');
let gameIsOver = false;
const fightBannerImg = document.querySelector('.fightBannerImg')
const numberThree = document.querySelector('.numberThree')
const numberTwo = document.querySelector('.numberTwo')
const numberOne = document.querySelector('.numberOne')
const sky = document.querySelector('.sky')
const ground = document.querySelector('.ground')
let isGameStarted = false;
let level = 1
let lives = 5
const computerWinImg = document.querySelector('.computerWinImg')
const computerWinImg2 = document.querySelector('.computerWinImg2')
const userWinImg = document.querySelector('.userWinImg')
const userWinImg2 = document.querySelector('.userWinImg2')
const pauseButton = document.querySelector('.pauseButton')
const loginOverlay = document.querySelector('#loginOverlay')
const restartButton = document.querySelector('#restartButton')
const  nextLevel = document.querySelector('.nextLevel')
const levelText = document.querySelector('.levelText')
const livesText = document.querySelector('.livesText')
let isGamePaused = false;
let userWon = false
let computerWon = false
let difficulty = localStorage.getItem('difficulty')

const displayFightBanner = (whichLevel) => {
  if(gameIsOver) return
  if(level >= 5) return
  setTimeout(() => numberThree.classList.add('show'), 1000)
  setTimeout(() => numberThree.classList.remove('show'), 2000)
  setTimeout(() => numberTwo.classList.add('show'), 2000)
  setTimeout(() => numberTwo.classList.remove('show'), 3000)
  setTimeout(() => numberOne.classList.add('show'), 3000)
  setTimeout(() => numberOne.classList.remove('show'), 4000)
  setTimeout(() => fightBannerImg.classList.add('show'), 4000)
  setTimeout(() => fightBannerImg.classList.remove('show'), 5000)
  setTimeout(() => { isGameStarted = true; gameIsOver = false }, 5000)
}

displayFightBanner(level)
levelText.textContent = `Level: ${level}`
livesText.textContent = `Lives: ${lives}`

// ///////////////////////
// functions
// ///////////////////////
// Array method and String method
function formatStr(str) {
  return +str.match(/[0-9]/g).join('')
}

const showWinScreen = () => {
  userImg.style.left = '45vw'
  computerImg.classList.add('hide')
  sky.classList = 'winScreenSky'
  ground.classList.add('winScreenGround')
  userImg.classList.add('winScreenFighterImg')
  sky.insertAdjacentHTML('beforeend', `<div class="d-flex justify-content-evenly text-white fw-bold align-items-center h-50 flex-column"><h1>You Win!!!</h1><h4>Click Restart Above to Play Again</h4></div>`)
}

const showGameOverScreen = () => {
  loginOverlay.style.display ='flex'
  loginOverlay.insertAdjacentHTML('beforeend', `<div class="d-flex justify-content-evenly text-white fw-bold"><h1>Game Over</h1><div class="ui inverted green button invertedContainer mb-5" id="gameOverButton">Restart</div></div>`);
  gameIsOver = true
}

const resetGameDetails = (winner,whichLevel) => {
  if(!gameIsOver)return
  computerImg.style.left = '250px'
  userImg.style.left = '10px'
  userHealth.style.width = '100%'
  computerHealth.style.width = '100%'
  userWon = false
  computerWon = false
  gameIsOver = false
  isGameStarted = false

  if(winner === 'user') {
    computerImg.classList.remove('computerDead')
    computerImg.classList.add('computerImg')
    userWinModal.classList.add('d-none')
    userWinModal.classList.remove('show')    
  } else if (winner === 'computer'){
    userImg.classList.remove('userDead')
    userImg.classList.add('userImg')
    computerWinModal.classList.add('d-none')
    computerWinModal.classList.remove('show')
  }
    if(!lives) showGameOverScreen()
    if(whichLevel >= 5) showWinScreen()
    displayFightBanner()
}

const changeLevel = (winner, whichLevel) => {
  if (isGamePaused) return
  if(winner === 'user') {
      level++
      resetGameDetails('user',whichLevel)
    } else if(winner === 'computer') {
      lives--
      resetGameDetails('computer',whichLevel)
    }
  levelText.textContent = `Level: ${level}`
  livesText.textContent = `Lives: ${lives}`
  if((level === 2)) {
      sky.classList.add('oilRigBackground')
    } else if ((level === 3)) {
      sky.classList.add('rotatingCellBackground')
    }else if((level === 4)) {
      sky.classList.add('windTurbine')
    }else if((level >= 5)) {
      return showWinScreen()
    }
}

// Arrow function and If/Else Statment
const isGameOver = () => {
  if(userHealth.style.width === '0%') {
    if(lives === 1) {
      lives--
      showGameOverScreen()
    }
    computerWon = true
    gameIsOver = true;
    userClasses('userDead')
    setTimeout(() => {
      if(!lives) return
      computerWinModal.classList.remove('d-none')
      computerWinModal.classList.add('show')
      }, 1000)
    setInterval(() => {
      if(!lives) return
      computerWinImg2.style.display = 'none'
      computerWinImg.style.display = 'flex'
        setTimeout(() => {
        computerWinImg.style.display = 'none'
        computerWinImg2.style.display = 'flex'
      },500)
    },2000)
  } else if (computerHealth.style.width === '0%'){
      userWon = true
      gameIsOver = true;
      computerClasses('computerDead')
    
      setTimeout(() => {
        userWinModal.classList.remove('d-none')
        userWinModal.classList.add('show')
      }, 1000)
      setInterval(() => {
        userWinImg2.style.display = 'none'
        userWinImg.style.display = 'flex'
          setTimeout(() => {
          userWinImg.style.display = 'none'
          userWinImg2.style.display = 'flex'
        },500)
      },2000)
    }
}

// ///////////////////////
// user stuff
// ///////////////////////
const userHurt = () => {
  const userLoc =formatStr(userImg.style.left)
  const computerLoc = formatStr(computerImg.style.left)
  if(userLoc > computerLoc) return
  if((userFightChoice === 'userBlock')) return
  if (computerFightChoice === 'computerBlock') return
  if (!computerFightChoice) return
  userClasses('userImpact')
  let num = level
  userHealth.style.width = `${userHealth.style.width.match(/[0-9]/g).join('') - num}%`
  if (`${userHealth.style.width.match(/[0-9]/g).join('') - level}%` !== 0){
    userHealth.style.width = `${userHealth.style.width.match(/[0-9]/g).join('') - 1 }%`
  }
  isGameOver()
}

const diduserGetHurt = () => {
  if (computerFightChoice === 'computerBlock') return
  const userLoc =formatStr(userImg.style.left)
  const computerLoc = formatStr(computerImg.style.left)
  if((userLoc >= computerLoc - 30) && (computerFightChoice)) {
    userHurt()
  }
}

const userClasses = (className) => {
  if (!isGameStarted) return
  if (className === 'userImpact') {
    $(userImg).addClass("userImpact");
    setTimeout(() => {
      // jQuery chain and 4th and 5th jQuery Methods
      $(userImg).removeClass("userImpact").addClass("userImg");
      },200)
  } else if(className === 'userDead') {
    userImg.classList.add('userDead')
    return
  }else if (className === 'userBlock') {
    userImg.classList.add('userBlock')
    userFightChoice = className
  }
  userFightChoice = className
  userImg.classList.add(className)
  setTimeout(() => {
    userImg.classList.remove(className)
    userImg.classList.add('userImg')
  },300)
}

const userMovesLeft = () => {
  if (gameIsOver) return
  if (!isGameStarted) return
  const userLoc = formatStr(userImg.style.left);
  if (!userLoc) return;
  userClasses('userWalk')
    userImg.style.left = `${+userLoc - 10}px`;
}

const userMovesRight = () => {
  if (gameIsOver) return
  if (!isGameStarted) return
  const userLoc = formatStr(userImg.style.left);
  if(userLoc + 150 > window.innerWidth) return
  userClasses('userWalk')
    userImg.style.left = `${+userLoc + 10}px`;
}

const userJumps = () => {
  if (gameIsOver) return
  if (!isGameStarted) return
  const userTopLoc = formatStr(userImg.style.top)
  if (userImg.style.top !== '73vh') return
  userImg.style.top = `${+userTopLoc - 15}vh`;
  setTimeout(() => { userImg.style.top = '73vh'}, 200)
}

// ///////////////////////
// computer & AI stuff
// ///////////////////////

const shouldComputerStartFighting = () => {
  if(isGamePaused) return
  if (!isGameStarted) return
  if(gameIsOver) return
  const userLoc =formatStr(userImg.style.left)
  const computerLoc = formatStr(computerImg.style.left)
  if(userLoc > computerLoc - 70) {
    computerFights(computerFightChoice)
    diduserGetHurt()
    computerClasses(computerFightChoice)
  }
  if (userLoc + 30  < computerLoc) {
      computerMovesLeft()
  }else if (userLoc >= computerLoc) {
      computerMovesRight()
  }
}

const computerMovesLeft = () => {
  const userLoc = formatStr(userImg.style.left)
  const computerLoc = formatStr(computerImg.style.left)
  if (userLoc + 30 === computerLoc) return
  if (!computerLoc) return;
  computerImg.classList.add('computerWalk')
  setTimeout(() => {
    computerImg.style.left = `${+computerLoc - 10}px`;
    computerImg.classList.remove('computerWalk')
    computerImg.classList.add('computerImg')
  },200)
}


const computerMovesRight = () => {
  const computerLoc = formatStr(computerImg.style.left);
  if (!computerLoc) return;
  computerImg.classList.add('computerWalk')
  setTimeout(() => {
    computerImg.style.left = `${+computerLoc + 10}px`;
    computerImg.classList.remove('computerWalk')
    computerImg.classList.add('computerImg')
  },200)
}

const randomNum = () => Math.floor(Math.random() * 4);
const computerFights = () => computerFightChoice = ['computerKick','computerPunchRight','computerPunchLeft','computerBlock'].at(randomNum());
setInterval(() => shouldComputerStartFighting(), 400)

const computerClasses = (comClass) => {
    if(comClass === 'computerDead') {
       computerImg.classList.add('computerDead')
       return
      }
  computerImg.classList.add(comClass)
  setTimeout(() => {
    computerImg.classList.remove(comClass)
    computerImg.classList.add('computerImg')
      },200)
  if(!computerFightChoice) return
   computerImg.classList.add(computerFightChoice)
  setTimeout(() => {
    if (!computerFightChoice) return
    computerImg.classList.remove(computerFightChoice)
    computerImg.classList.add('computerImg')
    computerFightChoice = null;
  },200)
  isGameOver()
}
  
const computerHurt = () => {
  if(computerFightChoice === 'computerBlock') return
  if(userFightChoice === 'userBlock') return
  if(userFightChoice === 'userWalk') return
  if(!userFightChoice) return
  if(userFightChoice === 'userImpact') return
  const userLoc =formatStr(userImg.style.left)
  const computerLoc = formatStr(computerImg.style.left)
  if (userLoc > computerLoc) return
  if ((userLoc > computerLoc - 60)) {
    if (difficulty === 'easy') {
      computerHealth.style.width = `${computerHealth.style.width.match(/[0-9]/g).join('') - 4}%`
    } else if (difficulty === 'medium') {
      computerHealth.style.width = `${computerHealth.style.width.match(/[0-9]/g).join('') - 2}%`
    } else if (difficulty === 'hard') {
      computerHealth.style.width = `${computerHealth.style.width.match(/[0-9]/g).join('') - 1}%`
    }
    computerClasses('computerImpact')
  }
  userFightChoice = null
}
 
// ///////////////////////
// event listeners
// ///////////////////////
// event listener for striking
document.addEventListener("keyup", (e) => {
  if(isGamePaused) return
  const pressed = e.key;
  if (pressed === 'w') {
    userClasses('userKick');
  }else if (pressed === 'a') {
    userClasses('userBlock')
  }else if (pressed === 's') {
    userClasses('userPunchLeft');
  }else if(pressed === 'd') {
    userClasses('userPunchRight');
  }
  if(gameIsOver) return
  if(!isGameStarted) return
  computerHurt()
  isGameOver()
// end of event listener
});

// event listener for moving
document.addEventListener("keyup", (e) => {
  if(isGamePaused) return
  const pressed = e.key
  if (pressed === 'ArrowUp') {
    userJumps()
  } else if (pressed === 'ArrowLeft') {
    userMovesLeft()
  }else if (pressed === 'ArrowRight') {
    userMovesRight()
  }
  if(gameIsOver) return
  if(!isGameStarted) return
  isGameOver()
  // end of event listener
});

document.addEventListener("click", (e) => {
  if(e.target === restartButton) {
      location.reload()
    }else if (e.target === pauseButton && isGameStarted) {
      isGamePaused = true;
      loginOverlay.style.display ='flex'
    loginOverlay.insertAdjacentHTML('beforeend', `<div class="d-flex justify-content-center flex-column align-items-center m-5"><div class="ui inverted blue button mb-3 col-4" id="unpauseButton">Continue</div> <button type="button" class="btn btn-primary col-4 mb-5" data-bs-toggle="modal" data-bs-target="#exampleModal">Instructions</button></div>`);
    } else if (e.target === document.querySelector('#unpauseButton')) {
      loginOverlay.style.display ='none'
      isGamePaused = false
      loginOverlay.removeChild(loginOverlay.firstChild)
    } else if (e.target ===  nextLevel) {
      changeLevel('user', level)
    } else if (e.target === document.querySelector('.playAgainComputer')) {
      changeLevel('computer',level)
    } else if (e.target === document.querySelector('.playAgainUser')) {
      changeLevel('user',level)
    }else if(e.target === document.querySelector('#gameOverButton')) {
      location.reload()
    }
  isGameOver()
  // end of event listener
});

