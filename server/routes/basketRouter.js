const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const basketController = require('../controllers/basketController')



router.post('/:id', authMiddleware, basketController.add)
router.post('/delete/:id', authMiddleware, basketController.delete)
router.get('/getAll', authMiddleware, basketController.getAll)
router.get('/getOne/:id', authMiddleware, basketController.getOne)

module.exports = router