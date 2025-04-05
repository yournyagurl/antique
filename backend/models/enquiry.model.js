import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
})

const enquiryModel = mongoose.model("Enquiry", enquirySchema);

export default enquiryModel