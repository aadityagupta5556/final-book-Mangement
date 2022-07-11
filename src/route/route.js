const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const auth = require('../auth/auth')

router.post('/register', userController.registration);
router.post('/login', userController.login);

router.post('/books',auth.tokenverification, bookController.createBook);
router.get('/books',auth.tokenverification,bookController.getBooks);
router.get('/books/:bookId', auth.tokenverification,bookController.getBookById)
router.put('/books/:bookId',auth.tokenverification, bookController.updateBookById)
router.delete('/books/:bookId',auth.tokenverification, bookController.deleteBookById)


// Review API's
router.post('/books/:bookId/review',reviewController.createReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReivewData)
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReviewData)







module.exports = router;