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
        type: string,
        required: true,
        default: 'Guest'
    },

    reviewedAt: {
        type: Date,
        required: true
    },

    rating: {
        type: number,
        required: true
    },
    review: {
        type: string,
    },

    isDeleted: {
        type: boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model('reviewModel', reviewModel)