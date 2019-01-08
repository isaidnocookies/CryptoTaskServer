import { ExternalConfig } from "./asset.config";
import * as dotenv from "dotenv";

class Config {
    version: string = "0.0.1"
    environment: string;
    localEnvironment: boolean = true;
    port: number = 443;
    debug: boolean = true;
    saveMatrixToDatabase: boolean = true;

    slackWebhook: string;

    constructor() {
        this.configureEnvironment();
        this.configureDB();
    }

    private configureEnvironment() {
        dotenv.config();

        if (process.env.ENVIRONMENT === "LOCAL") {

            this.localEnvironment = true;
            this.environment = "Local/Dev";
            this.slackWebhook = this._slackWebhooks.dev_taskserver;
            this.port = 80;

        } else if (process.env.ENVIRONMENT === "PURPLE") {

            this.localEnvironment = false;
            this.environment = "Purple";
            this.slackWebhook = this._slackWebhooks.dev_taskserver;
            this.port = 443;

        } else if (process.env.ENVIRONMENT === "RED") {

            this.localEnvironment = false;
            this.environment = "Red";
            this.slackWebhook = this._slackWebhooks.dev_taskserver;
            this.port = 443;

        } else if (process.env.ENVIRONMENT === "PROD") {

            this.localEnvironment = false;
            this.debug = false;
            this.environment = "Production";
            this.slackWebhook = this._slackWebhooks.prod_taskserver;
            this.port = 443;
        }
    }

    private configureDB() {
        if (process.env.SAVEDATATODB === "TRUE") {
            this.saveMatrixToDatabase = true;
        } else {
            this.saveMatrixToDatabase = false;
        }
    }

    db: any = {
        production: {
            url: "mongodb://ts.threebx.com/TaskServer"
        },
        test: {
            url: "mongodb://localhost/TaskServer"
        }
    };

    redis: any = {
        production: {
            url: "ts.threebx.com",
            port: "6379"
        },
        local: {
            //url: "127.0.0.1",
            url: "host.docker.internal",
            port: "6379"
        },
        keys : {
            matrix: "matrixdata",
            sourceKeys: "sourcekeys"
        }
    }

    _slackWebhooks = {
        prod_taskserver: "https://hooks.slack.com/services/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",
        dev_taskserver: "https://hooks.slack.com/services/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"
    }

}

export { Config, ExternalConfig };