import { BitcoinAverageAPI } from '../api/bitcoinaverage.api';
import { GenericDownloaderService } from './genericDownloader.service';
import { Config } from "../config/config";
import { HelperFunctions } from "../helpers/helper.functions";

class BitcoinAverageService extends GenericDownloaderService {
    bitcoinaverageApi : any;
    config: any;
    helpers: any;
    cachedData: any;

    constructor(cachedData) {
        super();
        this.cachedData = cachedData;
        this.bitcoinaverageApi = new BitcoinAverageAPI();
        this.config = new Config();
        this.helpers = new HelperFunctions();
    }

    async download() {
        this.downloadValues();
        setInterval(this.downloadValues.bind(this), this.config.downloaderDelayInMilliseconds);
    }

    async downloadValues() {
        var marketValues: any = [];

        for (var i = 0; i < this.config.bitcoinaverage.supportedAssets.length; i++) {
            var ticker: string = this.config.bitcoinaverage.supportedAssets[i];
            var value: any = await this.bitcoinaverageApi.getValue(ticker, "BTC");
            marketValues.push(value);
        }

        for (var i = 0; i < this.config.bitcoinaverage.supportedCurrencies.length; i++) {
            var curr: string = this.config.bitcoinaverage.supportedCurrencies[i];
            var value: any = await this.bitcoinaverageApi.getValue("BTC", curr);
            marketValues.push(value);
        }
        this.cachedData.setTempData(this.config.bitcoinaverage.sourceShortname, marketValues);
    }

    // download_old() {
    //     Promise.resolve(this.config.bitcoinaverage.supportedAssets.map((ticker) => {
    //         return this.bitcoinaverageApi.getValue(ticker, "BTC");
    //     })).then((valuePromises) => {
    //         for (var i = 0; i < this.config.bitcoinaverage.supportedCurrencies.length; i++) {
    //             var curr: string = this.config.bitcoinaverage.supportedCurrencies[i];
    //             valuePromises.push(this.bitcoinaverageApi.getValue("BTC", curr));
    //         }
    //         Promise.all(valuePromises).then((values) => {
    //             this.cachedData.setTempData(this.config.bitcoinaverage.sourceShortname, values);
    //         }).then(() => {
    //             setInterval(this.download.bind(this), this.config.downloaderDelayInMilliseconds);
    //         })
    //     })
    // }

    // download() {
    //     setInterval(async function downloadAll() {
    //         var marketValues : any = [];
    //         marketValues.push(await this.bitcoinaverageApi.getAllAssets(this.config.bitcoinaverage.supportedAssets));
    //         if (marketValues !== []) {
    //             this.cachedData.setTempData(this.config.bitcoinaverage.sourceShortname, marketValues);
    //             console.log(marketValues);
    //         } else {
    //             console.log("ERror...");
    //         }
    //     }.bind(this), this.config.downloaderDelayInMilliseconds + this.config.bitcoinaverage.milliDelayPerRequest);
    // }
}

export { BitcoinAverageService }