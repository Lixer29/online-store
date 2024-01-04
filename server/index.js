require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./db')
const models = require('./models/model')
const router = require('./routes/index')
const path = require('path')
const fileUpload = require('express-fileupload')
const errorMiddleware = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)


app.use(errorMiddleware)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`App started on port ${PORT} `))
    } catch (e) {
        console.log(e)
    }
}

start()