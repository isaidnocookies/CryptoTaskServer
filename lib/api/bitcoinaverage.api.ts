import { DownloaderAPI } from "./downloader.api";
import { ExternalConfig } from "../config/config";
import { LoggingFunctions } from "../helpers/logging.functions";

// Available Ticker Symbols
// https://apiv2.bitcoinaverage.com/symbols/indices/ticker

class BitcoinAverageAPI extends DownloaderAPI {
    constructor() {
        super(new ExternalConfig);
        this.setSource(this.config.bitcoinaverage.sourceName, this.config.bitcoinaverage.sourceShortname);
    }

    async getAllAssets(assets) {
        // return this.getAllCryptoAssets(assets);
        // TODO
    }

    getValue(asset: string, base: string) {
        const axios : any = require('axios');
        var cryptoJS : any = require("crypto-js");
        const logger: any = new LoggingFunctions();

        var url : string = "";
        var sourceShortname = this.sourceShortname;
        var key = asset + "." + base + "." + this.sourceShortname;

        if (asset === base) {
            return Promise.resolve().then(() => {
                return {[key] : 1};
            })
        }

        if (base === "USD") {
            url = "https://apiv2.bitcoinaverage.com/indices/global/ticker/short?base=" + asset + "&target=" + base;
        } else if (asset === "ZRX") {
            url = "https://apiv2.bitcoinaverage.com/indices/tokens/ticker/short?base=" + asset + "&target=" + base;
        } else if (base === "MXN") {
            url = "https://apiv2.bitcoinaverage.com/indices/local/ticker/short?base=" + asset + "&target=" + base;
        }else {
            url = "https://apiv2.bitcoinaverage.com/indices/crypto/ticker/short?base=" + asset + "&target=" + base;
        }

        var public_key = this.config.bitcoinaverage.apiPublicKey;
        var secret_key = this.config.bitcoinaverage.apiSecretKey;
        var timestamp = Math.floor(Date.now() / 1000);
        var payload = timestamp + '.' + public_key;
        var hash = cryptoJS.HmacSHA256(payload, secret_key);
        var hex_hash = cryptoJS.enc.Hex.stringify(hash);
        var signature = payload + "." + hex_hash;

        try {
            return axios({
                method:'get', 
                url: url,
                responseType:'json',
                headers: { 'X-Signature': signature },
            }).then(function(response){
                var returnKey = asset + base;
                var objectKey = asset + "." + base + "." + sourceShortname;
                return ({ [objectKey] : response.data[returnKey].last});
            }).catch(function (error) {
                if (error.response) {
                    logger.log_error("BitcoinAverageAPI", "getValue", key + " from Response", error.response.data)
                } else if (error.request) {
                    logger.log_error("BitcoinAverageAPI", "getValue", "Failed [No Response] : " + key, error.request)
                } else {
                    logger.log_error("BitcoinAverageAPI", "getValue", "Failed [Request Error] : " + key, error.message)
                }
                return { [key]: "-1" };
            });
        } catch(error) {
            logger.log_error("BitcoinAverageAPI", "getValue", "Failed [Try Failed] : " + key, error)
            return { [key]: "-1" };
        }
    }

    getAllTokenAssets(assets) {
        const axios: any = require('axios');
        const logger: any = new LoggingFunctions();
        var cryptoJS: any = require("crypto-js");
        var url: string = "";
        var assetString: string = "";

        var sourceShortname = this.sourceShortname;

        // TEmporary until better developed... TODO
        assetString = "ZRX";

        if (assetString.charAt(assetString.length - 1) === ",") {
            assetString = assetString.substring(0, assetString.length - 1);
        }

        url = "https://apiv2.bitcoinaverage.com/indices/tokens/ticker/short?base=" + assetString + "&target=BTC"

        var public_key = this.config.bitcoinaverage.apiPublicKey;
        var secret_key = this.config.bitcoinaverage.apiSecretKey;
        var timestamp = Math.floor(Date.now() / 1000);
        var payload = timestamp + '.' + public_key;
        var hash = cryptoJS.HmacSHA256(payload, secret_key);
        var hex_hash = cryptoJS.enc.Hex.stringify(hash);
        var signature = payload + "." + hex_hash;

        try {
            return axios({
                method: 'get',
                url: url,
                responseType: 'json',
                headers: { 'X-Signature': signature },
            }).then(function (response) {
                var values: any = [];
                var data: string = response.data;
                for (var i = 0; i < assets.length; i++) {
                    // TEMPORARY UNTIL BETTER DEVELOPED _ TODO
                    if (assets[i] !== "ZRX") {
                        continue;
                    }
                    try {
                        var valueKey: string = assets[i] + "BTC";
                        var quote: any = data[valueKey];
                        var objectKey: any = assets[i] + ".BTC." + sourceShortname;
                        var price: number = quote.last;
                        values.push({ [objectKey]: price });
                    } catch (error) {
                        logger.log_error("BitcoinAverageAPI", "getAllAssets", "While parsing response : " + assets[i], error)
                    }
                }
                return values;
            }).catch(function (error) {
                if (error.response) {
                    logger.log_error("BitcoinAverageAPI", "getAllAssets", "From Response", error.response)
                } else if (error.request) {
                    logger.log_error("BitcoinAverageAPI", "getAllAssets", "Failed [No Response]", error.request)
                } else {
                    logger.log_error("BitcoinAverageAPI", "getAllAssets", "Failed [Request Error]", error.message)
                }
                return [];
            });
        } catch (error) {
            logger.log_error("BitcoinAverageAPI", "getAllAssets", "Failed [Try Failed]", error)
            return [];
        }
    }

    getAllCryptoAssets(assets) {
        const axios: any = require('axios');
        const logger: any = new LoggingFunctions();
        var cryptoJS: any = require("crypto-js");
        var url: string = "";
        var assetString : string = "";

        var sourceShortname = this.sourceShortname;

        for (var i = 0; i < assets.length; i++) {
            if (assets[i] !== "BTC") {
                if (assets[i] !== "ZRX") {
                    assetString = assetString + assets[i];
                    assetString = assetString + ",";
                }
            }
        }

        if (assetString.charAt(assetString.length - 1) === ",") {
            assetString = assetString.substring(0, assetString.length - 1);
        }

        url = "https://apiv2.bitcoinaverage.com/indices/crypto/ticker/short?base=" + assetString + "&target=BTC";

        var public_key = this.config.bitcoinaverage.apiPublicKey;
        var secret_key = this.config.bitcoinaverage.apiSecretKey;
        var timestamp = Math.floor(Date.now() / 1000);
        var payload = timestamp + '.' + public_key;
        var hash = cryptoJS.HmacSHA256(payload, secret_key);
        var hex_hash = cryptoJS.enc.Hex.stringify(hash);
        var signature = payload + "." + hex_hash;

        try {
            return axios({
                method: 'get',
                url: url,
                responseType: 'json',
                headers: { 'X-Signature': signature },
            }).then(function (response) {
                var values: any = [];
                var data : string = response.data;
                for (var i = 0; i < assets.length; i++) {
                    if (assets[i] === "BTC" || assets[i] === "ZRX") {
                        continue;
                    }
                    try{
                        var valueKey : string = assets[i] + "BTC";
                        var quote : any = data[valueKey];
                        var objectKey: any = assets[i] + ".BTC." + sourceShortname;
                        var price : number = quote.last;
                        values.push({[objectKey] : price});
                    } catch (error) {
                        logger.log_error("BitcoinAverageAPI", "getAllAssets", "While parsing response : " + assets[i], error)
                    }
                }
                return values;
            }).catch(function (error) {
                if (error.response) {
                    logger.log_error("BitcoinAverageAPI", "getAllAssets", "From Response", error.response)
                } else if (error.request) {
                    logger.log_error("BitcoinAverageAPI", "getAllAssets", "Failed [No Response]", error.request)
                } else {
                    logger.log_error("BitcoinAverageAPI", "getAllAssets", "Failed [Request Error]", error.message)
                }
                return [];
            });
        } catch (error) {
            logger.log_error("BitcoinAverageAPI", "getAllAssets", "Failed [Try Failed]", error)
            return [];
        }
    }

    getAllCurrencies(currs) {
        return [];
    }

    // getAllSupportedAssets() {
    //     const axios: any = require('axios');
    //     var cryptoJS: any = require("crypto-js");
    //     var url: string = "";

    //     var assets : string = "";
    //     url = "https://apiv2.bitcoinaverage.com/indices/crypto/ticker/short?base=" + assets + "&target=BTC";

    //     var public_key = this.config.bitcoinaverage.apiPublicKey;
    //     var secret_key = this.config.bitcoinaverage.apiSecretKey;
    //     var timestamp = Math.floor(Date.now() / 1000);
    //     var payload = timestamp + '.' + public_key;
    //     var hash = cryptoJS.HmacSHA256(payload, secret_key);
    //     var hex_hash = cryptoJS.enc.Hex.stringify(hash);
    //     var signature = payload + "." + hex_hash;
    // }
}

export { BitcoinAverageAPI };