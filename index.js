const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Heallow Rana Sir , Wellcome again sir')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ivkpyx5.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const db = client.db("myDatabase");
    const usersCollection = db.collection("users");

    const firebaseCullaction = client.db("firebase").collection("users")

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    app.post('/coffees', async (req, res) => {
      const coffeesData = req.body;
      const result = await usersCollection.insertOne(coffeesData);
      res.send(result)
      console.log(coffeesData);
    })

    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const uprion = { upsert: true };
      const updateCoffe = req.body;

      const updatDoc = {
        $set: updateCoffe
      }

      const result = await usersCollection.updateOne(filter, updatDoc, uprion)
      res.send(result)
    })

    app.get('/coffees', async (req, res) => {
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) }
      const result = await usersCollection.findOne(quary)
      res.send(result)
    })

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;

      const quary = { _id: new ObjectId(id) }
      const result = await usersCollection.deleteOne(quary)
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await firebaseCullaction.insertOne(user)
      res.send(result)
    })
    app.get('/users', async (req, res) => {
      const result = await firebaseCullaction.find().toArray()
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
