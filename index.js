const MongoClient = require("mongodb").MongoClient;
const salas6na = "KalaSuppG0";
const andmebaas = "veeb63"; // <= Pane X asemel siia enda number
const uri = `mongodb+srv://veebg0:${salas6na}@cluster0.qz3rv.mongodb.net/${andmebaas}?retryWrites=true&w=majority`;

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

let matkaAndmed1 = {
  nimi: "Rabamatk",
  kirjeldus: "Oitsevad kirsid rabas",
  pilt: "/Pildid/kirsipuud.jpg",
  registreerunud: []
}

let matkaAndmed2 = {
  nimi: "Rattamatk",
  kirjeldus: "Väntame iga päev vähemalt 40 kilomeetrit. Ja nii nädal otsa",
  pilt: "/Pildid/rattamatk2.jpg",
  registreerunud: []
}

let matkaAndmed3 = {
  nimi: "Süstamakt",
  kirjeldus: "Sõidame iga päev vähemalt 10 kilomeetrit. Ja nii nädal otsa",
  pilt: "/Pildid/systamatk.jpg",
  registreerunud: []
}

let koikMatkad = [
  matkaAndmed1, 
  matkaAndmed2, 
  matkaAndmed3,
  {
      nimi: "Jalgsimatk",
      kirjeldus: "Kõnnime iga päev vähemalt 10 kilomeetrit. Ja nii nädal otsa",
      pilt: "/Pildid/vihmaneTartu.jpg",
      registreerunud: []
  }
]

function millineParameeter(req, res) {
  const testNumber = req.params.number;
  res.send('Olen saanud testnumbri ' + testNumber)
}

function matkaleRegistreerumine(req, res) {
  const valitudMatkaIndeks = req.params.matk
  const valitudMatkaAndmed = koikMatkad[valitudMatkaIndeks]
  if (valitudMatkaIndeks >= 0 && valitudMatkaIndeks < koikMatkad.length) {
    return res.render('pages/registreerimine', {matk: valitudMatkaAndmed, matkaIndeks: valitudMatkaIndeks})
  } else {
    return res.render('pages/index', {koikMatkad})
  }
}

function lisaMatkaja(req, res) {
  const registreerunu = {
    nimi: req.query.nimi,
    email: req.query.email,
  }

  const matkaIndeks = parseInt(req.query.matk)

  if ( matkaIndeks < 0 || matkaIndeks >= koikMatkad.length) {
    return res.send(`Viga: matka indeks ${matkaIndeks} on vigane`);
  }

  const valitudMatk = koikMatkad[matkaIndeks]
  valitudMatk.registreerunud.push(registreerunu)

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
  
  client.connect((err) => {
    if (err) {
      return res.send( {error: `Viga andmebaasiga ühendumisel: ` + err.message})
    }

  const collection = client
       .db(andmebaas)
       .collection("matkaklubi_" + andmebaas + "_registreerumised");
       registreerunu.matk = matkaIndeks
      
  collection.insertOne(registreerunu, (err) => {
   client.close()
    if (err) {
       return res.send({error: `Matkaja andmete salvestamine ebaonnestus: ` + err.message})
         }

         return res.sender(
           `pages/kinnitus`,
           { matk: valitudMatk, isikNimi: registreerunu.nimi }
         );
       })

  })

  console.log('Lisatud matkaja:')
  console.log(valitudMatk)
}

function matkaleRegistreerunud(req, res) {
  const matkaIndeks = parseInt(req.params.matk)
  if ( matkaIndeks < 0 || matkaIndeks >= koikMatkad.length) {
    return res.send({error: `Matka indeks ` + matkaIndeks + ` ei ole õige`});
  }

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  client.connect((err) => {
    if (err) {
      return res.send({error: 'Viga andmebaasiga ühendumisel: ' + err.message})
    }

    const collection = client
    .db(andmebaas)
    .collection("matkaklubi_" + andmebaas + "_registreerumised");

    collection.find({matk: matkaIndeks}).toArray((err, registreerumised) => {
      if (err) {
        return res.send({error: 'Viga andmete lugemiseks: ' + err.message})
      }

      const valitudMatk = koikMatkad[matkaIndeks]
      valitudMatk.registreerunud = registreerumised
      return res.send(valitudMatk);
    } )

  })
  
}   


express()
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.get('/', (req, res) => res.render('pages/index', {koikMatkad}))
.get('/uudised', function(req, res) { return res.render('pages/uudised') })
.get('/kontakt', function(req, res) { return res.render('pages/kontakt') })
.get('/registreerimine', function(req, res) { return res.render('pages/registreeru') })
.get('/registreerimine/:matk', matkaleRegistreerumine)
.get('/testnumber/:number', millineParameeter)
.get('/lisaMatkaja', lisaMatkaja)
.get('/api/matkajad/:matk', matkaleRegistreerunud)
.listen(PORT, () => console.log(`Listening on ${ PORT }`))