const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;
 
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = 'routes';
 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
 
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
 
    next();
});
 
app.use(express.json());
 
const client = new MongoClient(mongoUri);
 
let usersCollectionPromise;
 
let productsCollectionPromise;
 
async function getUsersCollection() {
    if (!usersCollectionPromise) {
        usersCollectionPromise = (async () => {
            await client.connect();
 
            const db = client.db(dbName);
            const collection = db.collection('users');
            await collection.createIndex({ email: 1 }, { unique: true });
            return collection;
        })();
    }
 
    return usersCollectionPromise;
}
 
async function getProductsCollection() {
    if (!productsCollectionPromise) {
        productsCollectionPromise = (async () => {
            await client.connect();
 
            const db = client.db(dbName);
            const collection = db.collection('products');
            return collection;
        })();
    }
 
    return productsCollectionPromise;
}
 
app.post('/data', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log('Received data:', body);
        res.send('Data received');
    });
});
 
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body || {};
 
    if (!name || !email || !password) {
        return res.status(400).json({
            ok: false,
            error: 'Name, email and password are required',
        });
    }
 
    try {
        const usersCollection = await getUsersCollection();
        const createdAt = new Date().toISOString();
        const result = await usersCollection.insertOne({ name, email, password, createdAt });
 
        return res.status(201).json({
            ok: true,
            user: {
                id: result.insertedId,
                name,
                email,
                createdAt,
            },
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(409).json({
                ok: false,
                error: 'Email already registered',
            });
        }
 
        console.error('Register error:', err);
        return res.status(500).json({
            ok: false,
            error: 'Internal server error',
        });
    }
});
 
app.post('/api/products', async (req, res) => {
    const { name, price, description } = req.body || {};
 
    if (!name || price === undefined || price === null) {
        return res.status(400).json({
            ok: false,
            error: 'Product name and price are required',
        });
    }
 
    const priceNumber = Number(price);
    if (Number.isNaN(priceNumber)) {
        return res.status(400).json({
            ok: false,
            error: 'Price must be a number',
        });
    }
 
    try {
        const productsCollection = await getProductsCollection();
        const createdAt = new Date().toISOString();
        const result = await productsCollection.insertOne({
            name,
            price: priceNumber,
            description: description || '',
            createdAt,
        });
 
        return res.status(201).json({
            ok: true,
            product: {
                id: result.insertedId,
                name,
                price: priceNumber,
                description: description || '',
                createdAt,
            },
        });
    } catch (err) {
        console.error('Create product error:', err);
        return res.status(500).json({
            ok: false,
            error: 'Internal server error',
        });
    }
});
 
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body || {};
 
    if (!email || !password) {
        return res.status(400).json({
            ok: false,
            error: 'Email and password are required',
        });
    }
 
    try {
        const usersCollection = await getUsersCollection();
        const user = await usersCollection.findOne({ email, password });
 
        if (!user) {
            return res.status(401).json({
                ok: false,
                error: 'Na fal por passwordi eshte gabim',
            });
        }
 
        return res.status(200).json({
            ok: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            ok: false,
            error: 'Internal server error',
        });
    }
});
 
getUsersCollection()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server listening on http://localhost:${port}`);
            console.log(`Connected to MongoDB: ${mongoUri} (db: ${dbName})`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });