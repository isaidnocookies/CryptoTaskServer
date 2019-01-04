import { Request, Response } from 'express';
import { MatrixController } from '../controllers/matrix.controller';

export class PriceMatrixRoutes {
    matrixController : MatrixController;

    constructor() {
        this.matrixController = new MatrixController();
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

        app.get('/testMatrix', (req: Request, res: Response) => {
            this.matrixController.getPriceMatrix().then(async (matrix) => {
                var testResult : any = await this.matrixController.testAgainstExistingMatrix("https://ts.threebx.com/ex/rates", matrix);
                res.status(200).send({result: testResult});
            })
        });
    }
}