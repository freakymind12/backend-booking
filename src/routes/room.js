const express = require('express')
const router = express.Router()
const roomController = require('../controllers/roomController')

router.post('/', roomController.newRoom)
router.get('/', roomController.getRooms)
router.get('/:id', roomController.getRoomsById)
router.patch('/:id', roomController.updateRoom)
router.delete('/:id', roomController.deleteRoom)

module.exports = router