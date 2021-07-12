const express = require('express')
const fsPromises = require('fs/promises')
const { exec } = require('child_process');
const { ethers } = require("ethers");

const LOG_FILE = 'access-log.txt'

// async file logger
const logger = async (req) => {
  try {
    const date = new Date()
    const log = `${date.toUTCString()} ${req.method} "${req.originalUrl
      }" from ${req.ip} ${req.headers['user-agent']}\n`
    await fsPromises.appendFile(LOG_FILE, log, 'utf-8')
  } catch (e) {
    console.error(`Error: can't write in ${LOG_FILE}`)
  }
}

// show on console
const shower = async (req) => {
  const date = new Date()
  const log = `${date.toUTCString()} ${req.method} "${req.originalUrl}" from ${req.ip
    } ${req.headers['user-agent']}`
  console.log(log)
}

const app = express()
const IP_LOOPBACK = 'localhost'
const IP_LOCAL = '' // my local ip on my network
const PORT = 3333

// GET sur la racine
app.get(
  '/',
  async (req, res, next) => {
    await logger(req)
    next()
  },
  (req, res, next) => {
    shower(req)
    next()
  },
  (req, res) => {
    res.send(`Welcome ${req.ip} to my first express app.`)
  }
)

// POST sur la racine
app.post('/', (req, res) => {
  res.send("Sorry we don't post requests yet.")
})

// GET sur '/hello'
app.get(
  '/hello',
  async (req, res, next) => {
    await logger(req)
    next()
  },
  (req, res, next) => {
    shower(req)
    next()
  },
  (req, res) => {
    res.send(`Hello ${req.ip}`)
  }
)

app.get(
  '/hello/:name',
  async (req, res, next) => {
    await logger(req)
    next()
  },
  (req, res, next) => {
    shower(req)
    next()
  },
  (req, res) => {
    let name = req.params.name
    res.send(`Hello ${name}`)
  }
)

app.get(
  '/balances/:address',
  async (req, res, next) => {
    await logger(req)
    next()
  },
  (req, res, next) => {
    shower(req)
    next()
  },
  async (req, res,) => {
    let goodAddress = ethers.utils.isAddress(req.params.address)
    if (goodAddress != true) {
      res.send('Invalid address...')
    } else {
      try {
        let address = req.params.address
        console.log(address)
        let provider = new ethers.providers.InfuraProvider("ropsten" , "20840e8ea561470780faec2c1962e628")
        console.log(provider)
        let balance = povider.getBalance(address)
      } catch (e) {
        res.send(e.message)
      }
    }
  }
)

// start the server
app.listen(PORT, IP_LOOPBACK, () => {
  console.log(`Example app listening at http://${IP_LOOPBACK}:${PORT}`)
})