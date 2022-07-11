const booksModel = require("../models/booksModel");
const validation = require('../validator/validation')
const moment = require('moment')
const mongoose = require('mongoose')
const createBook = async function (req, res) {
  try {
    let data = req.body;
    if (validation.isBodyEmpty(createBook)) return res.status(400).send({ status: false, message: "Please provide required data" });
    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

    if (!validation.isValid(title)) return res.status(400).send({ status: false, message: "title tag is required" });
    if (!validation.isValid(excerpt)) return res.status(400).send({ status: false, message: "excerot tag is required" });
    data.excerpt = data.excerpt.trim().split(" ").filter(word => word).join(" ")
    if (userId == '' || !userId) return res.status(400).send({ status: false, message: "userId tag is required" });
    if (!validation.isValidOjectId(userId)) return res.status(400).send({ status: false, message: "Object id is Invalid" });
    if (!ISBN) return res.status(400).send({ status: false, message: "ISBN tag is required" });

    // if(validation.isVerifyString(title)) return res.status(400).send({ status: false, message: "title Doesn't contains digit" });
    data.title = data.title.trim().split(" ").filter(word => word).join(" ")
    if (!validation.checkISBN(ISBN)) return res.status(400).send({ status: false, message: "please provide valid ISBN number" });
    if (!validation.isValid(category)) return res.status(400).send({ status: false, message: "category tag is required" });
    if (validation.isVerifyString(category)) return res.status(400).send({ status: false, message: "category Doesn't contains digit" });
    if (!validation.isValid(subcategory)) return res.status(400).send({ status: false, message: "subcategory tag is required" });
    // if(validation.isVerifyString(subcategory)) return res.status(400).send({ status: false, message: "subcategory Doesn't contains digit" });


    if (!validation.isValidRelAt(releasedAt)) return res.status(400).send({ status: false, message: "Date is Invalid" });
    if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt tag is required" });
    if (!moment(data.releasedAt, "YYYY-MM-DD", true).isValid()) return res.status(400).send({ status: false, message: "Please Provide a valid date formate:'YYYY-MM-DD'" });

    // if old date then it return positive number;
    let date = moment().diff(releasedAt, 'months')
    console.log(date)
    if (date > 0) return res.status(400).send({ status: false, message: "You can not insert old date" });

    let loggedInUserId = req.userId;

    if (loggedInUserId != data.userId) return res.status(403).send({ status: false, message: "you are not autherized" })
    let istitleUnique = await booksModel.find({ title: title })
    if (istitleUnique.length != 0) return res.status(400).send({ status: false, message: "Please provide a unique title" })
    let isISBNUnique = await booksModel.find({ ISBN: ISBN })
    if (isISBNUnique.length != 0) return res.status(400).send({ status: false, message: "Please provide a unique ISBN" })
    let result = await booksModel.create(data);
    const obj = {
      "_id": result._id,
      "title": result.title,
      "excerpt": result.excerpt,
      "userId": result.userId,
      "ISBN": result.ISBN,
      "category": result.category,
      "subcategory": result.subcategory,
      "isDeleted": result.isDeleted,
      "reviews": result.reviews,
      "releasedAt": result.releasedAt,
      "createdAt": result.createdAt,
      "updatedAt": result.updatedAt,
    }


    res.status(201).send({ status: true, message: 'Success', data: obj });

  } catch (error) { res.status(500).send({ status: false, msg: error.message }) }
};



const getBooks = async function (req, res) {
  // book _id, title, excerpt, userId, category, releasedAt, reviews field.
  let data = req.query;

  if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please provide some key for filteration" })

  if (data.userId) { if (!mongoose.Types.ObjectId.isValid(data.userId)) return res.status(404).send({ status: false, msg: "Please provide a Valid userId" }) }

  
  const { userId, category, subcategory } = data;

  let filter = {
    isDeleted: false,
    ...data
  }

  if (userId == '') return res.status(400).send({ status: false, message: "userId should not be empty" })

  // here checked , if subcategory tag is present but value is empty 
  if (subcategory == '') {
    if (!validation.isValid(subcategory)) return res.status(400).send({ status: false, message: "subcategory should not be empty" })
  }

  // here checked , if category tag is present but value is empty 
  if (category == '') {
    if (!validation.isValid(category)) return res.status(400).send({ status: false, message: "category should not be empty" })
  }


  if (validation.isValid(category)) {
    filter['category'] = category.trim()
  }

  if (filter.userId) {
    let id = filter.userId.toString();
    if (!validation.isValid(id)) return res.status(400).send({ status: false, msg: "userId should not be empty" })
  }

  if (validation.isValid(userId)) {
    filter['userId'] = userId
  }

  if (validation.isValid(subcategory)) {
    const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
    filter['subcategory'] = { $in: subcatArr }
  }

  let result = await booksModel.find(filter).select({ subcategory: 0, createdAt: 0, updatedAt: 0, deletedAt: 0, __v: 0, isDeleted: 0, ISBN: 0 }).sort({ 'title': 1 });
  if (!result) return res.status(404).send({ status: false, msg: "No Records found" })
  res.status(200).send({ status: true, message: 'Books List', data: result })
}

const getBlogById = async function (req, res) {
  let bookId = req.params.bookId
  if (!bookId) return res.status(400).send({ status: false, message: "please provide a bookId in params" });
  if (!validation.isValidOjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is invalid" });
  let isAvailabeThisId = await booksModel.findById(bookId);
  if (!isAvailabeThisId) return res.status(404).send({ status: false, message: `No records Found by using  ${bookId} book Id` });

  let getBook = await booksModel.findById(bookId).select({ deletedAt: 0, __v: 0, ISBN: 0 }); 
  // to create a unfreeze object --> .lean()
  let getBook2 = JSON.parse(JSON.stringify(getBook))  // deepCopy
  getBook2.reviewsData=[]
  // let output = {
  //   "_id": getBook._id,
  //   "title": getBook.title,
  //   "excerpt": getBook.excerpt,
  //   "userId": getBook.userId,
  //   "category": getBook.category,
  //   "subcategory": getBook.subcategory,
  //   "isDeleted": getBook.isDeleted,
  //   "reviews": getBook.reviews,
  //   "releasedAt": getBook.releasedAt,
  //   "createdAt": getBook.createdAt,
  //   "updatedAt": getBook.updatedAt,

  //   "reviewsData": []

  // }
  res.status(200).send({ status: true, data: getBook2 })

}

const updateBlogById = async function (req, res) {
  try {
    let bookId = req.params.bookId
    if (!bookId) return res.status(400).send({ status: false, message: "please provide a bookId in params" });
    if (!validation.isValidOjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is invalid" });

    let data = req.body;
    if (!validation.isBodyEmpty(data)) return res.status(400).send({ status: false, message: "Please Provide some data for updation" });
    let { title, excerpt, releasedAt, ISBN } = data;

    if (title) {
      if (!validation.isValid(title)) return res.status(400).send({ status: false, message: "Title should not be empty" });
      title = title.trim().split(" ").filter(word => word).join(" ")
    }
    
    

    if (excerpt) {
      if (!validation.isValid(excerpt)) return res.status(400).send({ status: false, message: "excerpt should not be empty" });
      excerpt = excerpt.trim().split(" ").filter(word => word).join(" ")
    }
    

    if (releasedAt) {
      if (!moment(releasedAt, "YYYY-MM-DD", true).isValid()) return res.status(400).send({ status: false, message: "Please Provide a valid date formate:'YYYY-MM-DD'" });
    }

    if (ISBN) {
      if (!validation.checkISBN(ISBN)) return res.status(400).send({ status: false, message: "please provide valid ISBN number" });
    }

    // check these key, value availabe in db or not
    let isTitleUnique = await booksModel.findOne({ title: title });
    if (isTitleUnique) return res.status(400).send({ status: false, message: "title is already availalbe" });

    let isISBNUnique = await booksModel.findOne({ ISBN: ISBN });
    if (isISBNUnique) return res.status(400).send({ status: false, message: `This ${ISBN} (ISBN) is already availalbe` });


    let isAvailabeThisId = await booksModel.findById({ _id: bookId, isDeleted: false });
    if (!isAvailabeThisId) return res.status(404).send({ status: false, message: `No records Found by using  ${bookId} book Id` });

    // here we have to implement date logic 


    let loggedInUserId = req.userId;
    let userId = isAvailabeThisId.userId;
    if (loggedInUserId != userId) return res.status(403).send({ status: false, message: `you are not autherized to update ${bookId} bookId` })

    let updatedData = await booksModel.findOneAndUpdate({ _id: bookId }, { $set: { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt } }, { new: true });
    res.status(200).send({ status: true, message: 'Success', data: updatedData });

  } catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}





const deleteBookById = async function(req,res){
  try{

    let bookId = req.params.bookId;
    if(!bookId) return res.status(400).send({ status: false,msg: "Please provide the valid bookId in params",});
    if(!validation.isValidOjectId(bookId)) return res.status(400).send({ status: false,msg: "Book Id is invalid",});

    let isAvailabeThisId = await booksModel.findById({ _id: bookId, isDeleted: false });
    if (!isAvailabeThisId) return res.status(404).send({ status: false, message: `No records Found by using  ${bookId} book Id` });

    let loggedInUserId = req.userId;
    let userId = isAvailabeThisId.userId;
    if (loggedInUserId != userId) return res.status(403).send({ status: false, message: `you are not autherized to update ${bookId} bookId` })


    let result = await booksModel.findOneAndUpdate({_id: bookId, isDeleted:false},{$set:{isDeleted:true, deletedAt: Date.now()}});
    res.status(200).send({status:true,message:'Success'})

}catch(error){
  res.status(500).send(error.message);
}
}








module.exports = {
  createBook, getBlogById, getBooks, updateBlogById,deleteBookById
}
