import express from 'express'
import {
    getShortlist,
    addToShortlist,
    removeFromShortlist,
    updateCategory,
    lockUniversity,
    unlockUniversity
} from '../controllers/shortlistController.js'

const router = express.Router()

router.get('/', getShortlist)
router.post('/', addToShortlist)
router.delete('/:id', removeFromShortlist)
router.patch('/:id', updateCategory)
router.patch('/:id/lock', lockUniversity)
router.patch('/:id/unlock', unlockUniversity)

export default router
