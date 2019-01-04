import { Config } from "../config/config";
import * as mongoose from 'mongoose';
import { PriceMatrixSchema } from '../models/priceMatrix.model'

import { TesterFunctions } from "../helpers/tester.functions";
import { LoggingFunctions } from "../helpers/logging.functions";

import { MemoryController } from '../controllers/memory.controller';
import { StorageController } from '../controllers/storage.controller';

// Matrix Controller Interfaces with the with storage mechanisms to retrieve price matrix
class MatrixController {
    memoryController: MemoryController;
    storageController: StorageController;
    config: Config;
    logger: LoggingFunctions;

    constructor () {
        this.config = new Config();
        this.logger = new LoggingFunctions();
        this.memoryController = new MemoryController();
        this.storageController = new StorageController();
    }

    getPriceMatrix() {
        var matrix = this.memoryController.getPriceMatrix();
        return matrix;
    }

    getMatrixData() {
        // check cache. if nothing, check db...
    }

    getMatrixDataFromDB() {
        // get matrix data from db
    }

    getCachedPriceDataFromMemory() {
        return this.memoryController.getAllMarketValueData();
    }

    async saveMatrixData(data) {
        // save to db
        if (this.config.saveMatrixToDatabase) {
            var PriceMatrixObject: any = mongoose.model('PriceMatrixObject', PriceMatrixSchema);

            try {
                const priceMatrix = new PriceMatrixObject({ priceMatrix: JSON.stringify(data), version: this.config.version, timestamp: data.timestamp });
                return priceMatrix.save().then(() => {
                    this.logger.log_debug("MatrixService", "saveMatrix", "Matrix saved to DB", "");
                })
            } catch (error) {
                this.logger.log_error("MatrixService", "saveMatrix", "Failed to save to matrix to DB", "");
            }
        }
    }

    cacheMatrixData(data) {
        this.memoryController.cachePriceMatrix(data);
    }
}

export { MatrixController }