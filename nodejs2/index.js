var express = require('express');
var app = express();
var frequency = require("./libs/frequency.js");
//global._ = {}
var _ = require("lodash");
var request = require("request");
var async = require("async");

var fs = require("fs");
var str = fs.readFileSync("text.txt").toString();

function getWords(str) {
  var words = frequency.count(str);
  words = _.sortBy(words, "count");
  words = _.filter(words, function(word) {
    return word.word.length > 3;
  })
  words = words.reverse().slice(0, 10);
  return words;
}

function stripTags(body){
  var regex = /(<([^>]+)>)/ig;

  return body.replace(regex, "");
}
// console.log("answer", JSON.stringify(words));


//////////

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
app.set('view engine', 'jade');


app.get('/', function (req, res) {
  var url = "https://ru.wikipedia.org/wiki/Linux";
  request({url: url}, function (error, response, body) {
    console.log(body);
     body = stripTags(body);
     var words = getWords(body);
     return res.render('index', { title: 'Hey', message: 'Hello there!', words: words});
  });




  // return res.send('Hello JS World!');



  // jhsajdhasjd
});

function getWordsFromUrl(url, next){

  request({url: url}, function (err, response, body) {
    if(err){
      return next("ОШИБКА", err);
    }
    // console.log(body);
     body = stripTags(body);
     var words = getWords(body);
     next(null, words);
  });
}

app.get('/parse', function (req, res) {
  var urls = req.param(urls);
  var urls = [
    "https://ru.wikipedia.org/wiki/Node.js",
    "https://ru.wikipedia.org/wiki/Linux"
  ];
  async.map(urls, getWordsFromUrl, function(err, wordsArray){
    if(err){
      console.log({err:err});
      return res.send(500, err);
    }

    words = [].concat.call(...wordsArray);
    return res.render('index', { title: 'Hey', message: 'Hello there!', words: words});



  });



  // return res.send('Hello JS World!');



  // jhsajdhasjd
});
