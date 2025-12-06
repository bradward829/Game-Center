// ///////////////////////
// global variables
// ///////////////////////
const difficultyButtonContainer = document.querySelector('.difficultyButtonContainer')
const easyButton = document.querySelector('.easyButton')
const mediumButton = document.querySelector('.mediumButton')
const hardButton = document.querySelector('.hardButton')

// event listener
difficultyButtonContainer.addEventListener("click", (e) => {
  if (e.target === easyButton) {
    localStorage.setItem('difficulty', 'easy');
  } else if (e.target === mediumButton) {
    localStorage.setItem('difficulty', 'medium');
  } else if (e.target === hardButton) {
    localStorage.setItem('difficulty', 'hard');
  }
  // end of event listener
});