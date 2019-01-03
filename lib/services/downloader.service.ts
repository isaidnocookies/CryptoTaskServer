import { Config } from "../config/config";
import { CachedData } from "../api/cacheddata.api"

import { BitcoinAverageService } from './bitcoinaverage.service';
import { CoinGeckoService } from "./coingecko.service";
import { CatexService } from "./catex.service";
import { MatrixService } from "./matrix.service";

class DownloaderService {
    cachedData : CachedData;

    bitcoinaverageService: BitcoinAverageService;
    catexService: CatexService;
    coingeckoService: CoinGeckoService;
    matrixService: MatrixService;

    config: any = new Config();

    downloaderServices : any = [];

    constructor(cachedData) {
        this.cachedData = cachedData;
        this.bitcoinaverageService = new BitcoinAverageService(this.cachedData);
        this.catexService = new CatexService(this.cachedData);
        this.coingeckoService = new CoinGeckoService(this.cachedData);
        this.matrixService = new MatrixService(this.cachedData);
    }

    startDownload() {
        this.downloadMarketValues();
        this.matrixService.start();
    }

    downloadMarketValues() {
        this.bitcoinaverageService.download();
        this.catexService.download();
        this.coingeckoService.download();
    }
}

export { DownloaderService }







// var marketValuePromises : any = this.downloaderServices.map((apis) => {
        //     return apis.download();
        // });

        // Promise.all(marketValuePromises).then((values)=> {
        //     var matrix : MatrixFunctions = new MatrixFunctions();
        //     var valueMatrix : any = matrix.generateV1Matrix(values);

        //     cachedData.setKeyValue("PriceMatrix", valueMatrix);
        //     console.log("Matrix Saved...");

        //     // console.log(valueMatrix);
        //     // var tester: TesterFunctions = new TesterFunctions();
        //     // tester.testAgainstOtherMatrix("https://ts.threebx.com/ex/rates", valueMatrix);

        //     // setInterval(this.downloadMarketValues.bind(this), 10000);
        // });