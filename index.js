const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dospc0a.mongodb.net/?retryWrites=true&w=majority`;


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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const userCollection = client.db("UsersDB").collection('Users');
        const brandCollection = client.db("UsersDB").collection('Brands');
        const cartCollection = client.db("UsersDB").collection('Cart Items')


        // For Product api

        app.get('/products', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:brand', async (req, res) => {
            const product = req.body;
            const brand = { brand_name: product.brand_name };
            const result = await brandCollection.findOne(brand);
            res.send(result);
        })

        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = req.body;
            const newProduct = {
                $set: {
                    name: updatedProduct.name,
                    brand: updatedProduct.brand,
                    photo: updatedProduct.photo,
                    desc: updatedProduct.desc,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    rating : updatedProduct.rating
                }
            }
            const result = await brandCollection.updateOne(filter, newProduct, options);
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const products = req.body;
            console.log(products)
            const result = await brandCollection.insertOne(products);
            res.send(result);
        })



        // add item to Cart

        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/cart', async (req, res) => {
            const items = req.body;
            console.log(items)
            const result = await cartCollection.insertOne(items);
            res.send(result);
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })


        // User api starts from here
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('This is server home side')
});


app.listen(port, () => {
    console.log(`Server is running on port:${port}`)
});


