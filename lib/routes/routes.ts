import { Request, Response } from 'express';

export class Routes {
    constructor() {
    }

    public routes (app) : void {
        app.route('/').get((req: Request, res: Response) => {
            res.status(200).send({message: "Buzz buzz!"})
        });

        app.post('/', (req: Request, res: Response) => {
            const data = req.body.data;
            res.status(200).send({message: "Hello, world!"})
        });
    }
}