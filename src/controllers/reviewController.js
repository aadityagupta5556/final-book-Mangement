const validation = require('../validator/validation')
const booksModel = require('../models/booksModel')

const createReview = async function(req,res)
{
    let bookId = req.params.bookId;
    if(!bookId) return res.status(400).send({status:false, message:"please provide bookId"})
    if(!validation.isValidOjectId(bookId)) return res.status(400).send({status:false, message:"bookId is invalid"})
    
    let idExistOrNot = await booksModel.findById(bookId)
    if(!idExistOrNot) return res.status(400).send({status:false, message:"None of the books exists on this bookId"})

    


}