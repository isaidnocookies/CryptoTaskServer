import { DownloaderAPI } from "./downloader.api";
import { LoggingFunctions } from "../helpers/logging.functions";

class PoloniexAPI extends DownloaderAPI {
    constructor() {
        super();
        this.setSource(this.config.poloniex.sourceName, this.config.poloniex.sourceShortname);
    }

    getValue(asset: string, base: string) {
        const logger: any = new LoggingFunctions();
        logger.log_fatal("PoloniexAPI", "getValue", "Not Implemented", "Function is not implemented. Use getAllAssets(assets)");
    }

    getAllAssets(assets) {
        const axios: any = require('axios');
        const logger: any = new LoggingFunctions();

        var url: string = "";
        var sourceShortname = this.sourceShortname;

        url = "https://poloniex.com/public?command=returnTicker";
        try {
            return axios({
                method: 'get',
                url: url,
                responseType: 'json'
            }).then(function (response) {
                var returnTicker : any = response.data;
                var values : any = [];

                for (var i = 0; i < assets.length; i++) {
                    if (assets[i] !== "BTC") {
                        var correctedAsset : string;
                        if (assets[i] === "BCH") {
                            correctedAsset = "BCHABC";
                        } else {
                            correctedAsset = assets[i];
                        }
                        
                        var tickerKey: string = "BTC_" + correctedAsset;
                        var objectKey = assets[i] + ".BTC." + sourceShortname;
                        var quote: any = returnTicker[tickerKey];
                        var price: number = parseFloat(quote.last);
                        values.push({[objectKey]: price});
                    }
                }
                return values;
            }).catch(function (error) {
                if (error.response) {
                    logger.log_error("PoloniexAPI", "getAllAssets", "From Response", error.response.data)
                } else if (error.request) {
                    logger.log_error("PoloniexAPI", "getAllAssets", "Failed [No Response]", error.request)
                } else {
                    logger.log_error("PoloniexAPI", "getAllAssets", "Failed [Request Error]", error.message)
                }
                return [];
            });
        } catch (error) {
            logger.log_error("PoloniexAPI", "getAllAssets", "Error", error)
            return [];
        }
    }
}

export { PoloniexAPI };