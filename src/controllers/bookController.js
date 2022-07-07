const BookModel = require("../models/booksModel");
const validation = require('../validator/validation')
const createBook = async function (req, res) {
  try {
    let data = req.body;
    if(!validation.isBodyEmpty(createBook)) return res.status(400).send({ status: false, message: "Please provide required data" });
    const { title,excerpt, userId, ISBN, category, subcategory, releaseAt } =data;

     if(!validation.isValid(title)) return res.status(400).send({ status: false, message: "title tag is required" });
    if(!validation.isValid(excerpt)) return res.status(400).send({ status: false, message: "excerot tag is required" });
    if(userId=='' || !userId) return res.status(400).send({ status: false, message: "userId tag is required" });
    if(!validation.isValidOjectId(userId)) return res.status(400).send({ status: false, message: "Object id is Invalid" });
    if(!ISBN) return res.status(400).send({ status: false, message: "ISBN tag is required" });
    // if(!validation.checkISBN(ISBN)) return res.status(400).send({ status: false, message: "please provide valid ISBN number" });
    if(!validation.isValid(category)) return res.status(400).send({ status: false, message: "category tag is required" });
    if(!validation.isValid(subcategory)) return res.status(400).send({ status: false, message: "subcategory tag is required" });
    // if(!validation.isValid(releaseAt)) return res.status(400).send({ status: false, message: "releaseAt tag is required" });

    let loggedInUserId = req.userId;

    if (loggedInUserId != data.userId) return res.status(403).send({ status: false, message: "you are not autherized" })
    let result = await BookModel.create(data);
    res.status(201).send({ status: true, message:'Success', data: result });

  } catch (error) { res.status(500).send({ status: false, msg: error.message })}
};



const getBooks = async function(req,res)
{
  // book _id, title, excerpt, userId, category, releasedAt, reviews field.
  let data = req.query;
  let loginUserId = req.userId;

  const {userId, category, subcategory} = data;
  let filter={
    isDeleted:false,
    userId:loginUserId,
    ...data
  }

}



module.exports = {
  createBook
}
