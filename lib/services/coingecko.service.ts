import { CoinGeckoAPI } from '../api/coingecko.api';
import { GenericDownloaderService } from './genericDownloader.service';
import { Config } from "../config/config";
import { HelperFunctions } from "../helpers/helper.functions";
import { CachedData } from "../api/cacheddata.api"

class CoinGeckoService extends GenericDownloaderService {
    coingeckoApi: CoinGeckoAPI;
    config: Config;
    helpers: HelperFunctions;
    cachedData: CachedData;

    constructor(cachedData) {
        super();
        this.cachedData = cachedData;
        this.coingeckoApi = new CoinGeckoAPI();
        this.config = new Config();
        this.helpers = new HelperFunctions();
    }

    async download() {
        this.downloadValues();
        setInterval(this.downloadValues.bind(this), this.config.downloaderDelayInMilliseconds);
    }

    async downloadValues() {
        var marketValues: any = [];

        for (var i = 0; i < this.config.coingecko.supportedAssets.length; i++) {
            var ticker: string = this.config.coingecko.supportedAssets[i];
            var value: any = await this.coingeckoApi.getValue(ticker, "BTC");
            marketValues.push(value);
        }

        for (var i = 0; i < this.config.coingecko.supportedCurrencies.length; i++) {
            var curr: string = this.config.coingecko.supportedCurrencies[i];
            var value: any = await this.coingeckoApi.getValue("BTC", curr);
            marketValues.push(value);
        }
        this.cachedData.setTempData(this.config.coingecko.sourceShortname, marketValues);
    }
    
}

export { CoinGeckoService }






// async download_old() {
//     Promise.resolve(this.config.coingecko.supportedAssets.map((ticker) => {
//         return this.coingeckoApi.getValue(ticker, "BTC");
//     })).then(async (valuePromises) => {
//         for (var i = 0; i < this.config.coingecko.supportedCurrencies.length; i++) {
//             var curr: string = this.config.coingecko.supportedCurrencies[i];
//             valuePromises.push(this.coingeckoApi.getValue("BTC", curr));
//         }

//         var values : any = [];
//         for (var i = 0; i < valuePromises.length; i++) {
//             values.push(await Promise.resolve(valuePromises[i]))
//             this.helpers.sleep(this.config.coingecko.milliDelayPerRequest)
//         }
//         this.cachedData.setTempData(this.config.coingecko.sourceShortname, values);
//         setInterval(this.download.bind(this), this.config.downloaderDelayInMilliseconds);
//     })
// }


// Promise.resolve(this.config.coingecko.supportedAssets.map((ticker) => {
        //     return this.coingeckoApi.getValue(ticker, "BTC");
        // })).then(async (valuePromises) => {
        //     for (var i = 0; i < this.config.coingecko.supportedCurrencies.length; i++) {
        //         var curr: string = this.config.coingecko.supportedCurrencies[i];
        //         valuePromises.push(await this.coingeckoApi.getValue("BTC", curr));
        //         this.helpers.sleep(this.config.coingecko.milliDelayPerRequest*60*1000)
        //     }
        //     Promise.all(valuePromises).then((values) => {
        //         this.cachedData.setTempData(this.config.coingecko.sourceShortname, values);
        //     }).then(() => {
        //         setInterval(this.download.bind(this), this.config.downloaderDelayInMilliseconds);
        //     })
        // })




    // download using delay in order to avoid rate limiting in external apis
    // async download2() {
    //     var valuePromises: any = [];
    //     var rateLimitInMilli: number = (this.config.coingecko.milliDelayPerRequest / 60) * 1000;

    //     for (var i = 0; i < this.config.coingecko.supportedAssets.length; i++) {
    //         var ticker: string = this.config.coingecko.supportedAssets[i];
    //         valuePromises.push(await this.coingeckoApi.getValue(ticker, "BTC"));
    //         if (rateLimitInMilli > 0) {
    //             this.helpers.sleep(rateLimitInMilli);
    //         }
    //     }

    //     return valuePromises;
    // }