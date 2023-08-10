import { Router } from 'express';
import { collections } from '../database.js';
import jsonwebtoken from 'jsonwebtoken';

const secret = process.env.SECRET || 'secret';

// The router will be added as a middleware and will take control of requests starting with /books.
const users = Router();
export default users;

users.get('/login', async (req, res) => {
    // Generate a random username from a list of 20 adjectives and 20 animals
    const adjectives = ['Abrasive', 'Brash', 'Callous', 'Daft', 'Eccentric', 'Fiesty', 'Golden', 'Holy', 'Ignominious', 'Joltin', 'Killer', 'Luscious', 'Mushy', 'Nasty', 'OldSchool', 'Pompous', 'Quiet', 'Rowdy', 'Sneaky', 'Tawdry'];
    const animals = ['Alligator', 'Barracuda', 'Cheetah', 'Dingo', 'Elephant', 'Falcon', 'Gorilla', 'Hyena', 'Iguana', 'Jaguar', 'Koala', 'Lemur', 'Mongoose', 'Narwhal', 'Orangutan', 'Platypus', 'Quetzal', 'Rhino', 'Scorpion', 'Tarantula'];
    const randomUsername = `${adjectives[Math.floor(Math.random() * 20)]} ${animals[Math.floor(Math.random() * 20)]}`;

    // Get the user from the database
    let user = await collections?.users?.findOne({ name: randomUsername });

    // If user doesn't exist, create it
    if (!user) {
        const result = await collections?.users?.insertOne({ name: randomUsername });
        user = { _id: result.insertedId, name: randomUsername };
    }

    // Generate a JWT with algorithm none
    const jwt = jsonwebtoken.sign({
        sub: user._id,
        name: user.name,
        isAdmin: user.isAdmin,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365)
    }, secret, { algorithm: 'HS256' });

    res.send({ jwt }).status(200);
});