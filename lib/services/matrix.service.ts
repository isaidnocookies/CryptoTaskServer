import { Config } from "../config/config";
import { MatrixFunctions } from "../helpers/matrix.functions";
import { CachedData } from "../api/cachedData.api";

import * as mongoose from 'mongoose';
import { PriceMatrixSchema } from '../models/priceMatrix.model'

import { TesterFunctions } from "../helpers/tester.functions";
import { LoggingFunctions } from "../helpers/logging.functions";

class MatrixService {

    config: Config;
    cachedData: CachedData;
    matrixFunctions: MatrixFunctions;
    logger: LoggingFunctions;

    constructor(cachedData) {
        this.config = new Config();
        this.cachedData = cachedData;
        this.matrixFunctions = new MatrixFunctions();
        this.logger = new LoggingFunctions();
    }

    start() {
        this.logger.log_debug("MatrixService", "start", "MatrixService started", "");
        setInterval(this.generateMatrixFromRaw.bind(this), 5000);
    }
    
    generateMatrixFromRaw() {
        var valueArray: any = [];
        var rawValues : any = this.cachedData.tempData;
        var matrix: any;

        for (var key in rawValues) {
            valueArray.push(rawValues[key]);
        }

        matrix = this.matrixFunctions.generateV1Matrix(valueArray);

        // this.checkMatrix(matrix);
        this.cacheMatrix(matrix);
        this.saveMatrix(matrix);
    }

    clearRawData() {
        this.cachedData.tempData([]);
    }

    async saveMatrix(matrix) {
        // save to db
        if (this.config.saveMatrixToDatabase) {
            var PriceMatrixObject: any = mongoose.model('PriceMatrixObject', PriceMatrixSchema);
    
            try {
                const priceMatrix = new PriceMatrixObject({ priceMatrix: JSON.stringify(matrix), version: this.config.version, timestamp: matrix.timestamp});
                return priceMatrix.save().then(() => {
                    this.logger.log_debug("MatrixService", "saveMatrix", "Matrix saved to DB", "");
                })
            } catch (error) {
                this.logger.log_error("MatrixService", "saveMatrix", "Failed to save to matrix to DB", "");
            }
        }
    }

    cacheMatrix(matrix) {
        this.cachedData.setKeyValue("PriceMatrix", matrix)
    }

    checkMatrix(matrix) {
        var tester: TesterFunctions = new TesterFunctions();
        tester.testAgainstOtherMatrix("https://ts.threebx.com/ex/rates", matrix);
    }
}

export { MatrixService }