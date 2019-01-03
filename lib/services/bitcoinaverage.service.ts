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

    download() {
        Promise.resolve(this.config.bitcoinaverage.supportedAssets.map((ticker) => {
            return this.bitcoinaverageApi.getValue(ticker, "BTC");
        })).then((valuePromises) => {
            for (var i = 0; i < this.config.bitcoinaverage.supportedCurrencies.length; i++) {
                var curr: string = this.config.bitcoinaverage.supportedCurrencies[i];
                valuePromises.push(this.bitcoinaverageApi.getValue("BTC", curr));
            }
            Promise.all(valuePromises).then((values) => {
                this.cachedData.setTempData(this.config.bitcoinaverage.sourceShortname,values);
            }).then(() => {
                setInterval(this.download.bind(this), this.config.downloaderDelayInMilliseconds);
            })
        })
    }
}

export { BitcoinAverageService }











// download() {
    //     var valuepromises : any = this.config.bitcoinaverage.supportedAssets.map((ticker) => {
    //         return this.bitcoinaverageApi.getValue(ticker, "BTC");
    //     });

    //     for (var i = 0; i < this.config.bitcoinaverage.supportedCurrencies.length; i++) {
    //         var curr: string = this.config.bitcoinaverage.supportedCurrencies[i];
    //         valuepromises.push(this.bitcoinaverageApi.getValue("BTC", curr));
    //     }

    //     return Promise.all(valuepromises);
    // }

// download using map with no delay rather than the sleeping version...
// download() {
//     var valuepromises : any = this.config.bitcoinaverage.supportedAssets.map((ticker) => {
//         return this.bitcoinaverageApi.getValue(ticker, "BTC");
//     });
//     return Promise.all(valuepromises);
// }

// download using delay in order to avoid rate limiting in external apis
// async download() {
//     var valuePromises: any = [];
//     var rateLimitInMilli: number = (this.config.bitcoinaverage.milliRelayPerRequest / 60) * 1000;

//     for (var i = 0; i < this.config.bitcoinaverage.supportedAssets.length; i++) {
//         var ticker: string = this.config.bitcoinaverage.supportedAssets[i];
//         valuePromises.push(await this.bitcoinaverageApi.getValue(ticker, "BTC"));
//         if (rateLimitInMilli > 0) {
//             this.helpers.sleep(rateLimitInMilli);
//         }
//     }

//     return valuePromises;
// }