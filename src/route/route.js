const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const auth = require('../auth/auth')

router.post('/register', userController.registration);
router.post('/login', userController.login);

router.post('/books',auth.tokenverification, bookController.createBook);
router.get('/books',bookController.getBooks);
router.get('/books/:bookId',bookController.getBlogById)
router.put('/books/:bookId',auth.tokenverification, bookController.updateBlogById)
router.delete('/books/:bookId',auth.tokenverification, bookController.deleteBookById)


// Review API's
router.post('/books/:bookId/review')







module.exports = router;