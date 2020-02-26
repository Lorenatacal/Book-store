var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var database = require('./database');
const Book = require('./models/books/Book.model')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/books', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      database
    }
  })
})

app.get('/books/:id', (req, res, next) => {
  const { id } = req.params
  const doesBookExist = database.books[id]

  if(doesBookExist) {
    res.status(200).json({
      status: 'success',
      data: {
        books: database.books[id]
      }
    })
  } else {
    res.status(400).toJson({
      status: 'fail'
    })
  }
})
app.post('/books', async (req, res, next) => {
  try{
    const { name, author, type, publicationDate, raiting} = req.body
    const createdBook = await Book.create({name, author, type, publicationDate, raiting})
    res.status(201).json({
      status: 'success',
      data: {
        createdBook
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid lesson '
    })
  }
})

app.delete('/books/:id', (req, res, next) => {
  const { id } = req.params
  delete database.books[id]
  res.status(200).json({
    status: 'success',
    message: `Deleted ${id}`
  })
})

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

module.exports = app;
