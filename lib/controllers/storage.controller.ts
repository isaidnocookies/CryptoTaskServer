import { Config } from "../config/config";
import * as mongoose from 'mongoose';
import { PriceMatrixSchema } from '../models/priceMatrix.model'
import { LoggingFunctions } from "../helpers/logging.functions";

// Storage Controller Interfaces with the MongoDB Database for persistent storage
class StorageController {
    config: Config;
    logger: LoggingFunctions;

    constructor() {
        this.config = new Config();
        this.logger = new LoggingFunctions();
    }

    saveMatrixData(data, coins, timestamp) {
        // save to db
        if (this.config.saveMatrixToDatabase) {
            var PriceMatrixObject: any = mongoose.model('PriceMatrixObject', PriceMatrixSchema);

            try {
                const priceMatrix = new PriceMatrixObject({ priceData: JSON.stringify(data), includedCoins: coins, timestamp: timestamp });
                priceMatrix.save().then(() => {
                    //this.logger.log_debug("StorageController", "saveMatrixData", "Matrix data saved to DB", "");
                    this.getMostRecentPriceData();
                })
            } catch (error) {
                this.logger.log_fatal("StorageController", "saveMatrixData", "Failed to save matrix data to DB", "");
            }
        }
    }

    async getMostRecentPriceData() {
        var MicroWalletObject: any = mongoose.model('PriceMatrixObject', PriceMatrixSchema);
        return await MicroWalletObject.find().sort({ $natural: -1 }).limit(1).then(docs => {
            if (docs.length >= 1) {
                var data : any = docs[0];
                data.success = "true";
                return data;
                // return { success: true, uid: docs[0].uniqueid, owner: docs[0].owner, privatekey: docs[0].privatekey, secretKey: docs[0].secretkey, created: docs[0].created_date }
            } else {
                throw new Error("Failed to return most recent data");
            }
        }).catch((error) => {
            this.logger.log_fatal("StorageController", "getMostRecentPriceData", "Failed to retrieve most recent record", error);
            return {success: "false"};
        });
    }
}

export { StorageController }