import {useState, useEffect, useRef,ChangeEvent} from 'react';
import {Image,Button} from 'react-bootstrap';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'

const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

export const Thumb = ({image, setImage}: {image: any, setImage: (newImage: File) => void}) => {
    const [thumb, setThumb] = useState<string>('');   
    const [completedCropImage, setCompletedCropImage]  = useState<string>("");
    const fileRef = useRef<File>();
    
    useEffect(()=>{
        if(image instanceof File){
            fileRef.current = image;
            readImageData(image);
        }
    },[image]);

    const handleCrop = (image: File) =>{
        setImage(image);
    }

    function readImageData(file: File){
        const fileReader = new FileReader();
        
        fileReader.addEventListener("load", () => {
            setThumb(fileReader.result as string);
        }, false);

        if(file){
            fileReader.readAsDataURL(file);
        }
    }

    return <>
        <Image rounded 
                fluid 
                roundedCircle  
                style={{
                    width:'120px',
                    height: '120px'
                }}
                src={completedCropImage ||thumb || image || defaultAvatar}>
        </Image>
        {" "} 
        <Button onClick={() => {
            if(fileRef.current){
                handleCrop(fileRef.current);
            }
        }}>Crop</Button>
        {thumb && <ImageCrop image={thumb} onImageCropped={(blob, imgURLData) => {
            if(fileRef.current && imgURLData){
                const file = new File([blob], fileRef?.current?.name || 'image', {
                    type: blob.type
                });
                setCompletedCropImage(imgURLData);
                fileRef.current = file;
            }
        }}></ImageCrop>}
       
    </>
}

const ImageCrop = ({image, onImageCropped}:{image: any, onImageCropped: (blob: Blob, imgURLData?: string) => void}) => {  
    const [imgSrc, setImgSrc] = useState<HTMLImageElement>();
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    const [aspect, setAspect] = useState<number | undefined>(1);

    useEffect(() => {
        const t = setTimeout(() => {
            if(imgSrc instanceof HTMLImageElement && completedCrop?.width && completedCrop?.height){
                getCroppedImage(imgSrc,completedCrop).then(({blob, imgURL}) =>{
                    onImageCropped(blob, imgURL);
                }).catch(error => error);
            }
        }, 100);
        return () =>{
            clearTimeout(t);
        }
    },[completedCrop]);

    function centerAspectCrop(
        mediaWidth: number,
        mediaHeight: number,
        aspect: number,
        ) {
        return centerCrop(
            makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
            ),
            mediaWidth,
            mediaHeight,
    )}
    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        e.currentTarget.crossOrigin = 'anonymous';
        setImgSrc(e.currentTarget);
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(crop => centerAspectCrop(width, height, aspect))
        }
    }
    function getCroppedImage(sourceImage:HTMLImageElement, 
        cropConfig:PixelCrop, 
        scale = 1,
        rotate = 0) : Promise<{
        blob: Blob,
        imgURL: string,
    }> {
        // creating the cropped image from the source image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const TO_RADIANS = Math.PI / 180
        if(!ctx){
            throw new Error("No 2d context");
        }

        const scaleX = sourceImage.naturalWidth / sourceImage.width;
        const scaleY = sourceImage.naturalHeight / sourceImage.height;
        
        const pixelRatio = window.devicePixelRatio;

        canvas.width = Math.floor(cropConfig.width * scaleX * pixelRatio)
        canvas.height = Math.floor(cropConfig.height * scaleY * pixelRatio)

        // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        const cropX = cropConfig.x * scaleX;
        const cropY = cropConfig.y * scaleY;

        const rotateRads = rotate * TO_RADIANS;
        const centerX = image.naturalWidth / 2;
        const centerY = image.naturalHeight / 2;

        ctx.save()

        // 5) Move the crop origin to the canvas origin (0,0)
        ctx.translate(-cropX, -cropY)
        // 4) Move the origin to the center of the original position
        ctx.translate(centerX, centerY)
        // 3) Rotate around the origin
        ctx.rotate(rotateRads)
        // 2) Scale the image
        ctx.scale(scale, scale)
        // 1) Move the center of the image to the origin (0,0)
        ctx.translate(-centerX, -centerY)

        ctx.drawImage(
            sourceImage,
            0,
            0,
            sourceImage.naturalWidth,
            sourceImage.naturalHeight,
            0,
            0,
            sourceImage.naturalWidth,
            sourceImage.naturalHeight
        );

        ctx.restore();
        
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                // returning an error
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                // creating a Object URL representing the Blob object given
                const croppedImageUrl = window.URL.createObjectURL(blob);
                resolve({
                    blob: blob,
                    imgURL: croppedImageUrl
                });
            }, "image/jpeg", 1);
        });
    }

    return <>
        <ReactCrop crop={crop}
            onChange={(_,percentageCrop) => setCrop(percentageCrop)}
            onComplete={(crop) =>setCompletedCrop(crop)}
            circularCrop
            aspect={aspect}
        >
            <Image 
                alt="crop"
                src={image} 
                onLoad={onImageLoad}
                style={{
                    width: '100%'
                }}
            ></Image>
        </ReactCrop>
    </>
}