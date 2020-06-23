const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('./auth')
const indexRouter = require('./routes/index')
const signupRouter = require('./routes/signup')
const loginRouter = require('./routes/login')
const forgatPassRouter = require('./routes/forgat_pass.js')
const resetPassRouter = require('./routes/reset_pass')
const tasksRouter = require('./routes/tasks')
const createFolderRouter = require('./routes/create_folder')
const createTaskRouter = require('./routes/create_task')
const editTaskRouter = require('./routes/edit_task')
const mainRegistration = require('./routes/main_registration')
const MongoDBStore = require('connect-mongodb-session')(session)
const store = new MongoDBStore({
  uri:
    'mongodb://heroku_7tb00thv:moom4gb9g25ob91p5gttc4pd01@ds149218.mlab.com:49218/heroku_7tb00thv',
  collection: 'mySessions',
})
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/public')))
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: false,
      maxage: 1000 * 60 * 30,
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use('/', indexRouter)
app.use('/signup', signupRouter)
app.use('/login', loginRouter)
app.use('/forgat-pass', forgatPassRouter)
app.use('/reset-pass/:token', resetPassRouter)
app.use('/folders/:id/tasks', tasksRouter)
app.use('/folders/create', createFolderRouter)
app.use('/folders/:id/create/tasks', createTaskRouter)
app.use('/folders/:id/tasks/:taskid/edit', editTaskRouter)
app.use('/verify/:id/:hash', mainRegistration)

mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect(
  'mongodb://heroku_7tb00thv:moom4gb9g25ob91p5gttc4pd01@ds149218.mlab.com:49218/heroku_7tb00thv',
  (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('success')
    }
  }
)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
