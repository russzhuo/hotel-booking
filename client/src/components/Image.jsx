import { RESOURCE_URL } from "../constants/api";

export default function Image({src,...rest}){

    src = src && src.includes('https://') ? src :`${RESOURCE_URL}/${src}`;
    
    return (
    <img {...rest} src={src} alt={'image not found'}></img>
    )
}