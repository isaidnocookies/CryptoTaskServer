export class Config
{
    version : string = "0.0.1"
    localEnvironment : boolean = true;
    port : number = 3333;

    db: any = {
        production: {
            url : ""
        },
        test: {
            url: "mongodb://localhost/TaskServer"
        }
    };

    saveMatrixToDatabase : boolean = false;

    downloaderDelayInMilliseconds: number = 3000;

    assets : any = {
        BCH: "BCH",
        BTC: "BTC",
        DASH: "DASH",
        DGB: "DGB",
        DOGE: "DOGE",
        ETH: "ETH",
        LTC: "LTC",
        NIKO: "NIKO",
        RMT: "RMT",
        SHEL: "SHEL",
        XLM: "XLM",
        XMR: "XMR",
        XRP: "XRP",
        ZEC: "ZEC",
        ZEN: "ZEN",
        ZRX: "ZRX"
    };

    currencies : any = {
        USD: "USD",
        MXN: "MXN"
    }

    fixedTokens : any = {
        THDL: {symbol: "THDL", price: 0.01, base: this.currencies.USD}
    }

    bitcoinaverage : any = {
        sourceShortname : "BTCAVG",
        sourceName: "BitcoinAverage",
        supportedAssets : [
            this.assets.BCH,
            this.assets.BTC,
            this.assets.DASH,
            this.assets.DGB,
            this.assets.DOGE,
            this.assets.ETH,
            this.assets.LTC,
            this.assets.XLM,
            this.assets.XMR,
            this.assets.XRP,
            this.assets.ZEC,
            this.assets.ZRX
        ],
        supportedCurrencies : [
            this.currencies.USD,
            this.currencies.MXN
        ],
        milliRelayPerRequest : 0,
        apiPublicKey: "YzRmMDY0YzZjOWM1NGM3YjhhM2RjNmVkMmU1OTc5ZjE",
        apiSecretKey: "OGQwYTExOTI2YzY1NDY5NmEwMjUyNTI4YzgxNjUyNDQ5ZWRlOWE2NGFjM2Y0OTY3YTgzYTkxZmI0YWRjMzRjZA"
    };

    // https://api.coingecko.com/api/v3/coins/list
    coingecko: any = {
        sourceShortname: "CG",
        sourceName: "CoinGecko",
        supportedAssets: [
            this.assets.BTC,
            this.assets.NIKO,
            this.assets.RMT,
            // this.assets.SHEL,
            this.assets.ZEN
        ],
        supportedCurrencies: [
            this.currencies.USD,
            this.currencies.MXN
        ],
        milliRelayPerRequest: 250,
        assetIds: {
            BTC: "bitcoin",
            NIKO: "niko",
            RMT: "sureremit",
            SHEL: "shelterdao",
            ZEN: "zencash"
        }
    };

    coinmarketcap: any = {
        sourceShortname: "CMC",
        sourceName: "CoinMarketCap",
        supportedAssets: [
            this.assets.BTC,
            this.assets.DOGE,
            this.assets.RMT,
            this.assets.ZEN,
            this.assets.LTC,
            this.assets.XLM,
            this.assets.XMR,
            this.assets.ETH
        ],
        // supportedCurrencies: [
        //     this.currencies.USD,
        //     this.currencies.MXN
        // ],
        milliRelayPerRequest: 2000,
        apiKey: "e672675d-3393-4160-832f-6135253a5451"
    };

    catex: any = {
        sourceShortname: "CATEX",
        sourceName: "Catex",
        supportedAssets: [
            this.assets.SHEL,
            this.assets.BTC
        ],
        supportedCurrencies: [
        ],
        milliRelayPerRequest: 1000
    }

}