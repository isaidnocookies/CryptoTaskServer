import { Request, Response } from 'express';
import { MemoryController } from '../controllers/memory.controller';
import { MatrixController } from '../controllers/matrix.controller';

export class PriceMatrixRoutes {
    memoryController : MemoryController;
    matrixController : MatrixController;

    constructor() {
        this.matrixController = new MatrixController();// remove and push to matrix controller...
    }

    public routes(app): void {
        app.route('/priceMatrix').get((req: Request, res: Response) => {
            res.status(200).send({ message: "Matrix Routes, YAY!" })
        });

        app.get('/ex/rates', (req: Request, res: Response) => {
            this.matrixController.getPriceMatrix().then((matrix) => {
                res.status(200).send(JSON.parse(matrix));
            })
        });

        app.get('/matrix', (req: Request, res: Response) => {
            this.matrixController.getPriceMatrix().then((matrix) => {
                res.status(200).send(JSON.parse(matrix));
            })
        });
    }
}