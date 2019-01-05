import { ExternalConfig } from "./asset.config";

class Config {
    version: string = "0.0.1"
    localEnvironment: boolean = true;
    port: number = 3333;
    debug: boolean = true;

    constructor() {
        // INit stuffs...
    }

    db: any = {
        production: {
            url: ""
        },
        test: {
            url: "mongodb://localhost/TaskServer"
        }
    };

    redis: any = {
        production: {
            url: "",
            port: ""
        },
        local: {
            url: "127.0.0.1",
            port: "6379"
        },
        keys : {
            matrix: "matrixdata",
            sourceKeys: "sourcekeys"
        }
    }

    saveMatrixToDatabase: boolean = true;

    slackWebhooks = {
        taskserver: ""//"https://hooks.slack.com/services/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"
    }

}

export { Config, ExternalConfig };