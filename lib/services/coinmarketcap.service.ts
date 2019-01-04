import { CoinMarketCapAPI } from '../api/coinmarketcap.api';
import { GenericDownloaderService } from './genericDownloader.service';
import { ExternalConfig } from "../config/config";
import { HelperFunctions } from "../helpers/helper.functions";
import { MemoryController } from "../controllers/memory.controller";

class CoinMarketCapService extends GenericDownloaderService {
    coinmarketcapApi: CoinMarketCapAPI;
    assetConfig: ExternalConfig;
    helpers: HelperFunctions;
    memoryController: MemoryController;

    constructor() {
        super();
        this.coinmarketcapApi = new CoinMarketCapAPI();
        this.assetConfig = new ExternalConfig();
        this.helpers = new HelperFunctions();
        this.memoryController = new MemoryController();
    }

    download() {
        this.downloadValues();
        setInterval(this.downloadValues.bind(this), this.assetConfig.downloaderDelayInMilliseconds);
    }

    async downloadValues() {
        var values: any = await this.coinmarketcapApi.getAllAssets(this.assetConfig.coinmarketcap.supportedAssets);
        this.cacheData(values);
    }

    private cacheData(values) {
        this.memoryController.saveDataFromSource(values, this.assetConfig.coinmarketcap.sourceShortname);
    }
}

export { CoinMarketCapService }




// async download_old() {
//     setInterval( async function downloadAll() {
//         var marketValues = await this.coinmarketcapApi.getAllAssets(this.config.coinmarketcap.supportedAssets);
//         this.cachedData.setTempData(this.config.coinmarketcap.sourceShortname, marketValues);
//         console.log(marketValues);
//     }.bind(this), this.config.downloaderDelayInMilliseconds + this.config.coinmarketcap.milliDelayPerRequest);
// }


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