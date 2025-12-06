// //////////////////
  // Global Variables
/////////////////////
const dateSpot = document.querySelector('.dateSpot')
const mainTitle = document.querySelector('.mainTitle')
// 1 jQuery UI and Date method
dateSpot.textContent = `Today is: ${$.datepicker.formatDate("M d, yy", new Date())}`
