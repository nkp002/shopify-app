const session = require('express-session');
const express = require("express")
const bodyParser = require("body-parser")
var cors = require('cors')

const ShopifyToken = require('shopify-token');
const config = require('./config');

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('/etc/apache2/ssl/tfa.key', 'utf8');
var certificate = fs.readFileSync('/etc/apache2/ssl/cert_td/cert_td.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var port = 8000
var port1 = 8001
//const path = require('path')
//port=process.env.NODE_PORT;
//port1=process.env.NODE_PORT1;

const shopifyToken = new ShopifyToken(config);

const app = express()
const { MongoClient } = require('mongodb');
const uri = "mongodb://admin:admin@127.0.0.1:27017/?retrywrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// parse requests of content-type: application/json
app.use(bodyParser.json())
app.use(cors())

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
  secret: 'eo3Athuo4Ang5gai',
  saveUninitialized: false,
  resave: false
}));

async function listTemplates(tname) {
  let templatee = '';
  try {
    await client.connect();
    const database = client.db('vclothing');
    const templateCollection = database.collection('templates');
    // Query for a movie that has the title 'Back to the Future'
    const options = {
      // sort returned documents in ascending order by title (A->Z)
      //sort: { title: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      projection: { _id: 0, name: 1 },
    };
    const cursor = templateCollection.find({}, options);
    if ((await cursor.count()) === 0) {
      templatee = {};
      console.log("No documents found!");
    }
    // replace console.dir with your callback to access individual elements
    templatee = [];
    await cursor.forEach(element => templatee.push(element.name));
    console.dir(templatee);
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
    return templatee;
  }
}

async function getTemplate(tname) {
  let template = '';
  try {
    await client.connect();
    const database = client.db('vclothing');
    const templateCollection = database.collection('templates');
    // Query for a movie that has the title 'Back to the Future'
    const query = { name: tname };
    template = await templateCollection.findOne(query);
    console.log(template);
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
    return template;
  }
}

async function saveTemplate(dataJson) {
  let result = { message: "Data saved success" };
  try {
    //console.log(dataJson);
    console.log(1);
    await client.connect();
    const database = client.db('vclothing');
    const templateCollection = database.collection('templates');
    // create a filter for a movie to update
    console.log(2);
    const filter = { "name": dataJson.name };//dataJson.name
    console.log(3);
    await templateCollection.deleteMany(filter);
    console.log(5);
    result = await templateCollection.insertOne(dataJson);
    //console.log(template);
    console.log(result);
  }
  finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
    return result;
  }
}

// simple route
app.get("/listTemplates", async (req, res) => {
  outp = await listTemplates().catch(console.dir);
  res.json(outp);
});
app.get('/getTemplate/:tname', async (req, res) => {
  console.log("Got request");
  outp = await getTemplate(req.params.tname).catch(console.dir);
  res.json(outp);
});
app.post("/saveTemplate/", async (req, res) => {
  dataJson = req.body;
  outp = await saveTemplate(dataJson).catch(console.dir);
  res.json(outp);
});

app.get('/auth', (req, res) => {
	console.log("Got App request");
  if (req.session.token) return res.redirect('https://trusted-doctor.com/img/drawio-master/vclothing');//res.send('Token ready to be used');

  //
  // Generate a random nonce.
  //
  const nonce = shopifyToken.generateNonce();

  //
  // Generate the authorization URL. For the sake of simplicity the shop name
  // is fixed here but it can, of course, be passed along with the request and
  // be different for each request.
  //
  const uri = shopifyToken.generateAuthUrl(config.shop, undefined, nonce);

  //
  // Save the nonce in the session to verify it later.
  //
  req.session.state = nonce;
  res.redirect(uri);
});

app.get('/auth/callback', (req, res) => {
  const state = req.query.state;

  if (
      typeof state !== 'string'
    || state !== req.session.state          // Validate the state.
    || !shopifyToken.verifyHmac(req.query)  // Validate the hmac.
  ) {
    //return res.status(400).send('Security checks failed');
  }

  //
  // Exchange the authorization code for a permanent access token.
  //
  shopifyToken.getAccessToken(req.query.shop, req.query.code)
    .then((data) => {
      const token = data.access_token;
      console.log(token);

      req.session.token = token;
      req.session.state = undefined;
      res.redirect('https://trusted-doctor.com/img/drawio-master/vclothing');
    })
    .catch((err) => {
      console.error(err.stack);
      res.status(500).send('Oops, something went wrong');
    });
});

//require("./routes/user.routes.js")(app);

// set port, listen for requests
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
httpServer.listen(port1, () => {
  console.log(`Server is running on port ${port1}`);
});
