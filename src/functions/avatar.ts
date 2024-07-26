import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as crypto from 'crypto';
import {setPixelColor, Colors, textToNumber} from '../utils/image';
import { PNG } from 'pngjs';

export async function avatar(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    // get the name or a random username
    const input = request.query.get('name') || crypto.randomBytes(20).toString('hex')

    // make it lowercase
    const name = input.toLowerCase()

    // hash the name
    const hash = crypto.createHash("sha512").update(name).digest("hex");
    //convert every character into a number
    const nHash = textToNumber(hash)


    // select a random Color
    function selectRandomColor(pos: number = 0) {
        const colorNames = Object.keys(Colors);
        const n = Number(nHash[pos % nHash.length])
        const colorName = colorNames[n % colorNames.length];
        return colorName;
    }

    //create empty image by 20x20 pixel
    const png = new PNG({ width: 2000, height: 2000}); 

    // set the pixelsize
    const offset = 50 // this is only the half pixel


    //set the color of each pixel
    for (let x = offset; x < png.height; x+=offset*2) {
        for (let y = offset; y < png.width; y+=offset*2) {
            const color = selectRandomColor(y*x);
            setPixelColor(png.data, x, y, color, offset);
        }
    }

    // convert picture into buffer
    const buffer = PNG.sync.write(png)

    // return buffer as picture
    return { body: buffer, headers: { 'Content-Type': 'image/png', 'Content-Length': buffer.length.toString() } };
};

app.http('avatar', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: avatar
});
