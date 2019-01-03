abstract class DownloaderAPI {
    source: string;
    sourceShortname: string;
    config: any;

    constructor(config: any) {
        this.config = config;
    }

    abstract getValue(asset : string, base : string) : any;

    setSource(source : string, sourceShortname : string) {
        this.source = source;
        this.sourceShortname = sourceShortname;
    }
}

export { DownloaderAPI };