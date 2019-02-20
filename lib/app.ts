import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as https from "https";
import * as fs from "fs";
import * as helmet from 'helmet';

import { Routes } from "./routes/routes";
import { PriceMatrixRoutes } from './routes/priceMatrix.routes';
import { Config } from "./config/config";
import { LoggingFunctions } from "./helpers/logging.functions";
import { DownloaderService } from "./services/downloader.service";

class App {
    // Public variables for application
    public app : express.Application;
    public router : any;
    public configuration : Config = new Config();
    public server : https.Server;

    // Routes for api
    public baseRoutes : Routes;
    public matrixRoutes: PriceMatrixRoutes;

    // Downloader Service
    public downloaderService: DownloaderService;

    // MongoDB route
    public mongoUrl : string = (this.configuration.localEnvironment ? this.configuration.db.test.url : this.configuration.db.production.url);

    // Constructor for express app. Config, ExternalConfigures server and starts the listening process
    constructor() {
        this.app = express();

        this.downloaderService = new DownloaderService();
        this.matrixRoutes = new PriceMatrixRoutes();
        this.baseRoutes = new Routes();

        this.config();
        this.mongoSetup();
        this.createServer();
        this.setupRoutes();
        this.startDownloading();
        this.listen();
    }

    // Create HTTPS Server for Requests
    private createServer() : void {
        var privateKey = fs.readFileSync('./certs/site.keyfile', 'utf8');
        var certificate = fs.readFileSync('./certs/site.crtfile', 'utf8');
        var credentials: any = { key: privateKey, cert: certificate };

        this.server = https.createServer(credentials, this.app);
    }

    // Setup routes for each "Module"
    private setupRoutes() : void {
        this.baseRoutes.routes(this.app);
        this.matrixRoutes.routes(this.app);
    }
    
    // Config, ExternalConfigure express app with middleware
    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(helmet());
    }

    // Setup MongoDB connection
    private mongoSetup(): void {
        if (this.configuration.saveMatrixToDatabase) {
            mongoose.Promise = global.Promise;
            mongoose.connect(this.mongoUrl, { useNewUrlParser: true });    
        }
    }

    private startDownloading() : void {
        this.downloaderService.startDownload();
    }

    // Listen using server created in createServer()
    private listen(): void {
        var port : number = this.configuration.port;
        var logger: LoggingFunctions = new LoggingFunctions();
        if (this.configuration.localEnvironment) {
            this.app.listen(port, function () {
                logger.log_debug("App", "listen", "Http app listening in local environment", `HTTP server running at ${port}`)
            });
        } else {
            this.server.listen(port, function () {
                logger.log_debug("App", "listen", "Https app listening in prod environment", `HTTPS server running at ${port}`)
            });
        }
    }
}

export default new App().app;