import { BitcoinAverageService } from './bitcoinaverage.service';
import { CoinGeckoService } from "./coingecko.service";
import { CatexService } from "./catex.service";
import { CoinMarketCapService } from "./coinmarketcap.service";
import { PoloniexService } from "./poloniex.service";

import { MatrixService } from "./matrix.service";

class DownloaderService {

    bitcoinaverageService: BitcoinAverageService;
    catexService: CatexService;
    coingeckoService: CoinGeckoService;
    coinmarketcapService: CoinMarketCapService;
    poloniexService: PoloniexService;

    matrixService: MatrixService;

    downloaderServices : any = [];

    constructor() {
        this.bitcoinaverageService = new BitcoinAverageService();
        this.catexService = new CatexService();
        this.coingeckoService = new CoinGeckoService();
        this.coinmarketcapService = new CoinMarketCapService();
        this.poloniexService = new PoloniexService();

        this.matrixService = new MatrixService();
    }

    startDownload() {
        this.downloadMarketValues();
        this.matrixService.start();
    }

    downloadMarketValues() {
        this.bitcoinaverageService.download();
        this.poloniexService.download();
        this.catexService.download();
        this.coingeckoService.download(); // needs work

        // add coinmarketcap when api key is paid for to fit our needs
        // this.coinmarketcapService.download();
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