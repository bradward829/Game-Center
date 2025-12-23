  // /////////////////////////////
    // Global Variables
////////////////////////////////
const stock = document.querySelector('.stock')
const foundation0 = document.querySelector('.foundation0')
const foundation1 = document.querySelector('.foundation1')
const foundation2 = document.querySelector('.foundation2')
const foundation3 = document.querySelector('.foundation3')
const table0 = document.querySelector('.table0')
const table1 = document.querySelector('.table1')
const table2 = document.querySelector('.table2')
const table3 = document.querySelector('.table3')
const table4 = document.querySelector('.table4')
const table5 = document.querySelector('.table5')
const table6 = document.querySelector('.table6')

let gameIsStarted = false
let haveCardToMove = false
let isInitialPrint = true

let gameTable =
{
  stock: [],
  foundation0: [],
  foundation1: [],
  foundation2: [],
  foundation3: [],
  table0: [],
  table1: [],
  table2: [],
  table3: [],
  table4: [],
  table5: [],
  table6: [],
  cardsMoving : null,
  movingLoc : null,
  oldCardLocation : null
}

let undoGameTable = {}

// /////////////////////////////
// Possible additions
////////////////////////////////
// ***An undo button
// *** A hint button




// /////////////////////////////
    // Functions
////////////////////////////////
// to determine color function
const colorChooser = (col) => (col === 'diamond' ||  col === 'heart') ? 'red' : 'black'

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
        'index': j + 1,
        'isShowingFace': false,
        // maybe add isClicked here
        'wasMoved': false,
        'color' : `${colorChooser(suit.at(i))}`
      }

      deck.push(card)
    }
  }
  return deck
}

// shuffle deck fn
const shuffleDeck = (deck) => deck.sort(() => Math.random() - 0.5);


// set card properties fn
const setCardProps = (stack,stackName) => {
if(!stack) return
if(haveCardToMove) return
  stack.forEach((elem,idx)=> {
    if(elem === stack[stack.length - 1] && isInitialPrint){
      elem.isShowingFace = true
      if(stackName !== 'stock') {
       elem.wasMoved = true
      }
    }else if (elem.wasMoved && stackName !== 'stock') {
      elem.isShowingFace = true
    }else {
      elem.isShowingFace = false
    }
  })
}

// set up game fn
const setUpGame = (deck) => {
   gameTable.table0 =  deck.splice(0,1)
   gameTable.table1 =  deck.splice(0,2)
   gameTable.table2 =  deck.splice(0,3)
   gameTable.table3 =  deck.splice(0,4)
   gameTable.table4 =  deck.splice(0,5)
   gameTable.table5 =  deck.splice(0,6)
   gameTable.table6 =  deck.splice(0,7)
   gameTable.stock =  deck.splice(0)
   printBoard(gameTable)
}

const shouldShowBack = (elem) => (!elem.isShowingFace) ? 'cardBack' : ''

// should be left or top margin fn

// cycle through deck fn
const cycleThroughDeck = (gameTable) => {
  gameTable.cardsMoving = gameTable.stock.splice([gameTable.stock.length - 1])
  gameTable.stock.unshift(...gameTable.cardsMoving)
  gameTable.cardsMoving = null
  printBoard(gameTable)
}

// print board fn
const printBoard = (deckObj, location) => {
  if(location) {
    deckObj[location].push(...deckObj.cardsMoving)
    haveCardToMove = false
    // THIS LINE BELOW IS STILL IN TESTING TO FIX A BUG
    gameTable.cardsMoving = false
  }

  for (let pile in deckObj){
    const currentPile = deckObj[pile]
    const currLoc = document.querySelector(`.${pile}`)
    setCardProps(currentPile,pile)
     while(currLoc.firstChild) currLoc.removeChild(currLoc.firstChild)

    if(currentPile !== deckObj.cardsMoving && pile !== deckObj.movingLoc && currentPile !== null && pile !== 'stock' && pile.includes('table')) {

       currentPile.forEach((elem,idx)=> {
         document.querySelector(`.${pile}`).insertAdjacentHTML(
           'beforeend',
           `<div class="${elem.suit}-${elem.rank} cardStyle ${shouldShowBack(elem)}" style='margin-top: ${idx * 20}px'></div>`)})

    }else if (currentPile !== deckObj.cardsMoving && pile !== deckObj.movingLoc && currentPile !== null && (!(pile.includes('table')) && pile.includes('foundation') || pile.includes('stock'))) {

        currentPile.forEach((elem,idx)=> {
         document.querySelector(`.${pile}`).insertAdjacentHTML(
         'beforeend',
         `<div class="${elem.suit}-${elem.rank} cardStyle ${shouldShowBack(elem)}" style='margin-left: ${idx * 3}px'></div>`)})
        isGameOver(deckObj)
    }
  }
  isInitialPrint = false
}


// move card fn
const getCardToMove = (card) => {
gameTable.cardsMoving = null
 let elemArr = [...card.parentElement.children]
 let tracker
  elemArr.forEach((elem,idx)=> {  if(elem === card) tracker = idx})
   haveCardToMove = true
   const oldCardLoc = card.parentElement.classList.value.split(' ')[0]
     gameTable.oldCardLocation = oldCardLoc
     gameTable.cardsMoving = gameTable[oldCardLoc].splice(tracker)
     gameTable.cardsMoving.forEach((elem,idx)=> { elem.wasMoved = true })
   printBoard(gameTable)
  }


// end game function
function isGameOver(deckObj) {
  if(deckObj.foundation0.length === 13 && deckObj.foundation1.length === 13 && deckObj.foundation2.length === 13 && deckObj.foundation3.length === 13) {
    const deckToDisplay = shuffleDeck(deckMaker())
    const generateRandomTop = () => Math.floor((Math.random() * window.innerHeight) + 1);
    const generateRandomLeft = () => Math.floor((Math.random() * window.innerWidth) + 1);
    const getRandomCardSuit = ((deckToDisplay) => {
      return deckToDisplay[Math.floor((Math.random() * 51) + 1)].suit
    })
    const getRandomCardRank = ((deckToDisplay) => {
      return deckToDisplay[Math.floor((Math.random() * 51) + 1)].rank
    })
    let counter = 1;
    document.querySelector('body').innerHTML = ''

    setInterval(()=> {
      document.querySelector('body').insertAdjacentHTML('beforebegin', `<div id="ball${counter}" class="cardStyle ${getRandomCardSuit(deckToDisplay)}-${getRandomCardRank(deckToDisplay)}"></div>`);
      const currentBall = document.querySelector(`#ball${counter}`)
      currentBall.setAttribute("style", `left : ${generateRandomLeft()}px ;top: ${generateRandomTop()}px;})`);
      counter++
    },5)
  }
}

// isValidMove fn
const isValidMove = (gameTable,location) => {
  const lastMoveCard = gameTable.cardsMoving[0]
  const nextCard = gameTable[location][gameTable[location].length - 1]
  if(!lastMoveCard && !nextCard) return
  if(!nextCard){
      if(location.includes('foundation') && !nextCard && lastMoveCard.rank === 'ace') {
        return true
    } else if(location.includes('table') && !nextCard && lastMoveCard.rank === 'king'){
      return true
    } else {
      printBoard(gameTable,gameTable.oldCardLocation)
    }
  } else if(location.includes('foundation') && nextCard && nextCard.suit === lastMoveCard.suit &&  lastMoveCard.index - nextCard.index === 1 || nextCard.index - lastMoveCard.index === 12 && nextCard.suit === lastMoveCard.suit){
    console.log('in there')
    return true
  } else if(location.includes('table') && nextCard.index - lastMoveCard.index === 1 && lastMoveCard.color !== nextCard.color) {
    return true
  } else {
    printBoard(gameTable,gameTable.oldCardLocation)
  }
}




// event listener
document.addEventListener('click', function(e){
  const card = e.target.classList.value
  if(e.target === document.querySelector('.btn-danger') && !gameIsStarted){
    document.querySelector('.btn-danger').textContent = 'Shuffle'
    let shuffled = shuffleDeck(deckMaker())
    gameIsStarted = true
    setUpGame(shuffled)
  }

  if(card.includes('cardStyle') && !haveCardToMove  && (!(card.includes('cardBack')))){
    if(e.target.parentElement.classList.value.includes('foundation')) return
    getCardToMove(e.target)
  } else if(haveCardToMove && card.includes('cardStyle') || card.includes('cardContainerStyles') && (!(e.target === document.querySelector('.btn-danger'))) ){
    let location = e.target.parentElement.classList.value.split(' ')[0]
      if(location === 'd-flex' || location === 'row') {
        location = e.target.classList.value.split(' ')[0]
      }
      if(isValidMove(gameTable,location)) {
          printBoard(gameTable, location)
        }
      } else if(e.target === document.querySelector('.btn-danger') && gameIsStarted && !haveCardToMove){
    cycleThroughDeck(gameTable)
  } else if (e.target === document.querySelector('.btn-danger')){
    console.log('hit the undo button')
    console.log(undoGameTable)
  }
  if(e.target.id === 'beatIt'){
    renderWinScreen()
  }
})


function renderWinScreen(){
  // if(1) {
    const deckToDisplay = shuffleDeck(deckMaker())
    const generateRandomTop = () => Math.floor((Math.random() * window.innerHeight) + 1);
    const generateRandomLeft = () => Math.floor((Math.random() * window.innerWidth) + 1);
    const getRandomCardSuit = ((deckToDisplay) => {
      return deckToDisplay[Math.floor((Math.random() * 51) + 1)].suit
    })
    const getRandomCardRank = ((deckToDisplay) => {
      return deckToDisplay[Math.floor((Math.random() * 51) + 1)].rank
    })
    let counter = 1;
    document.querySelector('body').innerHTML = ''

    setInterval(()=> {
      document.querySelector('body').insertAdjacentHTML('beforebegin', `<div id="ball${counter}" class="cardStyle ${getRandomCardSuit(deckToDisplay)}-${getRandomCardRank(deckToDisplay)}"></div>`);
      const currentBall = document.querySelector(`#ball${counter}`)
      currentBall.setAttribute("style", `left : ${generateRandomLeft()}px ;top: ${generateRandomTop()}px;})`);
      counter++
    },5)
    // }
}
    // renderWinScreen()
