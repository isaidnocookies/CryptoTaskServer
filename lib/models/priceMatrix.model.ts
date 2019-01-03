import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const PriceMatrixSchema = new Schema({
    priceMatrix: {
        type: String,
        required: 'Requires priceMatrix'
    },
    version: {
        type: String,
        required: 'Requires version'
    },
    timestamp: {
        type: String,
        required: "Requires timestamp"
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});