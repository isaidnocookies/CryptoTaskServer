import { DownloaderAPI } from "./downloader.api";
import { Config } from "../config/config";
import { LoggingFunctions } from "../helpers/logging.functions";

// Available Ticker Symbols

class CoinGeckoAPI extends DownloaderAPI {
    constructor() {
        super(new Config());
        this.setSource(this.config.coingecko.sourceName, this.config.coingecko.sourceShortname);
    }

    getValue(asset: string, base: string) {
        const axios: any = require('axios');
        const logger: any = new LoggingFunctions();

        var url: string = "";
        var sourceShortname = this.sourceShortname;
        var key = asset + "." + base + "." + this.sourceShortname;
        var assetId = this.config.coingecko.assetIds[asset];

        if (asset === base) {
            return Promise.resolve().then(() => {
                return { [key]: 1 };
            })
        }

        url = "https://api.coingecko.com/api/v3/simple/price?ids=" + assetId + "&vs_currencies=" + base;
        try {
            return axios({
                method: 'get',
                url: url,
                responseType: 'json'
            }).then(function (response) {
                var objectKey = asset + "." + base + "." + sourceShortname;
                var firstObject: any = response.data[assetId];
                var rate : number = firstObject[base.toLowerCase()];
                return ({ [objectKey]: rate });
            }).catch(function (error) {
                if (error.response) {
                    logger.log_error("CoinGeckoAPI", "getValue", key + " from Response", error.response.data)
                } else if (error.request) {
                    logger.log_error("CoinGeckoAPI", "getValue", "Failed [No Response] : " + key, error.request)
                } else {
                    logger.log_error("CoinGeckoAPI", "getValue", "Failed [Request Error] : " + key, error.message)
                }
                return { [key]: "-1" };
            });
        } catch (error) {
            logger.log_error("CoinGeckoAPI", "getValue", "Error : " + key, error)
            return { [key]: "-1" };
        }
    }
}

export { CoinGeckoAPI };