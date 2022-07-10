const dateConverting = (date) => {
    const dateStr = Date(parseInt(date, 16)).toString()
  
    return dateStr.split(' ').slice(1, 4).join('-');
  }
  
  module.exports = dateConverting
  