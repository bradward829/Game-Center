// ========================================
//           Global Variables
// ========================================
const startButton = document.querySelector('.btn-success')
const pauseButton = document.querySelector('.btn-danger')
const colors = ['crimson','slateblue','peru','green','magenta']

let gameBoardArr =
[
  [null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null,null,null]
]

let pieceCounter = 1
let piecesGrounded = 1
let prevPiece
let isGameStarted = false
let gameOver = false
let isGamePaused = false
let gameSpeed = 500
let score = 0

// ========================================
//           Functions
// ========================================
function startGame(){
  makePiece()
  makePieceFall()
}

function randomSpot(){
  return Math.floor(Math.random() * 10)
}

function updateScoreBoard(){
  document.querySelector('.score').textContent = score
}

function handleSize(pieceDimension){
  if(pieceDimension === 1){
    return [0,0]
  }else if(pieceDimension === 2){
    return [0,1]
  }else if(pieceDimension === 3){
    return [0,2]
  }else if(pieceDimension === 4){
    return [1,1]
  }else if(pieceDimension === 5){
    return [1,2]
  }
}

function getPieceSpecs(){
  const dimension = Math.floor(Math.random()*5)
  const specs =
  {
    size: handleSize(dimension + 1),
    dimensions: dimension + 1,
    shape: ['single','double','triple','square','rec'][dimension],
    color: colors.at(Math.random() * (5))
  }
  return specs
}

function putPieceInGame(piece) {
  return gameBoardArr.map((elem,i)=> {
    return elem.map((element,idx)=> {
      if((piece.size[0] >= i ) && idx >= 4 && idx - 4 <= piece.size[1]){
        return piece
      }
      return element
    })
  })
}

function makePiece(){
  if(isGamePaused) return
  if(checkFullColumns()) return

  const pieceSpecs = getPieceSpecs()
  const newPiece =
  {
   html:`<div class='square piece ${pieceSpecs.color} piece${pieceCounter}' id='toggle'></div>`,
   dimensions: pieceSpecs.dimensions,
   shape: pieceSpecs.shape,
   color: pieceSpecs.color,
   size: pieceSpecs.size,
   uniqueId: pieceCounter,
   isPieceGrounded: false,
   isExplosive: false
  }
  pieceCounter += 1
  gameBoardArr = putPieceInGame(newPiece)
  prevPiece = newPiece
  printBoard()
  setTimeout(()=> makePiece() ,(gameSpeed * 10) - piecesGrounded * 10)
}

function getCoords(row,first,second){
 return gameBoardArr.reduce((prev,curr,i)=>{
   return curr.includes(prevPiece)
      ? [...prev,[i+row,curr.indexOf(prevPiece)+first,curr.lastIndexOf(prevPiece)+second]]
      : prev
    },[])
}

function updateBoard(coords,piece){
  coords.forEach((elem,i,arr)=> {
    gameBoardArr[elem[0]] = gameBoardArr[elem[0]].map((element,idx)=> {
      if(idx >= elem[1] && idx <= elem[2] || idx === elem[1]) return piece || null
      return element
    })
  })
}

function makePieceFall(userInput){
 if(isGamePaused) return
 const pieceCoords = getCoords(0,0,0)
 const newPieceCoords = getCoords(1,0,0)
  if(canPieceMoveDown(pieceCoords)){
    updateBoard(pieceCoords)
    updateBoard(newPieceCoords,prevPiece)
    printBoard()
  }
  if(userInput) return
  setTimeout(()=> makePieceFall(),gameSpeed - piecesGrounded * 10)
}

function groundPiece(){
  if(!prevPiece.isPieceGrounded){
    piecesGrounded += 1
    score+=1
  }
  prevPiece.isPieceGrounded = true
  handleExplosiveMaterial()
  updateScoreBoard()
  handleFullRows()
  if(checkFullColumns()) makeGameEnd()
}

function canPieceMoveDown(coords){
  let noPiecesBeneath = true
  coords.forEach((elem,i,arr)=> {
    if(coords[coords.length-1][0] < 9){
      gameBoardArr[coords[coords.length-1][0]+1].forEach((element,idx)=> {
        if(idx >= elem[1] && idx <= elem[2] && element){
          noPiecesBeneath = false
          groundPiece()
        }
      })
    }else{
      noPiecesBeneath = false
      groundPiece()
    }
  })
  if(checkFullColumns()) makeGameEnd()
  isGameWon()
  return noPiecesBeneath
}

function printBoard(){
 gameBoardArr.forEach((elem,idx)=> {
  elem.forEach((element,i)=> {
   const currLoc = document.querySelector(`.row${idx+1}`).children[i]
    currLoc.innerHTML = (element)
      ? element.html
      : `<div class="squareNoBorder square${i+1}"></div>`
    })
  })
}

function canPieceMoveLaterally(direction,coords){
 let noAdjacentObstruction = true
  coords.forEach((elem,i)=> {
   if(direction === 'ArrowRight'){
    if(elem[2] > 8 || gameBoardArr[elem[0]][elem[2]+1]) noAdjacentObstruction = false
   }else if(direction === 'ArrowLeft') {
    if(elem[1] === 0 || gameBoardArr[elem[0]][elem[1]-1]) noAdjacentObstruction = false
   }
  })
  if(prevPiece.isPieceGrounded) noAdjacentObstruction = false
   return noAdjacentObstruction
}

function movePiece(key){
  const pieceCoords = getCoords(0,0,0)
  if(key === 'ArrowLeft' && canPieceMoveLaterally('ArrowLeft',pieceCoords)){
    const newPieceCoords = getCoords(0,-1,-1)
      updateBoard(pieceCoords)
      updateBoard(newPieceCoords,prevPiece)
  }else if(key=== 'ArrowRight' && canPieceMoveLaterally('ArrowRight',pieceCoords)) {
    const newPieceCoords = getCoords(0,1,1)
      updateBoard(pieceCoords)
      updateBoard(newPieceCoords,prevPiece)
  }else if(key === 'ArrowDown'){
    makePieceFall('user')
  }else if(key === ' '){
    rotatePiece(prevPiece)
  }
   printBoard()
}

function getRotatedPieceCoords(oldCoords){
  let newCoords = []
  if(oldCoords.length === 1 && Array.from(new Set(oldCoords[0].slice(1))).length === 1){
    newCoords = oldCoords
  }
  let counterRow = 0
  let counterIdx = 0
  oldCoords.forEach((elem,i)=> {
    while(elem[1] + counterRow <= elem[2]) {
      newCoords.push([elem[0] + counterRow])
      counterRow +=1
    }
  })
  newCoords.forEach((element,idx,arr)=> {
    oldCoords.forEach((elem,i,arr)=> {
      while(elem[0] + counterIdx <= arr[arr.length-1][0]){
        newCoords[idx].push(elem[1] + counterIdx)
        counterIdx += 1
      }
    })
      counterIdx = 0
  })
  newCoords = newCoords.map((element,index,array)=> {
   return (element.length > 3)
     ? [element[0],element[1],element[element.length-1]]
     : element
   })
  return newCoords
}

function pieceCanRotate(newSpot,oldSpot){
  let pieceCanMove = true
  if(newSpot.find((elem,i)=> (elem[0] > 9 || elem[2] > 9))) return false
  newSpot.forEach((elem,i)=> {
    gameBoardArr[elem[0]].forEach((element,idx,arr)=> {
      if(oldSpot.find((e,i)=> e[0] === elem[0]) && oldSpot[i][2] < elem[2] && idx > elem[1] && idx >= elem[2] && element){
          pieceCanMove = false
      }else if(!oldSpot.find((e,i)=> e[0] === elem[0]) && idx >= elem[1] && element && (idx <= elem[2] || !elem[2])){
          pieceCanMove = false
      }
    })
  })
  return pieceCanMove
}

function rotatePiece(){
  const coords = getCoords(0,0,0)
  const newCoords = getRotatedPieceCoords(coords)
  if(pieceCanRotate(newCoords,coords)){
    updateBoard(coords)
    updateBoard(newCoords,prevPiece)
  }
}

function checkFullColumns(){
 let colFull = false
  gameBoardArr.forEach((elem,i,arr)=> {
   const test = []
    elem.forEach((element,idx,array)=> {
     test.push(gameBoardArr[idx][i])
      if(idx === array.length-1){
       if(test.filter((e)=> e).length === 10) colFull = true
      }
    })
  })
    return colFull
}

function getFullRows(){
 return  gameBoardArr.reduce((prev,curr,i)=>
   (curr.filter((e,index)=> e).length === 10)
     ? [...prev, i]
     : prev ,[])
}

// ============================================
// Below contains code for future development
// ============================================

// MAKE A YELLOW FLASH AT EACH PIECE THAT BLOWS BEFORE IT DISAPPEARS

const getColorsOverThree = (array) =>{
  const arrCopy = [...array]

  let test =  Object.entries(array.reduce((prev,curr,index)=>  {
    return (prev[curr] && curr)
      ? {...prev, [curr]: prev[curr] + 1}
      : {...prev, [curr]: 1}
  },{})).reduce((prev,curr,idx) =>{
    if(curr[1] > 3){
      const indices = [];
      let idx = arrCopy.indexOf(curr[0]);
      while (idx !== -1) {
        indices.push(idx);
        idx = arrCopy.indexOf(curr[0], idx + 1);
      }
      return [...prev,...indices]
    }else{
      return [...prev]
    }
  },[])

  let testConsecutive = test.reduce((prev,curr,i,arr)=> {
    if(curr === arr[i + 1] - 1 || i === arr.length-1){
      return [...prev,curr]
    }else {
      prev = []
      return prev
    }
  },[])
  if(testConsecutive.length < 4) testConsecutive = []

  return testConsecutive
}


function handleExplosiveMaterial() {
  const colorsArr = gameBoardArr.map(elem => elem.map(element => {
    if(element){
      return element.color
    }else{
      return null
    }
  }))

  const explosives = colorsArr.map((elem,i) => {
    if(getColorsOverThree(elem).length) {
      console.log('Row ==> ',i,'Explode', getColorsOverThree(elem))
      return getColorsOverThree(elem)
    }else{
      // return elem
      return []
    }
  }).reduce((prev,curr,idx)=> {
    if(curr.length){
      return [...prev,[[idx],...curr]]
    }else{
      return prev
    }
  },[])
   console.log('explosives',explosives)
}


function handleFullRows(){
  let rows = getFullRows()
  // console.log(handleExplosiveMaterial())
  if(!rows.length) return
  score += (rows.length * 10)
// rows.map((elem,i)=>{
//   gameBoardArr[elem] = gameBoardArr[elem].map((element,idx)=> {
//     const htmlArr = [...element.html]
//   if(!htmlArr.join('').includes('explode')){
//     element.html = [...htmlArr.slice(0,12),' explode ', ...htmlArr.slice(12)].join('')
//   }
//     return element
//   })
// })
// $( ".piece" ).toggle( "explode")
  gameBoardArr.forEach((elem)=> {
  console.log('before',elem)
})
const blankRow = [null,null,null,null,null,null,null,null,null,null]


gameBoardArr = gameBoardArr.map((elem,i,arr)=> {
      if(i < rows[0]){
        return arr[i - rows.length] || blankRow
      }else if(rows.includes(i)){
        return  arr[i - rows.length]
      }else {
        return elem
      }
})

 updateScoreBoard()
 printBoard()
// gameBoardArr.forEach((elem,i,arr)=> elem.forEach((element,idx)=> {
//   if(i !== arr.length-1 && element){
//     element.isPieceGrounded = false
//   }
// }))
}

function isGameWon(){
  if(score >= 150){
   document.querySelector('.pageContainer').innerHTML = `<div class='won'>You Won<button type="button" class="btn btn-success mt-2 playAgain">Play Again</button></div>`
  }
}

function makeGameEnd(){
  document.querySelector('.pageContainer').innerHTML = `<div class='lost'>You Lost<button type="button" class="btn btn-success mt-2 playAgain">Play Again</button></div>`
}

// ========================================
//           Event Listeners
// ========================================
document.addEventListener('click', (e)=>{
  if(e.target === startButton && !isGameStarted){
    startGame()
    isGameStarted = true
  }else if(e.target === pauseButton){
    isGamePaused = !isGamePaused
    if(!isGamePaused){
      // startGame()
    }
  }else if(e.target === document.querySelector('.playAgain')){
    location.reload()
  }
})

document.addEventListener('keydown', (e)=> movePiece(e.key))
// NEW TO DO LIST
// ====================================================
// ****WORK ON NEW PIECES****

// Maybe Just Maybe ======>>>
// maybe i can make a L shaped piece by actually making 2 pieces and dropping them both at the same time and then make both them prevPiece

// make if you get more than 4 of one color in a row then all the rows before or whatever fall but only in between those indexes and make those 4 of one color disappear of course
// IF I MAKE THIS GAME WHERE IF YOU GET FOUR IN A ROW THEN THE THINGS BLOW THEN MAYBE THE jQuery ui thing will work then



// MAKE A GAME THAT IS LIKE SIDE VIEW OF SOMETHING CLIMBING DOWN AND IS GOING DOWN AND MAKING IT THROUGH OBSTACLES AND STUFF. LIKE THE ONE THAT WAS ADVERTISED IN THE CLASSROOM USING THE TETRIS BOARD TO NAVIGATE THROUGH AND DOWN



// have periods once you get so far where everything slows down for a few to give you a chance to catch up.


// make it if you get any four backgrounds vertically or horizontally then b;lpow that area and allow above pieces to move accordingly





  // console.log('gameBoardArr',gameBoardArr)

  // const testArr = gameBoardArr.map(elem => elem.map(element => {
  //   if(element){
  //     return element
  //   }else{
  //     return { 'color': ''}
  //   }
  // }))
  // console.log('testArr',testArr)










// const isOverThree = (array, piece) =>
// array.filter(elem => elem !== 1 && elem.color === piece.color).length > 3


// function getExplosives(array){
//   let count = 0
// const test = array.reduce((prev,curr,idx,arr)=> {
//   // console.log('prev',prev,'curr',curr,'arr',arr)
//     if(curr === idx){
//       count += 1
//       return [...prev,curr]
//     }else if(curr !== idx && count > 3) {
//         count = 0
//         return [...prev,curr]
//     }else{
//         count = 0
//         return [...prev,'b']
//     }
//   },[])
//   return test
// }



// function handleExplosiveMaterial() {
//   const testArr = gameBoardArr.map((elem)=> elem.map((element)=> element ? element : 'b'))

// const explosives = testArr.map((elem,i)=> {

//     const array = elem.map((element)=> element.color)
//     // console.log('elem',elem)
//     return elem.reduce((prev,curr,index,arr)=> {
//       const indices = [];
//       const element = curr.color
//       let idx = array.indexOf(element);

//       while (idx !== -1) {
//         // if(curr === 1) return
//         if(curr === 'b') {
//           indices.push('b')
//           return
//         }
//         // if(!isOverThree(arr,curr)) return
//         indices.push(idx);
//         idx = array.indexOf(element, idx + 1);
//       }
//       // console.log('explosivesFromRow',i,'===>>',getExplosives(indices))
//         if (indices.length > 3){

//           // console.log('explosivesFromRow',i,'===>>',getExplosives(indices))
//         }
//       console.log(indices);
//       return indices
//     },[])
//   })
// // console.log('explosives',explosives)
// }
