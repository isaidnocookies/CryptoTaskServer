import { CatexAPI } from '../api/catex.api';
import { GenericDownloaderService } from './genericDownloader.service';
import { Config } from "../config/config";
import { HelperFunctions } from "../helpers/helper.functions";

class CatexService extends GenericDownloaderService {
    catexApi: any;
    config: any;
    helpers: any;
    cachedData: any;

    constructor(cachedData) {
        super();
        this.cachedData = cachedData;
        this.catexApi = new CatexAPI();
        this.config = new Config();
        this.helpers = new HelperFunctions();
    }

    async download() {
        Promise.resolve(this.config.catex.supportedAssets.map((ticker) => {
            return this.catexApi.getValue(ticker, "BTC");
        })).then(async (valuePromises) => {
            for (var i = 0; i < this.config.catex.supportedCurrencies.length; i++) {
                var curr: string = this.config.catex.supportedCurrencies[i];
                valuePromises.push(this.catexApi.getValue("BTC", curr));
            }

            var values: any = [];
            for (var i = 0; i < valuePromises.length; i++) {
                values.push(await Promise.resolve(valuePromises[i]))
                this.helpers.sleep(this.config.catex.milliRelayPerRequest)
            }

            this.cachedData.setTempData(this.config.catex.sourceShortname, values);
            setInterval(this.download.bind(this), this.config.downloaderDelayInMilliseconds);
        })
    }
}

export { CatexService }








    // async download2() {
    //     Promise.resolve(this.config.catex.supportedAssets.map((ticker) => {
    //         return this.catexApi.getValue(ticker, "BTC");
    //     })).then(async (valuePromises) => {
    //         for (var i = 0; i < this.config.catex.supportedCurrencies.length; i++) {
    //             var curr: string = this.config.catex.supportedCurrencies[i];
    //             valuePromises.push(await this.catexApi.getValue("BTC", curr));
    //             this.helpers.sleep(this.config.coingecko.milliRelayPerRequest * 60 * 1000)
    //         }
    //         Promise.all(valuePromises).then((values) => {
    //             this.cachedData.setTempData(this.config.catex.sourceShortname, values);
    //             console.log("Raw Data Saved");
    //         }).then(() => {
    //             setInterval(this.download.bind(this), this.config.downloaderDelayInMilliseconds);
    //         })
    //     })
    // }

    // download using delay in order to avoid rate limiting in external apis
    // async download() {
    //     var valuePromises: any = [];
    //     var rateLimitInMilli: number = (this.config.catex.milliRelayPerRequest / 60) * 1000;

    //     for (var i = 0; i < this.config.catex.supportedAssets.length; i++) {
    //         var ticker: string = this.config.catex.supportedAssets[i];
    //         valuePromises.push(await this.catexApi.getValue(ticker, "BTC"));
    //         if (rateLimitInMilli > 0) {
    //             this.helpers.sleep(rateLimitInMilli);
    //         }
    //     }

    //     return valuePromises;
    // }