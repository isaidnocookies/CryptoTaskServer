import { LoggingFunctions } from "../helpers/logging.functions";

abstract class GenericDownloaderService {
    logger : LoggingFunctions;

    constructor() {
        this.logger = new LoggingFunctions();
    }
    // Add details on formatting and show to save the data
    abstract download() : any;
}

export { GenericDownloaderService }