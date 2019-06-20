import * as EventEmitter from 'eventemitter3';
import {Request, Response} from "express";

export class Emitter {

    public emitter;

    constructor() {
        this.emitter = new EventEmitter();
    }

    public subscribe = (req: Request, res: Response) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        });

        //send constant signal over http connection
        const heartbeat = this.heart(() => {
            res.write('\n');
        });

        //if event getts triggered, send new data to client
        const onEvent = function (data) {
            console.log('hooorrrraaaaayyy' + JSON.stringify(data))

            res.write('retry: 500\n');
            res.write(`event: event\n`);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        this.emitter.on('event', onEvent);

        req.on('close', function () {

            //kill constant signal to client
            clearInterval(heartbeat);

            //kill http connection
            this.emitter.removeListener('event', onEvent);
        });
    };

    public publish = (eventData: any) => {

        this.emitter.emit('event', eventData);
    };

    private heart(beat: CallableFunction): number {

        return setInterval(beat, 10000);
    }
}

export default new Emitter().emitter;
