import { Config } from "../config/config";

import { TesterFunctions } from "../helpers/tester.functions";
import { LoggingFunctions } from "../helpers/logging.functions";
import { MatrixFunctions } from "../helpers/matrix.functions";

import { MemoryController } from '../controllers/memory.controller';
import { StorageController } from '../controllers/storage.controller';

// Matrix Controller Interfaces with the with storage mechanisms to retrieve price matrix
class MatrixController {
    memoryController: MemoryController;
    storageController: StorageController;
    config: Config;
    logger: LoggingFunctions;
    matrixFunctions: MatrixFunctions;

    tester: TesterFunctions;

    constructor () {
        this.config = new Config();
        this.logger = new LoggingFunctions();
        this.memoryController = new MemoryController();
        this.storageController = new StorageController();
        this.matrixFunctions = new MatrixFunctions();
        
        this.tester = new TesterFunctions();
    }

    async testAgainstExistingMatrix(url, newMatrix) {
        return await this.tester.testAgainstOtherMatrix(url, newMatrix);
    }

    getPriceMatrix() {
        // check cache. if nothing, check db...
        try {
            var matrix : any = this.memoryController.getPriceMatrix();
            if (matrix) {
                return matrix;
            } else {
                var dbMatrix : any = this.getMatrixFromDB();
                if (dbMatrix) {
                    return dbMatrix
                } else {
                    throw new Error("Failed to get matrix data")
                }
            }
        } catch(error) {
            this.logger.log_fatal("MatrixController", "getPriceMatrix", "Matrix Controller failed to get price matrix!", error);
            return {}
        }
    }

    async getMatrixFromDB() {
        // get matrix data from db
        var data : any = await this.storageController.getMostRecentPriceData();
        if (data.success === "false" || !data) {
            this.logger.log_error("MatrixController", "getMatrixFromDB", "Matrix Controller failed to get price matrix from db!","");
            return false;
        }

        var matrix: any = this.matrixFunctions.generateCompleteMatrix(data.priceData);
        matrix.timestamp = data.timestamp;
        return matrix;
    }

    getCachedPriceDataFromMemory() {
        return this.memoryController.getAllMarketValueData();
    }

    saveMatrixData(data, coins, timestamp) {
        this.storageController.saveMatrixData(data, coins, timestamp);
    }

    cacheMatrixData(data) {
        this.memoryController.cachePriceMatrix(data);
    }
}

export { MatrixController }