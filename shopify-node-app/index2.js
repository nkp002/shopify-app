const express = require("express")
const bodyParser = require("body-parser")
var cors = require('cors')
const port = 8000
const path = require('path')

const app = express()
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.ccczg.mongodb.net/vclothing?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// parse requests of content-type: application/json
app.use(bodyParser.json())
app.use(cors())

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

async function listTemplates(tname) {
    let templatee='';
    try {
      await client.connect();
      const database = client.db('vclothing');
      const templateCollection = database.collection('templates');
      // Query for a movie that has the title 'Back to the Future'
      const options = {
      // sort returned documents in ascending order by title (A->Z)
      //sort: { title: 1 },
    // Include only the `title` and `imdb` fields in each returned document
      projection: { _id:0, name:1 },
    };
      const cursor =  templateCollection.find({},options);
      if ((await cursor.count()) === 0) {
          templatee={};
        console.log("No documents found!");
      }
      // replace console.dir with your callback to access individual elements
      templatee=[];
      await cursor.forEach(element => templatee.push(element.name));
      console.dir(templatee);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();    
      return templatee; 
    }    
  }

async function getTemplate(tname) {
    let template='';
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
      await client.close();    
      return template;  
    }    
  }

  async function saveTemplate(dataJson) {
    let result={ message: "Data saved success" };    
    try {        
      //console.log(dataJson);  
      await client.connect();      
      const database = client.db('vclothing');
      const templateCollection = database.collection('templates');
      result = await templateCollection.insertOne(dataJson);
      // create a filter for a movie to update
        /*const filter = { "name": dataJson.name };
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        result = await templateCollection.replaceOne(filter, dataJson, options);   
        console.log(dataJson.name );            
        if (result.modifiedCount === 0 && result.upsertedCount === 0) {
            console.log("No changes made to the collection.");
          } else {
            if (result.matchedCount === 1) {
              console.log("Matched " + result.matchedCount + " documents.");
            }
            if (result.modifiedCount === 1) {
              console.log("Updated one document.");
            }
            if (result.upsertedCount === 1) {
              console.log(
                "Inserted one new document with an _id of " + result.upsertedId._id
              );
            }
        } */
      //console.log(template);
      console.log(result);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();    
      return result;  
    }    
  }

// simple route
app.get("/listTemplates", async (req, res) => {
    outp=await listTemplates().catch(console.dir);
    res.json(outp);
});
app.get('/getTemplate/:tname', async (req, res) => {
    outp=await getTemplate(req.params.tname).catch(console.dir);
    res.json(outp);
});
app.post("/saveTemplate/", async (req, res) => {
    dataJson=req.body;
    outp=await saveTemplate(dataJson).catch(console.dir);
    res.json(outp);
});

//require("./routes/user.routes.js")(app);

// set port, listen for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});