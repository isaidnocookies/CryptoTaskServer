import { BitcoinAverageAPI } from '../api/bitcoinaverage.api';
import { GenericDownloaderService } from './genericDownloader.service';
import { ExternalConfig } from "../config/config";
import { HelperFunctions } from "../helpers/helper.functions";
import { MemoryController } from "../controllers/memory.controller";

class BitcoinAverageService extends GenericDownloaderService {
    bitcoinaverageApi: BitcoinAverageAPI;
    assetConfig: ExternalConfig;
    helpers: HelperFunctions;
    memoryController: MemoryController;

    constructor() {
        super();
        this.bitcoinaverageApi = new BitcoinAverageAPI();
        this.assetConfig = new ExternalConfig();
        this.helpers = new HelperFunctions();
        this.memoryController = new MemoryController();
    }

    async download() {
        this.downloadValues();
        setInterval(this.downloadValues.bind(this), this.assetConfig.downloaderDelayInMilliseconds);
    }

    async downloadValues() {
        var marketValues: any = [];
        
        try {
            for (var i = 0; i < this.assetConfig.bitcoinaverage.supportedAssets.length; i++) {
                var ticker: string = this.assetConfig.bitcoinaverage.supportedAssets[i];
                var value: any = await this.bitcoinaverageApi.getValue(ticker, "BTC");
                marketValues.push(value);
            }

            for (var i = 0; i < this.assetConfig.bitcoinaverage.supportedCurrencies.length; i++) {
                var curr: string = this.assetConfig.bitcoinaverage.supportedCurrencies[i];
                var value: any = await this.bitcoinaverageApi.getValue("BTC", curr);
                marketValues.push(value);
            }
            this.cacheData(marketValues);
        } catch (error) {
            this.logger.log_fatal("BitcoinAverageService", "download", "Failed to download", error);
        }
    }
    
    private cacheData(values) {
        this.memoryController.saveDataFromSource(values, this.assetConfig.bitcoinaverage.sourceShortname);
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