var express = require('express');
var _ = require('lodash');
var app = express();

var mongo = require('mongoskin');
ObjectID = require('mongoskin').ObjectID;

// {_id: new ObjectID("someid")}
var db = mongo.db("mongodb://s2.mgbeta.ru:10098/gizobi", {
  native_parser: true
});
db.bind('rest');

var wantsJson = require('wants-json');
app.use(wantsJson());

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(8080, function() {
  console.log('Example app listening on port 8080!');
});
app.set('view engine', 'jade');


var user = {
  id: 2
};

app.get('/', function(req, res) {


  db.rest.find({
    clientId: user.id
  }).toArray(function(err, items) {
    if (err) {
      res.status(500);
      return res.render('error', {
        error: err
      });
    }

    // [{id:123}] => {123:{id:123, .. }}
    var itemsById = _.keyBy(items, "_id");
    _.forEach(items, function(item) {

      var parentIds = item.parentIds || [];
      item.parents = _.map(parentIds, function(parentId) {
        var parent = itemsById[parentId] || {};

        return parent.title;
      });

    })


    if (req.wantsJson()) {
      return res.json({
        status: 200,
        err: null,
        data: {
          items: items
        }
      });
    }

    return res.render("rest", {
      items: items
    });

  });

});

app.post('/', function(req, res) {


  var rest = req.body;

  rest.clientId = user.id;

  return db.rest.insert(rest, function(err, item) {
    return res.json({
      err: err,
      item: item
    });

  });
  //

  return res.json({
    params: req.params,
    query: req.query,
    body: req.body
  })
})


app.put('/', function(req, res) {


  var rest = req.body;
  rest.clientId = user.id;
  var restId = req.query.id;

  try {
    var criteria = {
      "_id": new ObjectID(restId),
    };
  } catch (err) {
    res.status(400);
    return res.render('error', {
      error: err
    });
  }


  db.rest.findOne(criteria, function(err, item) {
    if (err) {
      res.status(500);
      return res.render('error', {
        error: err
      });
    }
    if (item == null) {
      res.status(404);
      return res.render('error', {
        error: "!rest"
      });
    }
    if (item.clientId != user.id) {
      return res.send(403, {
        err: "forbidden"
      });
    }


    db.rest.update(criteria, rest, function(err, item) {
      if (err) {
        res.status(500);
        return res.render('error', {
          error: err
        });
      }
      return res.json({
        err: err,
        item: item
      });

    });
  });
  return;
  // return db.rest.insert(rest, function(err, item) {
  //   return res.json({err:err,item:item});
  //
  // });
  //

  return res.json({
    params: req.params,
    query: req.query,
    body: req.body
  })
})
