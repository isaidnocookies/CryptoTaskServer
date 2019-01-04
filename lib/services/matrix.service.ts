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
        setInterval(this.generateMatrixFromRaw.bind(this), 5000);
    }
    
    async generateMatrixFromRaw() {
        var valueArray: any = [];
        var rawValues: any = await this.matrixController.getCachedPriceDataFromMemory()
        var matrix: any;

        for (var key in rawValues) {
            valueArray.push(rawValues[key]);
        }

        matrix = this.matrixFunctions.generateV1Matrix(valueArray);

        // this.checkMatrix(matrix);
        this.matrixController.cacheMatrixData(matrix)
        this.matrixController.saveMatrixData(matrix);
    }

    checkMatrix(matrix) {
        var tester: TesterFunctions = new TesterFunctions();
        tester.testAgainstOtherMatrix("https://ts.threebx.com/ex/rates", matrix);
    }
}

export { MatrixService }