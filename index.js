const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

let matkaAndmed1 = {
  nimi: "Rabamatk",
  kirjeldus: "Lirtsuv maa",
  pilt: "./Pildid/Tydruk kotiga 1.png"
}

let matkaAndmed2 = {
  nimi: "Rattamatk",
  kirjeldus: "Väntame iga päev",
  pilt: "./Pildid/Tydruk kotiga 1.png"
}

let matkaAndmed3 = {
  nimi: "Süstamatk",
  kirjeldus: "Murrame laineid",
  pilt: "./Pildid/Tydruk kotiga 1.png"

}

let koikMatkad = [
  matkaAndmed1, 
  matkaAndmed2, 
  matkaAndmed3,
  {
      nimi: "Jalgsimatk",
      kirjeldus: "Kõnnime iga päev jalad rakku",
      pilt: "./Pildid/Tydruk kotiga 1.png"
  }
]

function matkaleRegistreerunud(RegExp, res) {
  res.send(`mittemidagi`)
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function(req, res) {res.render('pages/index', {koikMatkad}) })
  .get('/uudised', function(req, res) {res.render('pages/uudised') })
  .get('/kontakt', function(req, res) {res.render('pages/kontakt') })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
