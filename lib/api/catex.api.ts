import { DownloaderAPI } from "./downloader.api";
import { ExternalConfig } from "../config/config";
import { LoggingFunctions } from "../helpers/logging.functions";

// Available Ticker Symbols
// https://github.com/catex/catex_exchange_api/wiki/Acquire-specific-trading-pair-volume-and-price

class CatexAPI extends DownloaderAPI {
    constructor() {
        super(new ExternalConfig());
        this.setSource(this.config.catex.sourceName, this.config.catex.sourceShortname);
    }

    getValue(asset: string, base: string) {
        const axios: any = require('axios');
        var cryptoJS: any = require("crypto-js");
        const logger: any = new LoggingFunctions();

        var url: string = "";
        var sourceShortname = this.sourceShortname;
        var key = asset + "." + base + "." + this.sourceShortname;

        if (asset === base) {
            return Promise.resolve().then(() => {
                return { [key]: 1 };
            })
        }

        url = "https://www.catex.io/api/token?pair=" + asset + "/" + base;
        try {
            return axios({
                method: 'get',
                url: url,
                responseType: 'json'
            }).then(function (response) {
                var objectKey = asset + "." + base + "." + sourceShortname;
                var firstObject: any = response.data.data;
                var rate: number = firstObject.priceByBaseCurrency;
                return ({ [objectKey]: rate });
            }).catch(function (error) {
                if (error.response) {
                    logger.log_error("CatexAPI", "getValue", key + " from Response", error.response.data)
                } else if (error.request) {
                    logger.log_error("CatexAPI", "getValue", "Failed [No Response] : " + key, error.request)
                } else {
                    logger.log_error("CatexAPI", "getValue", "Failed [Request Error] : " + key, error.message)
                }
                return { [key]: "-1" };
            });
        } catch (error) {
            logger.log_error("CatexAPI", "getValue", "Failed [Try Failed]" + key, error)
            return { [key]: "-1" };
        }
    }
}

export { CatexAPI };