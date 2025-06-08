import express from 'express'
const app = express()
const port = 3000
import cookieParser from 'cookie-parser'
import cors from 'cors'
import UserRoutes from './routes/users.js'
import connectDB from './database/db.js'
import ListRoutes from './routes/TodoList.js'


app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

connectDB()
app.use('/users', UserRoutes)
app.use('/lists', ListRoutes)

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
