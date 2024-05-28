const express = require('express')
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const stripe = require('stripe')(process.env.STRIPE_SECRER_KEY)
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

const database = client.db('bistroDB')
const menuColl = database.collection('menu')
const userColl = database.collection('users')
const reviewColl = database.collection('review')
const cartColl = database.collection('carts')

// my middlewares;
const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unAuthorize access' })
    }
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unAuthorize access' })
        }
        req.user = decoded
        next()
    })
}
//  Before verify admin must verify token |
async function verifyAdmin(req, res, next) {
    const email = req.user.email;
    const query = { email: email }
    const user = await userColl.findOne(query)
    const isAdmin = user?.role === 'admin'
    if (!isAdmin) {
        return res.status(403).send({ message: 'Forbidden Access' })
    }
    next()
}

async function run() {
    try {

        // JWT related APIs
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ token })
        })

        // Users Related APIs //
        // get all users by admin
        app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
            const result = await userColl.find().toArray()
            res.send(result)
        })

        // checking is the user is an admin or not 
        app.get('/users/admin/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            // Checking... is this the token of the user who made the request ?
            if (email !== req.user.email) {
                return res.status(403).send({ message: 'Forbidden Access' })
            }
            const query = { email: email }
            const user = await userColl.findOne(query)
            let admin = false
            if (user) {
                // checking if role present in the user : does the role is admin ?
                admin = user?.role === 'admin'
            }
            res.send({ admin })
        })

        // post user to database
        app.post('/users', async (req, res) => {
            const user = req.body;
            // insert email if user doesn't exists
            const query = { email: user.email }
            const isExist = await userColl.findOne(query)
            if (isExist) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userColl.insertOne(user)
            res.send(result)
        })

        // Delete user by admin
        app.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userColl.deleteOne(query)
            res.send(result)
        })

        // change role of the user by admin
        app.patch('/users/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await userColl.updateOne(filter, updateDoc)
            res.send(result)
        })

        // menu items related APIs //
        // get menu from db
        app.get('/menu', async (req, res) => {
            let query = {};
            let limit = 0;
            let sort = { _id: -1 };
            if (req.query.category) {
                query = { category: req.query.category }
            }
            if (req.query.limit) {
                limit = parseInt(req.query.limit)
            }
            const result = await menuColl.find(query).sort(sort).limit(limit).toArray()
            res.send(result)
        })

        // post a new menu itme to the database
        app.post('/menu', verifyToken, verifyAdmin, async (req, res) => {
            const item = req.body
            const result = await menuColl.insertOne(item)
            res.send(result)
        })

        app.delete('/menu/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await menuColl.deleteOne(query)
            res.send(result)
        })

        // get reviews from db
        app.get('/reviews', async (req, res) => {
            const result = await reviewColl.find().toArray()
            res.send(result)
        })

        // cart collection
        app.get('/carts/:email', async (req, res) => {
            const email = req.params.email
            let query = { userEmail: email }
            const result = await cartColl.find(query).toArray()
            res.send(result)
        })

        // get cart items added by the user
        app.get('/cart-items/:email', async (req, res) => {
            const email = req.params.email
            let query = { userEmail: email }
            const items = await cartColl.find(query).toArray()
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

        // Payment intend
        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body
            const amount = parseInt(price * 100)
            console.log(amount)
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ["card"],
            })
            res.send({
                clientSecret: paymentIntent.client_secret
            })
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