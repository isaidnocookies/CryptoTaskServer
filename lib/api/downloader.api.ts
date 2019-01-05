import { LoggingFunctions } from "../helpers/logging.functions";
import { ExternalConfig } from "../config/config";

abstract class DownloaderAPI {
    source: string;
    sourceShortname: string;
    config: ExternalConfig;
    logger: LoggingFunctions;

    constructor() {
        this.config = new ExternalConfig();
        this.logger = new LoggingFunctions();
    }

    abstract getValue(asset : string, base : string) : any;

    setSource(source : string, sourceShortname : string) {
        this.source = source;
        this.sourceShortname = sourceShortname;
    }
}

export { DownloaderAPI };