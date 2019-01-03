export class CachedData {
    private static instance: CachedData;
    private _data: any;
    private _tempData: any;

    private constructor() {
        this._data = {};
        this._tempData = {};
    }

    static getInstance() {
        if (!CachedData.instance) {
            CachedData.instance = new CachedData();
        }
        return CachedData.instance;
    }

    get data(): number {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    get tempData() {
        return this._tempData;
    }

    set tempData(temp) {
        this._tempData = temp;
    }

    setKeyValue(key, data) {
        this._data[key] = data;
    }

    getKeyValue(key) {
        return this._data[key];
    }

    setTempData(key, data) {
        this._tempData[key] = data;
    }

    getTempData(key) {
        return this._tempData[key];
    }
}