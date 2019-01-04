import { ExternalConfig } from "./asset.config";

class Config {
    version: string = "0.0.1"
    localEnvironment: boolean = true;
    port: number = 3333;

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

    saveMatrixToDatabase: boolean = false;
}

export { Config, ExternalConfig };