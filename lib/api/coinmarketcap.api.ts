import { DownloaderAPI } from "./downloader.api";
import { LoggingFunctions } from "../helpers/logging.functions";

// Available Ticker Symbols

class CoinMarketCapAPI extends DownloaderAPI {
    constructor() {
        super();
        this.setSource(this.config.coinmarketcap.sourceName, this.config.coinmarketcap.sourceShortname);
    }

    // Get Asset to BTC values
    getAllAssets(assets) {
        const axios: any = require('axios');
        const logger: any = new LoggingFunctions();

        var url: string = "";
        var sourceShortname = this.sourceShortname;

        var assetList : string = "";
        for (var i = 0; i < assets.length; i++) {
            var tick: string = assets[i];
            if (tick !== "BTC") {
                assetList = assetList + tick + ",";
            }
        }
        if (assetList.charAt(assetList.length - 1) === ",") {
            assetList = assetList.substring(0, assetList.length - 1);
        }

        url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=" + assetList + "&convert=BTC";
        try {
            return axios({
                method: 'get',
                url: url,
                responseType: 'json',
                headers: { 'X-CMC_PRO_API_KEY': this.config.coinmarketcap.apiKey },
            }).then(function (response) {
                var marketValues : any = [];
                var responseData : any = response.data.data;
                
                for (var key in responseData) {
                    var quote : any = responseData[key].quote;
                    var price : any = quote["BTC"].price;
                    var objectKey = key + ".BTC." + sourceShortname;
                    marketValues.push(({ [objectKey]: price }));
                }
                return marketValues;
            }).catch(function (error) {
                if (error.response) {
                    logger.log_error("CoinMarketCapAPI", "getAllAssets", "from Response", error.response.data)
                } else if (error.request) {
                    logger.log_error("CoinMarketCapAPI", "getAllAssets", "Failed [No Response]", error.request)
                } else {
                    logger.log_error("CoinMarketCapAPI", "getAllAssets", "Failed [Request Error]", error.message)
                }
                return [];
            });
        } catch (error) {
            logger.log_error("CoinMarketCapAPI", "getAllAssets", "Try Error", error.error)
            return [];
        }
    }

    getValue(asset: string, base: string) {
        const axios: any = require('axios');
        const logger: any = new LoggingFunctions();

        var url: string = "";
        var sourceShortname = this.sourceShortname;
        var key = asset + "." + base + "." + this.sourceShortname;

        if (asset === base) {
            return Promise.resolve().then(() => {
                return { [key]: 1 };
            })
        }

        logger.log_error("CoinMarketCapAPI", "getValue", "Not Implemented", "Not implemented for rate limiting reasons")
        return { [key]: "-1" };

        // url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest/;
        // try {
        //     return axios({
        //         method: 'get',
        //         url: url,
        //         responseType: 'json'
        //     }).then(function (response) {
        //         var objectKey = asset + "." + base + "." + sourceShortname;
        //         var firstObject: any = response.data["NOT COMPLETE!"];
        //         var rate: number = firstObject[base.toLowerCase()];
        //         return ({ [objectKey]: rate });
        //     }).catch(function (error) {
        //         if (error.response) {
        //             logger.log_error("CoinMarketCapAPI", "getValue", key + " from Response", error.response.data)
        //         } else if (error.request) {
        //             logger.log_error("CoinMarketCapAPI", "getValue", "Failed [No Response] : " + key, error.request)
        //         } else {
        //             logger.log_error("CoinMarketCapAPI", "getValue", "Failed [Request Error] : " + key, error.message)
        //         }
        //         return { [key]: "-1" };
        //     });
        // } catch (error) {
        //     logger.log_error("CoinMarketCapAPI", "getValue", "Try Error : " + key, error.error)
        //     return { [key]: "-1" };
        // }
    }
}

export { CoinMarketCapAPI };