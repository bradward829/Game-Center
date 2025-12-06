// /////////////////////////////
    // Global Variables
////////////////////////////////
const userContainer = document.querySelector('.user')
const computerContainer = document.querySelector('.computer')
const screenText = document.querySelector('.screenText')
const winsText = document.querySelector('.wins')
const lossesText = document.querySelector('.losses')
const userCardsLeft = document.querySelector('.userCardsLeft')
const computerCardsLeft = document.querySelector('.computerCardsLeft')
const winnerText = document.querySelector('.winnerText')

let gameIsStarted = false
let isWarTime = false
let deckRemainder = []
let userDeck = []
let computerDeck = []
let userWarArray = []
let computerWarArray =[]

// /////////////////////////////
    // Functions
////////////////////////////////
// deck maker fn
const deckMaker = () => {
  let deck = []
  const suit = ['spade','diamond','club','heart']
  const rank = ['two','three','four','five','six','seven','eight','nine','ten','jack','queen','king','ace']
  
  for(let i=0; i<suit.length;i+=1){
    for(let j=0; j<rank.length;j+=1){
      const card =
      {
        'suit': suit.at(i),
        'rank': rank.at(j),
        'index': j,
      }
      
      deck.push(card)
    }
  }
  return deck
}

// shuffle deck fn
const shuffleDeck = (deck) =>{
 deck = deck.sort(() => Math.random() - 0.5);
 userDeck = deck.splice(0,26)
 computerDeck = deck.splice(0,deck.length)
 printBoard(userDeck,computerDeck)
}
  

// print board fn
const printBoard = (user,computer) => {
  const userCard = user.splice(0,1)[0]
  const computerCard = computer.splice(0,1)[0]
  userContainer.classList.add(`${userCard.suit}-${userCard.rank}`)
  computerContainer.classList.add(`${computerCard.suit}-${computerCard.rank}`)
  evalWinner(userCard,computerCard)
}




// evaluate winner
const evalWinner = (userCard,computerCard) => {
  if(userCard.index > computerCard.index){
    screenText.textContent = 'You Win!!!'
    winnerText.textContent = '<=== You Won'

    if(isWarTime) {
      isWarTime = false
      userDeck = userDeck.concat(userWarArray,computerWarArray)
    }
    userDeck.push(userCard,computerCard)
    setTimeout(()=> resetGameBoard(),1000)
  
  } else if (userCard.index === computerCard.index) {
    screenText.textContent = 'You Tie!!!'
    console.log('tie in eval')
    isWarTime = true
    userWarArray = userDeck.splice(0,4)
    computerWarArray = computerDeck.splice(0,4)
    userWarArray.push(userCard)
    computerWarArray.push(computerCard)
    
    setTimeout(()=> resetGameBoard(),1000)
    
    // document.addEventListener('click', function(e){
    //   if(e.target === document.querySelector('.btn-primary')){
    //   }
    // })
    setTimeout(()=> {
       printBoard(userWarArray,computerWarArray)
    },2000)
      
  } else if (userCard.index < computerCard.index) {
    screenText.textContent = 'You Lose!!!'
    winnerText.textContent = 'Computer Won ===>'
    
    if(isWarTime) {
      isWarTime = false
      // console.log(computerDeck,computerWarArray,userWarArray)
      computerDeck = computerDeck.concat(computerWarArray,userWarArray)
      console.log(computerDeck)
    }
    // console.log(computerCard,userCard,computerDeck)
    computerDeck.push(computerCard,userCard)
    
    setTimeout(()=> resetGameBoard(),1000)
  }
  
}


// reset gameBoard fn
const resetGameBoard = () => {
  userContainer.classList.value = 'cardContainerStyles'
  computerContainer.classList = 'cardContainerStyles'
  
  // if(isWarTime){
  //   screenText.textContent = 'Click Deal for I declare war tie breaker'
  // }else {
  // screenText.textContent = 'Press deal to keep playing'
  // }
  screenText.textContent = 'Press deal to keep playing'
  winnerText.textContent = ''
  userCardsLeft.textContent = userDeck.length
  computerCardsLeft.textContent = computerDeck.length
  isGameOver(userDeck,computerDeck)
}

// end game function
const isGameOver = (user,computer) => {
  console.log(user,computer)
  if (!user.length) {
      screenText.textContent = 'THE ROBOTS WIN AGAIN REFRESH FOR REVENGE'
    }else if(!computer.length) {
      screenText.textContent = 'YOU WON THE GAME REFRESH TO PLAY AGAIN'
    }
  }

// event listener
document.addEventListener('click', function(e){
  if(e.target === document.querySelector('.btn-primary') && !gameIsStarted){
    shuffleDeck(deckMaker())
    gameIsStarted = true
  } else if (e.target === document.querySelector('.btn-primary') && gameIsStarted) {
    printBoard(userDeck,computerDeck)
  }
})