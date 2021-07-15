const cors  = require('cors')
const express  = require('express')

const IP_LOOPBACK = 'localhost'
const PORT = 3000
const LOG_FILE = 'logs/access-log.txt'

// Our user database
const db_user = {
  alice: '123',
  bob: '456',
  charlie: '789',
}

// timer middleware
const timer = (req, res, next) => {
  const date = new Date()
  req.requestDate = date.toUTCString()
  next()
}

// logger middleware
const logger = async (req, res, next) => {
  try {
    const log = `${req.requestDate} ${req.method} "${req.originalUrl}" from ${req.ip} ${req.headers['user-agent']}\n`
    await fsPromises.appendFile(LOG_FILE, log, 'utf-8')
  } catch (e) {
    console.error(`Error: can't write in ${LOG_FILE}`)
  } finally {
    next()
  }
}

// shower middleware
const shower = async (req, res, next) => {
  const log = `${req.requestDate} ${req.method} "${req.originalUrl}" from ${req.ip} ${req.headers['user-agent']}`
  console.log(log)
  next()
}

// Middleware for checking if user exists
const userChecker = (req, res, next) => {
  const username = req.body.username
  if (db_user.hasOwnProperty(username)) {
    next()
  } else {
    res.status(401).send('Username or password invalid.')
  }
}

// Middleware for checking if password is correct
const passwordChecker = (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  if (db_user[username].password === password) {
    next()
  } else {
    res.status(401).send('Username or password invalid.')
  }
}

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false })) // to support URL-encoded bodies
app.use(express.json()) // to support JSON-encoded bodies
app.use(timer)
app.use(logger)
app.use(shower)

// Configure express to use these 2 middlewares for /login route only
app.use('/login', userChecker)
app.use('/login', passwordChecker)

app.post('/login', (req, res) => {
  let username = req.body.username
  res.send(`Welcome to your dashboard ${username}`)
})

// start the server
app.listen(PORT, IP_LOOPBACK, () => {
  console.log(`Example app listening at http://${IP_LOOPBACK}:${PORT}`)
})
