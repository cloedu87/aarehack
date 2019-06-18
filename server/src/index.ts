import * as express from 'express';
import { Request, Response } from 'express';
import * as request from 'request';

const app = express();
const {
    PORT = 3000,
} = process.env;
app.get('/', (req: Request, res: Response) => {

    request.get('https://aareguru.existenz.ch/v2018/current?city=bern', {timeout: 1000}, function (error, response, body) {
        if(response.statusCode == 200){

            let aareJson = JSON.parse(body);
            res.send(JSON.stringify(aareJson.aare.temperature));

        } else {
            console.log('error: '+ response.statusCode)
            console.log(body)
        }
    });


});
app.listen(PORT, () => {
    console.log('server started at http://localhost:'+PORT);
});