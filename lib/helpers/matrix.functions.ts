import { ExternalConfig } from "../config/config";

/// EXPECTED FORMAT FOR VALUES into MATRIX FUNCTION
/// {ASSET.BASE.SOURCESHORTNAME : VALUE }
/*
[{ 'BCH.BTC.BTCAVG': 0.042539404118390314 },
{ 'BTC.BTC.BTCAVG': 1 },
{ 'DASH.BTC.BTCAVG': 0.021008569533892574 },
{ 'DGB.BTC.BTCAVG': 0.0000027465685262025616 },
{ 'DOGE.BTC.BTCAVG': 6.3e-7 },
{ 'ETH.BTC.BTCAVG': 0.03595636802150574 },
{ 'LTC.BTC.BTCAVG': 0.008201585344035643 },
{ 'XLM.BTC.BTCAVG': 0.000030173203324851446 },
{ 'XMR.BTC.BTCAVG': 0.012382553286596057 },
{ 'ZEC.BTC.BTCAVG': 0.015263711734965154 },
{ 'ZRX.BTC.BTCAVG': 0.00008170946908468219 },
{ 'BTC.USD.BTCAVG': 3735.450556935403 },
{ 'BTC.MXN.BTCAVG': 72291.62 }]
*/

export class MatrixFunctions {
    config : ExternalConfig = new ExternalConfig();

    generateV1Matrix(values: any): any {
        var flattenedValues: any = [].concat.apply([], values);
        var valueMap : any = this.generateValueMap(flattenedValues);
        return this.generateCompleteMatrix(valueMap);
    }
    
    generateCompleteMatrix(valueMap : any) : any {
        var theMatrix : any = {};
        var flattentedMap : any = this.flattenValueMap(valueMap);

        const allAssets = Object.assign({}, this.config.assets, this.config.currencies, this.config.fixedTokens);

        for (var fromAssetKey in allAssets) {
            theMatrix[fromAssetKey] = {};
            var conversion : number = - 1;
            for (var toAssetKey in allAssets) {
                if (fromAssetKey in this.config.assets) {
                    var fromValue : number = flattentedMap[fromAssetKey + ".BTC"];
                    if (toAssetKey in this.config.assets) {
                        var toValue : number = flattentedMap[toAssetKey + ".BTC"];
                        conversion = toValue / fromValue;
                    } else if (toAssetKey in this.config.currencies) {
                        //toAssetKey is a currency
                        var toValue : number = flattentedMap["BTC." + toAssetKey];
                        conversion = fromValue * toValue;
                    } else {
                        // toAssetKey is a fixedToken
                        if (this.config.fixedTokens[toAssetKey].base === this.config.currencies.USD) {
                            var toValue : number = flattentedMap["BTC.USD"] / this.config.fixedTokens[toAssetKey].price;
                            conversion = fromValue * toValue;
                        } else {
                            conversion = -1;
                        }
                    }
                } else if (fromAssetKey in this.config.currencies) {
                    // fromAsset is a currency
                    var fromValue : number = flattentedMap["BTC." + fromAssetKey];
                    if (toAssetKey in this.config.assets) {
                        var toValue : number = flattentedMap[toAssetKey + ".BTC"];
                        conversion = fromValue * toValue;
                        conversion = 1/conversion;
                    } else if (toAssetKey in this.config.currencies) {
                        var toValue: number = flattentedMap["BTC." + toAssetKey];
                        conversion = fromValue / toValue;
                    } else {
                        // toAssetKey is a fixedToken
                        if (this.config.fixedTokens[toAssetKey].base === this.config.currencies.USD) {
                            var toValue: number = flattentedMap["BTC.USD"] / this.config.fixedTokens[toAssetKey].price;
                            conversion = fromValue / toValue;
                            conversion = 1 / conversion;
                        } else {
                            conversion = -1;
                        }
                    }
                } else {
                    // fromAssetKey is a fixedToken
                    var fromValue : number;
                    if (this.config.fixedTokens[fromAssetKey].base === this.config.currencies.USD) {
                        fromValue = flattentedMap["BTC.USD"] / this.config.fixedTokens[fromAssetKey].price;
                        if (toAssetKey in this.config.assets) {
                            var toValue: number = flattentedMap[toAssetKey + ".BTC"];
                            conversion = fromValue * toValue;
                            conversion = 1 / conversion;
                        } else if (toAssetKey in this.config.currencies) {
                            var toValue: number = flattentedMap["BTC." + toAssetKey];
                            conversion = fromValue / toValue;
                            conversion = 1 / conversion;
                        } else {
                            // toAssetKey is a fixedToken
                            if (this.config.fixedTokens[toAssetKey].base === this.config.currencies.USD) {
                                var toValue: number = flattentedMap["BTC.USD"] / this.config.fixedTokens[toAssetKey].price;
                                conversion = fromValue / toValue;
                                conversion = 1 / conversion;
                            } else {
                                conversion = -1;
                            }
                        }
                    } else {
                        conversion = -1;
                    }
                }
                if (conversion) {
                    theMatrix[fromAssetKey][toAssetKey] = { rate: conversion.toString() };
                } else {
                    theMatrix[fromAssetKey][toAssetKey] = { rate: "-1" };
                }
            }
        }

        theMatrix["timestamp"] = Math.floor(Date.now() / 1000);
        return theMatrix;
    }

    generateValueMap(values : any) : any {
        var valueMap: any = {};
        for (var i = 0; i < values.length; i++) {
            var valueEntry: any = values[i];
            var valueKey: string = Object.keys(valueEntry)[0];
            var value: number = valueEntry[valueKey];

            var splitKey: string[] = valueKey.split(".");
            var asset: string = splitKey[0];
            var base: string = splitKey[1];
            var source: string = splitKey[2];
            var newKey : string = asset + "." + base;

            if (newKey in valueMap) {
                valueMap[newKey].push({[source]: value});
            } else {
                valueMap[newKey] = [];
                valueMap[newKey].push({[source]: value})
            }
        }
        return valueMap;
    }

    flattenValueMap(valueMap : any) : any {
        var valueAggregator: any = this.averageValues; //valueAggregator can be swapped to use another form of average or statistical method
        var flattenedValueMap : any = {};

        for (var key in valueMap) {
            var values : any = valueMap[key];
            flattenedValueMap[key] = valueAggregator(values);
        }

        return flattenedValueMap;
    }

    // takes in array of objects [{source : value}, {source : value}, ...]
    // This {source : value} structure allows for weighted averages based on source
    averageValues(values : any) : number {
        var average : number = 0;
        var count : number = 0;

        for (var i = 0; i < values.length; i++) {
            var valueKey : string = Object.keys(values[i])[0];
            var value: number = values[i][valueKey];

            if (value > 0) {
                average = average + value;
                count = count + 1; 
            }
        }
        if (count === 0) {
            return -1;
        }
        average = average / count;
        return average;
    }
}