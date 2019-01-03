import { Request, Response } from 'express';
import { BitcoinAverageAPI } from '../api/bitcoinaverage.api';

import { CachedData } from "../api/cachedData.api";

export class Routes {
    cachedData: CachedData;

    constructor(cachedData) {
        this.cachedData = cachedData;
    }

    public routes (app) : void {
        app.route('/').get((req: Request, res: Response) => {
            res.status(200).send({message: "Threshodl get!"})
        });

        app.post('/', (req: Request, res: Response) => {
            const data = req.body.data;
            res.status(200).send({message: "Hello, world " + data})
        });

        app.post('/test', (req: Request, res: Response) => {
            res.status(200).send({message: "Test"});
        });
    }
}