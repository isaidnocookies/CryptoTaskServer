import { Request, Response } from 'express';
import { CachedData } from "../api/cachedData.api";

export class PriceMatrixRoutes {
    cachedData: CachedData;

    constructor(cachedData) {
        this.cachedData = cachedData;
    }

    public routes(app): void {
        app.route('/priceMatrix').get((req: Request, res: Response) => {
            res.status(200).send({ message: "Matrix Routes, YAY!" })
        });

        app.get('/ex/rates', (req: Request, res: Response) => {
            var priceMatrix : any = this.getPriceMatrix();
            res.status(200).send(priceMatrix)
        });

        app.get('/matrix', (req: Request, res: Response) => {
            var priceMatrix: any = this.getPriceMatrix();
            res.status(200).send(priceMatrix)
        });
    }

    private getPriceMatrix() : any {
        // add db support...
        var value: any = this.cachedData.getKeyValue("PriceMatrix");
        return value;
    }
}