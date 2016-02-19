var _ = require("lodash");
// require

module.exports = {
  count: function(str){

    var answer = {};
    // var letters = str.split(" ");
    // for(var i = 0; i < letters.length; i++){
    //   var letter = letters[i];
    //   var count = answer[letter];
    //   if(!count){
    //     count = 0;
    //   }
    //   count += 1;
    //   answer[letter] = count;
    // }
    //
    //

    // работает но с англ
    // var reg = /[^$A-Za-z0-9_]+/ig
    //
    var reg = /[^$A-Za-z0-9а-яА-ЯёЁ_]+/ig
    str.split(reg).forEach(function(letter){
      answer[letter] = (answer[letter] || 0) + 1;
    });

    var answer2 = [];
    _.forEach(answer, function(count, letter){
      answer2.push({
        count: count,
        word: letter
      })
    })

    return answer2;





    return answer;
  }
};
