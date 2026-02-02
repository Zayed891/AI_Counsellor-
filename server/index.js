import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import shortlistRoutes from './routes/shortlistRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import aiRoutes from './routes/aiRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.use('/api/shortlist', shortlistRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/ai', aiRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
