const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const bodyParser = require('body-parser');

let users = require('./users.json');
// let data = require('./data.json');
const app = express();
// app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.render('index');

});

app.post('/', (req, res) => {
  let newUsers = users;

  newUsers.forEach(user => {
    if (user.username == req.body.username || user.password == req.body.password) {
      res.redirect('/users');
    }
  });
});

app.get('/users/add', (req, res) => {
  res.render('register');
});
app.post('/users/add', (req, res) => {
  let newUser = {
    id: uuid.v4(),
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    address: {
      street: req.body.street,
      suite: req.body.suite,
      city: req.body.city,
    },

    password: req.body.password,
  };

  // fs.writeFileSync('./newCustomer.json', jsonString);
  fs.readFile('users.json', function (err, users) {
    if (err) {
      throw err;
    }
    var parseJson = JSON.parse(users);

    parseJson.push(newUser);

    fs.writeFile('users.json', JSON.stringify(parseJson), function (err) {
      if (err) throw err;
      else {
        users = require('./users.json');
        res.redirect('/');
      }

    });

  });


});

app.post('/users/delete/:id', (req, res) => {
  fs.readFile('users.json', function (err, users) {
    if (err) {
      throw err;
    }
    //var parseJson = JSON.parse(users);
    let currentUsers = JSON.parse(users);
    let newUsers = Array();
    for (var i = 0; i < currentUsers.length; i++) {
      var user = currentUsers[i];
      if (user.id == parseInt(req.params.id)) {
        continue;
      }
      newUsers.push(user);
    }
    fs.writeFile('users.json', JSON.stringify(newUsers), function (err) {
      if (err) throw err;
      else {
        users = require('./users.json');
        res.redirect('/users');
      }

    });

  });



  // fs.readFile('users.json', function (err, users) {
  //   if (err) {
  //     throw err;
  //   }
  //   var parseJson = JSON.parse(users);

  //   parseJson.push(newUsers);

  //   fs.writeFile('users.json', JSON.stringify(parseJson), function (err) {
  //     if (err) throw err;
  //     else {
  //       res.redirect('/users');
  //     }

  //   });

  // });




});
app.get('/users', (req, res) => {
  // res.json(persons);
  res.render('users', {
    title: 'Users List',
    users: users
  });
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server Running on port ${port}`));