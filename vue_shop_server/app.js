const express = require('express')
const compression = require('compression')

const app = express()

// 这行必须写在静态资源托管前，否则不生效
app.use(compression())

app.use(express.static('./dist'))

app.listen(80, () => {
    console.log('server running at http://127.0.0.1')
})