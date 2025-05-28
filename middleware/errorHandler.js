module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
};

import cors from 'cors'
import express from 'express'

const app = express()

app.use(cors())
app.get('/api/menu', (req, res) => {
    res.json(menuData)
})
