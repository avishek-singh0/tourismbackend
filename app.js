const express = require('express');
const morgan = require('morgan');


const app = express();


// Routes
const tourRouter = require('./routes/tourRouter.js')
const userRouter = require('./routes/userRouter')
const reviewRouter = require('./routes/reviewRoute.js')

// Middleware - it use to req to res
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    console.log('Hello from Middleware ');
    next();
});


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
});


// Mounting 
app.use('/api/v1/tour', tourRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/review',reviewRouter);






module.exports = app;