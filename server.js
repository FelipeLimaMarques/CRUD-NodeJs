const express = require('express');
const bodyparser = require('body-parser')
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const app = express();
const uri = "mongodb+srv://mongou:mongop@cluster0-fxyer.mongodb.net/test?retryWrites=true&w=majority";
const port = 3000;

app.use(bodyparser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err);
    db = client.db('CRUD'); // coloque o nome do seu DB
    app.listen(port, () => {
      console.log('Server running on port ' + port)
    });
});

app.listen(port, () => {
    console.log('Servidor rodando na porta ' + port)
});

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id
 
  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err);
    res.render('edit.ejs', { data: result });
  });
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname
 
  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados');
  });
});

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id
 
  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  });
});

app.get('/', (req, res) => {
    var cursor = db.collection('data').find();
});
 
app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err);
        res.render('show.ejs', { data: results });
    });
});

app.post('/show', (req, res) => {
    //criar a coleção “data”, que irá armazenar nossos dados
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('Salvo no Banco de Dados');
        res.redirect('/show');
    });
});