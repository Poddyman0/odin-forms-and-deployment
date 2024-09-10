const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog'); 
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
require('dotenv').config()

const app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
});
// Apply rate limiter to all requests
app.use(limiter);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
})
/*
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["*"],
    },
  }),
);
*/
/*
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["*"],   // Allow default source from anywhere
    scriptSrc: ["*"],    // Allow script source from anywhere
    styleSrc: ["*"],     // Allow style source from anywhere
    imgSrc: ["*"],       // Allow image source from anywhere
    connectSrc: ["*"],   // Allow connections to any source
    fontSrc: ["*"],      // Allow font source from anywhere
    objectSrc: ["*"],    // Allow object source from anywhere
    mediaSrc: ["*"],     // Allow media source from anywhere
    frameSrc: ["*"]      // Allow frame source from anywhere
  }
}));
*/
//app.use(cors());

app.use(compression()); // Compress all routes

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


    // removed
  /*
    app.listen(3000, () =>
      console.log(`App listening on port 3000!`),
    );
    */
   // Use PORT provided in environment or default to 3000
   /*
   const port = process.env.PORT || 3000;

   // Listen on `port` and 0.0.0.0
   app.listen(port, "0.0.0.0", function () {
     // ...
   });
       */

module.exports = app;