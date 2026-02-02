import express from 'express'
import { handleChat, handleSpeak, handleExtract } from '../controllers/aiController.js'

const router = express.Router()

router.post('/chat', handleChat)
router.post('/speak', handleSpeak)
router.post('/extract', handleExtract)

export default router
