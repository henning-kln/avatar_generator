import { createClient, type RedisClientType} from 'redis';
import { Sizes } from './types';



// get data from env
// use ssl
const client: RedisClientType = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        tls: true
    }
});

export async function setImage(username: string, size: Sizes, image: Buffer){
    
    await client.set("image:("+username+")size:("+size+")", image.toString('base64'), { EX: 60 * 60});
}


export async function getImage(username: string, size: Sizes){
    const image = await client.get("image:("+username+")size:("+size+")");
    // if image is not found
    if(!image) return null;
    return Buffer.from(image, "base64");
   
}

client.on('error', (err) => {
    console.error(err);
})
client.on('connect', () => {
    console.log(`Connected to ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
})
client.connect();
client.auth({
    password: process.env.REDIS_PASSWORD
});