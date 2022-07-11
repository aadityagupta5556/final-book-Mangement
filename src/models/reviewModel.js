const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
//reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
const reviewModel = new mongoose.Schema({
    bookId: {
        type: objectId,
        required: true,
        ref: "bookModel"
    },
    reviewedBy: {
        type: String,
        default: 'Guest'
    },

    reviewedAt: {
        type: Date,
        required: true
    },

    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model('reviewModel', reviewModel)