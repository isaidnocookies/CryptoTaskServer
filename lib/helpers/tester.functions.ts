import { LoggingFunctions } from "./logging.functions";

export class TesterFunctions {

    coinsToIgnore : any = {WASTE : "WASTE", CARAT : "CARAT"};
    differenceTolerance : number = 0.05;

    async testAgainstOtherMatrix(url : string, newPriceMatrix : any) {
        var downloadedMatrix : any = await this.downloadMatrix(url);
        this.compareMatrices(downloadedMatrix, newPriceMatrix);
    }
    
    downloadMatrix(url : string) : any {
        var logger: LoggingFunctions = new LoggingFunctions();
        const axios: any = require('axios');
        try {
            return axios({
                method: 'get',
                url: url,
                responseType: 'json'
            }).then(function (response) {
                return response.data;
            }).catch(function (error) {
                if (error.response) {
                    logger.log_error("TesterFunctions", "downloadMatrix", "Response Failed", error.response.data + "\n" + error.response.status);
                } else if (error.request) {
                    logger.log_error("TesterFunctions", "downloadMatrix", "No Error Response", error.request);
                } else {
                    logger.log_error("TesterFunctions", "downloadMatrix", "Error..", error.message);
                }
                return {};
            });
        } catch (error) {
            return {};
        }
    }

    compareMatrices(baseMatrix : any, otherMatrix : any) {
        var logger: LoggingFunctions = new LoggingFunctions();
        var failingTest : boolean = false;
        var missingRootKeys : any = {};
        var missingSubKey : any = {};

        for (var key in baseMatrix) {
            if (key === "timestamp") {
                var baseTime: number = baseMatrix["timestamp"];
                var otherTime: number = otherMatrix["timestamp"];
                var range: any = { min: baseTime - (baseTime * this.differenceTolerance), max: baseTime + (baseTime * this.differenceTolerance) };

                if (otherTime < range.min || otherTime > range.max) {
                    logger.log_fatal("TesterFunctions", "compareMatrices", "Timestamps are too far apart", (baseTime + " != " + otherTime))
                    failingTest = true;
                }
                continue;   
            }
            for (var nextKey in baseMatrix[key]) {
                if (key in otherMatrix) {
                    if (nextKey in otherMatrix[key]) {
                        var baseRate: number = parseFloat(baseMatrix[key][nextKey].rate);
                        var otherRate: number = parseFloat(otherMatrix[key][nextKey].rate);
                        var range: any = { min: baseRate - (baseRate * this.differenceTolerance), max: baseRate + (baseRate * this.differenceTolerance)};

                        if (otherRate < range.min || otherRate > range.max) {
                            logger.log_fatal("TesterFunctions", "compareMatrices", "Values are incorrect", (key + " to " + nextKey + "  --  " + baseRate + " != " + otherRate))
                            failingTest = true;
                        }
                    } else {
                        if (!(nextKey in this.coinsToIgnore)) {
                            if ((!(nextKey in missingSubKey)) && (nextKey in missingRootKeys)) {
                                failingTest = true;
                                logger.log_fatal("TesterFunctions", "compareMatrices", "Missing Sub-Value", nextKey)
                            }
                        }
                        missingSubKey[nextKey] = -1;
                    }
                } else {
                    if (!(key in this.coinsToIgnore)) {
                        if (!(key in missingRootKeys)) {
                            failingTest = true;
                            logger.log_fatal("TesterFunctions", "compareMatrices", "Missing Root-Value", key)
                        }
                    }
                    missingRootKeys[key] = -1;
                    missingSubKey[key] = -1;
                }
            }
        }

        if (failingTest) {
            logger.log_fatal("TesterFunctions", "compareMatrices", "Test Failed", "Something is wrong...")
        } else {
            logger.log_debug("TesterFunctions", "compareMatrices", "Test PASSED", "Nothing is wrong!")
        }
    }

    compareMatrixUrlResponses(matrixOneUrl : string, matrixTwoUrl : string) {

    }

}