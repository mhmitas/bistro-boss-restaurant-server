const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('BISTRO BOSS RESTAURENT SERVER')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jt5df8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const database = client.db('bistroDB')
        const menuColl = database.collection('menu')
        const reviewColl = database.collection('review')
        const cartColl = database.collection('carts')

        // get menu from db
        app.get('/menu', async (req, res) => {
            let query = {}
            let limit = 0
            if (req.query.category) {
                query = { category: req.query.category }
            }
            if (req.query.limit) {
                limit = parseInt(req.query.limit)
            }
            const result = await menuColl.find(query).limit(limit).toArray()
            res.send(result)
        })

        // get reviews from db
        app.get('/reviews', async (req, res) => {
            const result = await reviewColl.find().toArray()
            res.send(result)
        })

        // cart collection
        app.get('/carts/:uid', async (req, res) => {
            const uid = req.params.uid
            let query = { userId: uid }
            const result = await cartColl.find(query).toArray()
            res.send(result)
        })

        // get cart items added by the user
        app.get('/menu-items/:uid', async (req, res) => {
            const uid = req.params.uid
            let query = { userId: uid }
            const items = await cartColl.find(query).toArray()
            console.log(items)
            const itemIds = items.map(item => item.itemId)
            const objectIds = itemIds.map(id => ObjectId.createFromHexString(id))
            const filter = { _id: { $in: objectIds } }
            const menuItems = await menuColl.find(filter).toArray()
            res.send(menuItems)
        })

        app.post('/carts', async (req, res) => {
            const cart = req.body;
            const result = await cartColl.insertOne(cart);
            res.send(result)
        })

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = { itemId: id }
            const result = await cartColl.deleteOne(query)
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
    console.log('BISTRO BOSS server is listening on port:', port)
})