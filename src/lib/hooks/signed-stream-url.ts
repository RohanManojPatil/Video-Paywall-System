import crypto from 'crypto';

function generateToken(videoId:string, expires:number, securityKey:string)
{
    const data = securityKey + videoId + expires.toString();

    const hash = crypto.createHash("sha256");
    hash.update(data);

    return hash.digest('hex');
}
export function signStreamURL(iFrameURL : string, securityKey : string){
    const expiration = 3600;

    const parsedURL = new URL(iFrameURL);
    const segments = parsedURL.pathname.split("/");
    const videoId = segments[3];

    const expires = Math.floor(Date.now()/1000) + expiration;

    const token = generateToken(videoId, expires, securityKey);
    parsedURL.searchParams.set("token", token);
    parsedURL.searchParams.set("expires", expires.toString());

    return parsedURL.toString();

}