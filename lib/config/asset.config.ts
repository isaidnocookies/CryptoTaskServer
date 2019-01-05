export class ExternalConfig
{
    downloaderDelayInMilliseconds: number = 10000;
    
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
        TKS: "TKS",
        XLM: "XLM",
        XMR: "XMR",
        XRP: "XRP",
        ZEC: "ZEC",
        ZEN: "ZEN",
        ZRX: "ZRX",
        WAVES: "WAVES"
    };

    currencies : any = {
        USD: "USD",
        MXN: "MXN"
    }

    fixedTokens : any = {
        THDL: {symbol: "THDL", price: 0.01, base: this.currencies.USD}
    }

    // Available Ticker Symbols
    // https://apiv2.bitcoinaverage.com/symbols/indices/ticker
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
            this.assets.WAVES,
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
        tokens : [
            this.currencies.ZRX
        ],
        milliDelayPerRequest : 0,
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
            this.assets.TKS,
            this.assets.WAVES,
            this.assets.ZEN
        ],
        supportedCurrencies: [
            this.currencies.USD,
            this.currencies.MXN
        ],
        assetIds: {
            BTC: "bitcoin",
            NIKO: "niko",
            RMT: "sureremit",
            SHEL: "shelterdao",
            ZEN: "zencash",
            WAVES: "waves",
            TKS: "tokes"
        },
        milliDelayPerRequest: 250
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
        milliDelayPerRequest: 2000,
        apiKey: "e672675d-3393-4160-832f-6135253a5451"
    };

    // Available Ticker Symbols
    // https://github.com/catex/catex_exchange_api/wiki/Acquire-specific-trading-pair-volume-and-price
    catex: any = {
        sourceShortname: "CATEX",
        sourceName: "Catex",
        supportedAssets: [
            this.assets.SHEL,
            this.assets.BTC
        ],
        supportedCurrencies: [
        ],
        milliDelayPerRequest: 1000
    }

    //https://poloniex.com/public?command=returnTicker
    poloniex: any = {
        sourceShortname: "POL",
        sourceName: "Poloniex",
        supportedAssets: [
            this.assets.DASH,
            this.assets.DGB,
            this.assets.DOGE,
            this.assets.LTC,
            this.assets.XMR,
            this.assets.XRP,
            this.assets.ETH,
            this.assets.ZEC,
            this.assets.BCH,
            this.assets.ZRX
        ],
        supportedCurrencies: [
        ],
        milliDelayPerRequest: 5000
    }
}