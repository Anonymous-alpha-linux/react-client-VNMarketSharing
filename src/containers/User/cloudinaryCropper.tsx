import React from 'react';
import axios from 'axios';
import { Cloudinary, Transformation } from '@cloudinary/url-gen';

const url = "https://api.cloudinary.com/v1_1/" + process.env.REACT_APP_CLOUDINARY_NAME + "/auto/upload"

export const CloudinaryCropper: React.FC<{files: File[]}> = ({files}) => {
    React.useEffect(() =>{
        console.log(process.env.REACT_APP_CLOUDINARY_URL);
    },[]);

    return (
        <div>
            
        </div>
    )
}

type UploadState = {

} 

type UploadResponse = {
    public_id: string;
    version: string;
    width: number;
    height: number;
    format: string;
    created_at: string;
    resource_type: string;
    tags: any[];
    bytes: number; 
    type: string; 
    etag: string; 
    url: string;
    secure_url: string;
    signature: string;
    original_filename: string;
}

export function useUploadToRemote()
: [
    UploadResponse[],
    (files: File[]) => Promise<UploadResponse[]>
]{
    const [state, setState] = React.useState<UploadResponse[]>([]);

    const uploadToCloud = React.useCallback(async function(files: File[]): Promise<UploadResponse[]>{
        const formData = new FormData();

        files.forEach(file =>{
            formData.append("file", file);
        });

        formData.append("upload_preset", "AdsMarketSharing");

        const response = await axios.post(url, formData);
        console.log(response);
        const { data } = response;

        setState(data);

        return Promise.resolve(data);
    }, [state]);

    return [state, uploadToCloud];
}