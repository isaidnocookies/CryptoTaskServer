import { PoloniexAPI } from '../api/poloniex.api';
import { GenericDownloaderService } from './genericDownloader.service';
import { ExternalConfig } from "../config/config";
import { HelperFunctions } from "../helpers/helper.functions";
import { MemoryController } from "../controllers/memory.controller";

class PoloniexService extends GenericDownloaderService {
    poloniexApi: PoloniexAPI;
    appConfig: ExternalConfig;
    helpers: HelperFunctions;
    memoryController: MemoryController;

    constructor() {
        super();
        this.poloniexApi = new PoloniexAPI();
        this.appConfig = new ExternalConfig();
        this.helpers = new HelperFunctions();
        this.memoryController = new MemoryController();
    }

    async download() {
        setInterval(async function downloadAll() {
            try {
                var marketValues = await this.poloniexApi.getAllAssets(this.appConfig.poloniex.supportedAssets);
                this.cacheData(marketValues);
            } catch (error) {
                this.logger.log_fatal("PoloniexService", "download", "Failed to download", error);
            }
        }.bind(this), this.appConfig.downloaderDelayInMilliseconds + this.appConfig.poloniex.milliDelayPerRequest);
    }

    private cacheData(values) {
        this.memoryController.saveDataFromSource(values, this.appConfig.poloniex.sourceShortname);
    }
}

export { PoloniexService }