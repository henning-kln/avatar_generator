
export const Colors = {
    blue: {
        red: 0,
        green: 0,
        blue: 255,
    },
    green: {
        red: 0,
        green: 255,
        blue: 0,
    },
    red: {
        red: 255,
        green: 0,
        blue: 0,
    },
    yellow: {
        red: 255,
        green: 255,
        blue: 0,
    },
    purple: {
        red: 255,
        green: 0,
        blue: 255,
    },
    cyan: {
        red: 0,
        green: 255,
        blue: 255,
    },
    black: {
        red: 0,
        green: 0,
        blue: 0,
    },
    white: {
        red: 255,
        green: 255,
        blue: 255,
    }
}


/**
     * set the Color of a Pixel
     * @param image Image Buffer
     * @param x X Position
     * @param y Y Position
     * @param r Red Value
     * @param g Green Value
     * @param b Blue Value
     * @param a Transparency Value
     */
export function setPixel(image: Buffer, x: number, y: number, r: number, g: number, b: number, a: number) {
    const length = Math.sqrt(image.length/4)
    const i = (y * length + x) * 4;
    image[i] = r;
    image[i + 1] = g;
    image[i + 2] = b;
    image[i + 3] = a;
}


/**
 * set the Color of a Pixel by Color Name
 * @param image Image Buffer
 * @param x X Position
 * @param y Y Position
 * @param color Color in string
 */
export function setPixelColor(image: Buffer, xG: number, yG: number, color: string, offset: number) {
    const { red, green, blue } = Colors[color];
    for(let x = xG-offset; x < offset+xG; x++) {
        for(let y = yG-offset; y < offset+yG; y++) {
            setPixel(image, x, y, red, green, blue, 255);
        }
    }
}


export function textToNumber(input){
    let output = ""
    for(const l of input){
        const n = l.charCodeAt(0);
        output += n.toString();
    }

    return output
}