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
        if (this.config.localEnvironment) {
            this.redisClient = redis.createClient();
        } else {
            this.redisClient = redis.createClient(this.config.redis.production.port, this.config.redis.production.url);
        }

        this.redisClient.on('connect', function() {
            var logger : any = new LoggingFunctions();
            //logger.log_debug("MemoryController", "configureRedisClient", "Client Connected!", "")
        });

        this.redisClient.on('error', function (err) {
            var logger: any = new LoggingFunctions();
            logger.log_debug("MemoryController", "configureRedisClient", "Client failed somehow!", err)
        });

        this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
        this.keysAsync = promisify(this.redisClient.keys).bind(this.redisClient);
    }
    
    saveDataFromSource(data, source) {
        var dataToSave : any = JSON.stringify(data);
        this.redisClient.set(source, dataToSave, redis.print);
    }
    
    async getAllMarketValueData() {
        try {
            var keys : any = await this.keysAsync("*");
            if (keys.length > 0) {
                var marketData: any = {};
                for (var i = 0; i < keys.length; i++) {
                    if (keys[i] === this.config.redis.keys.matrix) {
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