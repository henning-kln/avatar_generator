import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as crypto from 'crypto';
import {setPixelColor, Colors, textToNumber} from '../utils/image';
import { PNG } from 'pngjs';
import { setImage, getImage } from "../utils/redis";
import type { Sizes } from '../utils/types';

const Sizes = {
    small: {
        width: 200,
        offset: 5,
        factor: 10
    },
    medium: {
        width: 1000,
        offset: 25,
        factor: 2
    },
    large: {
        width: 2000,
        offset: 50,
        factor: 1
    }
}

export async function avatar(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    // get the name or a random username
    const input = request.query.get('name') || crypto.randomBytes(20).toString('hex')
    // make it lowercase
    const name = input.toLowerCase()

    // get the size
    const size = (request.query.get('size') || "small") as Sizes
    if(!Sizes[size]) return { status: 400, body: "Invalid Size. Please select between: `small`, `medium` & `large`." }

    // check if the image is already
    const i = await getImage(name, size)
    if(i){
        console.log(`username:(${name})size:(${size})`,i.length)

        return { body: i, headers: { 'Content-Type': 'image/png', 'Content-Length': i.length.toString() } };
    } 


    

    // get the size
    const width = Sizes[size].width
    const offset = Sizes[size].offset
    const factor = Sizes[size].factor


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
    const png = new PNG({ width: width, height: width}); 



    //set the color of each pixel
    for (let x = offset; x < png.height; x+=offset*2) {
        for (let y = offset; y < png.width; y+=offset*2) {
            const color = selectRandomColor((y*factor)*(x*factor));
            setPixelColor(png.data, x, y, color, offset);
        }
    }

    // convert picture into buffer
    const buffer = PNG.sync.write(png)

    // save image to redis
    await setImage(name, size, buffer);


    // return buffer as picture
    return { body: buffer, headers: { 'Content-Type': 'image/png', 'Content-Length': buffer.length.toString() } };
};

app.http('avatar', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: avatar
});
