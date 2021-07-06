const express = require('express')
const app = express()

app.get('/user', (req, res) => {
  res.json({name: 'xiaoming'})
})

app.listen(9001, () => {
  console.log('server is running')
})