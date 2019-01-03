import { CoinMarketCapAPI } from '../api/coinmarketcap.api';
import { GenericDownloaderService } from './genericDownloader.service';
import { Config } from "../config/config";
import { HelperFunctions } from "../helpers/helper.functions";
import { CachedData } from "../api/cacheddata.api"

class CoinMarketCapService extends GenericDownloaderService {
    coinmarketcapApi: CoinMarketCapAPI;
    config: Config;
    helpers: HelperFunctions;
    cachedData: CachedData;

    constructor(cachedData) {
        super();
        this.cachedData = cachedData;
        this.coinmarketcapApi = new CoinMarketCapAPI();
        this.config = new Config();
        this.helpers = new HelperFunctions();
    }

    async download() {
        setInterval( async function downloadAll() {
            var marketValues = await this.coinmarketcapApi.getAllAssets(this.config.coinmarketcap.supportedAssets);
            this.cachedData.setTempData(this.config.coinmarketcap.sourceShortname, marketValues);
            console.log(marketValues);
        }.bind(this), this.config.downloaderDelayInMilliseconds + this.config.coinmarketcap.milliDelayPerRequest);
    }
}

export { CoinMarketCapService }






// Promise.resolve(this.config.coinmarketcap.supportedAssets.map((ticker) => {
        //     return this.coinmarketcapApi.getValue(ticker, "BTC");
        // })).then(async (valuePromises) => {
        //     for (var i = 0; i < this.config.coinmarketcap.supportedCurrencies.length; i++) {
        //         var curr: string = this.config.coinmarketcap.supportedCurrencies[i];
        //         valuePromises.push(this.coinmarketcapApi.getValue("BTC", curr));
        //     }
        //     var values: any = [];
        //     for (var i = 0; i < valuePromises.length; i++) {
        //         values.push(await Promise.resolve(valuePromises[i]))
        //         this.helpers.sleep(this.config.coinmarketcap.milliDelayPerRequest)
        //     }
        //     this.cachedData.setTempData(this.config.coinmarketcap.sourceShortname, values);
        //     setInterval(this.download.bind(this), this.config.downloaderDelayInMilliseconds);
        // })