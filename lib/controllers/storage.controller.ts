import { Config } from "../config/config";
import * as mongoose from 'mongoose';
import { PriceMatrixSchema } from '../models/priceMatrix.model'

import { TesterFunctions } from "../helpers/tester.functions";
import { LoggingFunctions } from "../helpers/logging.functions";

// Storage Controller Interfaces with the MongoDB Database for persistent storage
class StorageController {
    config: Config;
    logger: LoggingFunctions;

    constructor() {
        this.config = new Config();
        this.logger = new LoggingFunctions();
    }

    saveMatrixData(data) {
        // save to db
        if (this.config.saveMatrixToDatabase) {
            var PriceMatrixObject: any = mongoose.model('PriceMatrixObject', PriceMatrixSchema);

            try {
                const priceMatrix = new PriceMatrixObject({ priceMatrix: JSON.stringify(data), version: this.config.version, timestamp: data.timestamp });
                return priceMatrix.save().then(() => {
                    this.logger.log_debug("MatrixService", "saveMatrix", "Matrix saved to DB", "");
                })
            } catch (error) {
                this.logger.log_fatal("MatrixService", "saveMatrix", "Failed to save to matrix to DB", "");
            }
        }
    }

    getPriceData() {
        // TODO
    }
}

export { StorageController }