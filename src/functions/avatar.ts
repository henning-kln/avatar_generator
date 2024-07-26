import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as crypto from 'crypto';
import {setPixelColor, Colors, textToNumber} from '../utils/image';
import { PNG } from 'pngjs';

const Sizes = {
    small: {
        width: 200,
        offset: 5,
        facotr: 10
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

    const size = request.query.get('size') || "small"
    if(!Sizes[size]) return { status: 400, body: "Invalid Size. Please select between: `small`, `medium` & `large`." }

    // get the size
    const width = Sizes[size].width
    const offset = Sizes[size].offset
    const factor = Sizes[size].factor



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
    const png = new PNG({ width: width, height: width}); 



    //set the color of each pixel
    for (let x = offset; x < png.height; x+=offset*2) {
        for (let y = offset; y < png.width; y+=offset*2) {
            const color = selectRandomColor(y*x*factor);
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
