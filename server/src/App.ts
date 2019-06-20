import * as express from 'express'
import {Request} from "express";
import {Response} from "express";
import * as request from 'request';
import * as dayjs from 'dayjs';
import {Emitter} from './sseEmitter';
import * as bodyParser from "body-parser";

class App {
    public express;

    constructor() {
        this.express = express();
        this.mountRoutes();
        this.listen(3000);
    }

    private mountRoutes(): void {
        const router = express.Router();
        const events = new Emitter();

        this.express.use(bodyParser.json());
        this.express.use('/', router);
        this.express.use('/events', router);
        this.express.use(express.static('public'));

        this.express.locals.dayjs = dayjs;
        this.express.set('view engine', 'pug');

        router.get('/', (req: Request, res: Response) => {

            this.grabit(function (aareJson) {

                let temperature = aareJson ? JSON.stringify(aareJson.aare.temperature) : '';
                let flow = aareJson ? JSON.stringify(aareJson.aare.flow) : '';
                let history = aareJson ? aareJson.aarepast : [];

                res.render('index', {
                    title: 'aare hack',
                    temperature: temperature,
                    flow: flow,
                    history: history
                });
            });
        });

        router.get('/events', events.subscribe);

        router.post('/', (req: Request, res: Response) => {

            events.publish(req.body);
            res.sendStatus(201);
        });
    }
    private listen(port: number): void {

        this.express.listen(port, (err) => {
            if (err) {
                return console.log(err)
            }

            return console.log(`server is listening on ${port}`)
        });
    }

    private grabit(callback: CallableFunction): void {

        request.get('https://aareguru.existenz.ch/v2018/current?city=bern', {timeout: 1000}, function (error, response, body) {
            if (response && response.statusCode == 200) {

                let aareJson = JSON.parse(body);

                callback(aareJson);

            } else {
                console.log('error: ' + error);
                console.log(body ? body : '');

                callback();
            }
        });
    }
}

export default new App().express