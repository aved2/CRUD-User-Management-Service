require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { flash } = require('express-flash-message');
const session = require('express-session');
const methodOverride = require('method-override');

const connectDB = require('./server/config/db');

const app = express(); // Create an express app
const port = process.env.PORT || 5001; // Set the port

connectDB(); // Connect to the database

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

// Static files
app.use(express.static('public'));


// Express session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

// Express flash messages
app.use(flash({sessionKeyName: 'flashMessage'}));

// Template engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//Routes
app.use('/', require('./server/routes/customer'));

// Handle 404
app.get('*', (req, res) => {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});