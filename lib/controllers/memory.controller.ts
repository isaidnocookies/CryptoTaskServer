import { Config } from "../config/config";
import { LoggingFunctions } from "../helpers/logging.functions"
var redis = require('redis');
const { promisify } = require('util');

// Memory Controller manages the Redis connection for caching data and pooling downloaded information
class MemoryController {
    redisClient : any;
    config: Config;
    logger: LoggingFunctions;
    getAsync: any;
    keysAsync: any;

    constructor() {
        this.config = new Config();
        this.logger = new LoggingFunctions();
        this.configureRedisClient();
    }

    private configureRedisClient() {
        // add authentication _ TODO
        if (this.config.localEnvironment) {
            // Use default connection information for local redis server/db
            this.redisClient = redis.createClient();
        } else {
            this.redisClient = redis.createClient(this.config.redis.production.port, this.config.redis.production.url);
        }

        // this.redisClient.on('connect', function() {
        //     //var logger : any = new LoggingFunctions();
        //     //logger.log_debug("MemoryController", "configureRedisClient", "Client Connected!", "")
        // });

        this.redisClient.on('error', function (err) {
            var logger: any = new LoggingFunctions();
            logger.log_error("MemoryController", "configureRedisClient", "Client failed somehow!", err)
        });

        this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
        this.keysAsync = promisify(this.redisClient.keys).bind(this.redisClient);
    }

    cachePriceMatrix(matrix) {
        try {
            this.redisClient.set(this.config.redis.keys.matrix, JSON.stringify(matrix));
        } catch (error) {
            this.logger.log_fatal("MemoryController", "cachePriceMatrix", "Client failed to cache price matrix!", error)
        }
    }

    getPriceMatrix() {
        try {
            var matrix: any = this.getAsync(this.config.redis.keys.matrix);
            return matrix;
        } catch (error) {
            this.logger.log_fatal("MemoryController", "getPriceMatrix", "Client failed to get price matrix!", error)
        }
        // return this.redisClient.get(this.config.redis.keys.matrix, function (error, matrix) {
        //     if (error) {
        //         this.logger.log_fatal("MemoryController", "getPriceMatrix", "Client failed to get price matrix!", error)
        //         return {};
        //     }
        //     return matrix;
        // });
    }
    
    // potentially look at forcing the key to expire after a period of time.
    // saves list of sources in redis db to optimize retrieval of data
    async saveDataFromSource(data, source) {
        var dataToSave : any = JSON.stringify(data);
        try {
            this.redisClient.set(source, dataToSave);
            var sourceData : any = [];
            var returnedSources = await this.getAsync(this.config.redis.keys.sourceKeys)
            if (returnedSources) {
                sourceData = returnedSources.split(',');
                var found: boolean = false;
                for (var i = 0; i < sourceData.length; i++) {
                    if (sourceData[i] === source) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    sourceData.push(source);
                    var dataString : string = sourceData.toString();
                    this.redisClient.set(this.config.redis.keys.sourceKeys, dataString)
                }
            } else {
                this.redisClient.set(this.config.redis.keys.sourceKeys, source);
            }
        }catch(error) {
            this.logger.log_fatal("MemoryController", "saveDataFromSource", "Client failed to save data!", error)
        }
    }
    
    async getAllMarketValueData() {
        try {
            var keyString: any = await this.getAsync(this.config.redis.keys.sourceKeys);
            var keys : any = keyString.split(",");
            if (keys.length > 0) {
                var marketData: any = {};
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] === this.config.redis.keys.matrix || keys[i] === this.config.redis.keys.sourceKeys) {
                        continue; // we dont want the matrix in the data
                    }
                    var data : any = await this.getAsync(keys[i]);
                    if (data.length > 0) {
                        marketData[keys[i]] = JSON.parse(data);
                    }
                }
                return marketData;
            }
        } catch (error) {
            this.logger.log_fatal("MemoryController", "getAllMarketValueData", "Failed to get all data", error);
        }
    }
    
}

export { MemoryController }