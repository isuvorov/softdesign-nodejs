
// Подключаем модули
var express = require('express');

var fs = require("fs"); // для работы с файловой системой

// создаем приложение
var app = express();

// Слушаем порт 3000
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});



var user = {
    id: 1,
    firstName: "Default Igor",
    count: 0
};

var form = '<h1>Hello user GET REQUEST</h1>' +
    '<form method="GET" action="/user">' +
    '	<input name="firstName" value="' + user.firstName + '">' +
    '	<input type="submit">' +
    '</form>	' +
    '<script src="index.js"></script>';

var form2 = '<h1>Hello user POST REQUEST</h1>' +
    '<form method="POST" action="/user">' +
    '	<input type="submit">' +
    '</form>	' +
    '<script src="index.js"></script>';

var count = 0;

// localhost = 127.0.0.1
// при обращении в корень http://localhost:3000/
app.all('/', function(req, res) {

    // Берем параметр
    var name = req.param("firstName");

    // Количество обращений к приложению
    count += 1;

    // Отсылаем браузеру ответ
    return res.send('Hello World! ' + count + name + form + form2);


});


// при обращении в  http://localhost:3000/user
// только GET Запрос
app.get('/user', function(req, res) {


    // Взять имя из запроса, и если оно изменилось, сохранить и сбросить счетчик
    var firstName = req.param("firstName");
    if (firstName && user.firstName != firstName) {
        user.firstName = firstName;
        user.count = 0;
    }

    // обращение к пользователю
    user.count += 1;

    // ответ в виде JSON
    return res.json(user);
});




// при обращении в  http://localhost:3000/user
// только POST Запрос
app.post('/user', function(req, res) {

    // считываем файл index.html который в корне проекта
    var buf = fs.readFileSync("./index.html");

    // логируем в консоль
    console.log("LOG: user say hello ", user);

    // пишем JS, который сохраняет в браузере  объект USER
    var scriptWithUser = "<script>window.user=" + JSON.stringify(user) + "</script>";

    // возвращаем ответ
    return res.send(scriptWithUser + buf.toString());
});