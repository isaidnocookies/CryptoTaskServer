import { PoloniexAPI } from '../api/poloniex.api';
import { GenericDownloaderService } from './genericDownloader.service';
import { Config } from "../config/config";
import { HelperFunctions } from "../helpers/helper.functions";
import { CachedData } from "../api/cacheddata.api"

class PoloniexService extends GenericDownloaderService {
    poloniexApi: PoloniexAPI;
    config: Config;
    helpers: HelperFunctions;
    cachedData: CachedData;

    constructor(cachedData) {
        super();
        this.cachedData = cachedData;
        this.poloniexApi = new PoloniexAPI();
        this.config = new Config();
        this.helpers = new HelperFunctions();
    }

    async download() {
        setInterval(async function downloadAll() {
            var marketValues = await this.poloniexApi.getAllAssets(this.config.poloniex.supportedAssets);
            this.cachedData.setTempData(this.config.poloniex.sourceShortname, marketValues);
        }.bind(this), this.config.downloaderDelayInMilliseconds + this.config.poloniex.milliDelayPerRequest);
    }
}

export { PoloniexService }