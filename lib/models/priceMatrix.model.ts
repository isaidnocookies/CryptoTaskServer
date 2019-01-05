import * as mongoose from 'mongoose';
import { Config } from '../config/config';

const Schema = mongoose.Schema;
const config = new Config();

export const PriceMatrixSchema = new Schema({
    priceData: {
        type: Object,
        required: 'Requires Price Data'
    },
    includedCoins: {
        type: Array,
        required: 'Requires included Coins'
    },
    timestamp: {
        type: String,
        required: "Requires timestamp"
    },
    version: {
        type: String,
        default: config.version
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});