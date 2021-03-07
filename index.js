let matkaAndmed1 = {
  nimi: "Rabamatk",
  kirjeldus: "Sulav asfalt voi lirtsuv maa",
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
  nimi: "Süstamatk",
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

  const matkaIndeks = req.query.matk

  const valitudMatk = koikMatkad[matkaIndeks]
  valitudMatk.registreerunud.push(registreerunu)

  console.log('Lisatud matkaja:')
  console.log(valitudMatk)

  res.send('Matk: ' + req.query.matk + ' email: ' + req.query.email)
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
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
