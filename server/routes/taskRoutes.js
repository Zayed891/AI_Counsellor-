import express from 'express'
import {
    getTasks,
    addTask,
    toggleTask,
    deleteTask
} from '../controllers/taskController.js'

const router = express.Router()

router.get('/', getTasks)
router.post('/', addTask)
router.patch('/:id/toggle', toggleTask)
router.delete('/:id', deleteTask)

export default router
