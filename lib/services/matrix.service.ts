import { Config } from "../config/config";
import { MatrixFunctions } from "../helpers/matrix.functions";
import { TesterFunctions } from "../helpers/tester.functions";
import { LoggingFunctions } from "../helpers/logging.functions";
import { MatrixController } from '../controllers/matrix.controller';

class MatrixService {
    config: Config;
    matrixFunctions: MatrixFunctions;
    logger: LoggingFunctions;
    matrixController : MatrixController;

    constructor() {
        this.config = new Config();
        this.matrixFunctions = new MatrixFunctions();
        this.logger = new LoggingFunctions();
        this.matrixController = new MatrixController();
    }

    start() {
        this.logger.log_debug("MatrixService", "start", "MatrixService started", "");
        setInterval(this.generateMatrixFromRaw.bind(this), 10000);
    }
    
    async generateMatrixFromRaw() {
        var valueArray: any = [];
        var rawValues: any = await this.matrixController.getCachedPriceDataFromMemory()

        for (var key in rawValues) {
            valueArray.push(rawValues[key]);
        }

        var flattenedValues: any = [].concat.apply([], valueArray);
        var valueMap: any = this.matrixFunctions.generateValueMap(flattenedValues);
        var coins : any = Object.keys(valueMap);
        var matrix : any = this.matrixFunctions.generateV1Matrix(valueArray);
        var timestamp : string = matrix.timestamp;

        // potentiall add error checking and notifications for state of price matrix

        this.matrixController.cacheMatrixData(matrix);
        this.matrixController.saveMatrixData(valueMap, coins, timestamp);
    }
}

export { MatrixService }