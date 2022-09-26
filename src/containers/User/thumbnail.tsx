import React,{useState, useEffect, useRef, CSSProperties} from 'react';
import {Image,Button,Row,Col, Form} from 'react-bootstrap';
import imageCompression from 'browser-image-compression';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getPhoto } from '../../utils';
import { useDebouncedInput } from '../../hooks';

const defaultAvatar = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2021/07/cute-astronaut-wallpaperize-amoled-clean-scaled.jpg';

interface ThumbProps{
    image: string | File | null;
    showCrop?: boolean;
    roundedCircle?: boolean;
    styleThumb?: CSSProperties;
    styleCrop?: CSSProperties;
    allowResize?: boolean;
    setImage: (newImage: File) => void;
}

export const Thumb = React.forwardRef((
    {image, setImage,allowResize = true, ...props}: ThumbProps, 
    thumbRef: React.Ref<HTMLImageElement>) => {
    const [thumb, setThumb] = useState<string>('');   
    const [completedCropImage, setCompletedCropImage]  = useState<string>("");
    const fileRef = useRef<File>();
    const originalImageRef = React.useRef<HTMLImageElement>(null);
    
    // Trigger every changes of [props: {image}]
    useEffect(()=>{
        if(image instanceof File){
            fileRef.current = image;
            readImageData(image);
            fileRef.current = image;
        }
        if(typeof image === "string"){
            setThumb(image);
            setCompletedCropImage(image);
            fileRef.current = getPhoto(image);
        }
    },[image]);

    // Action is triggered as click button "Crop Image"
    const handleCrop = (image: File) =>{
        setImage(image);
    }

    // Transform image to String64 based URL
    function readImageData(file: File){
        const fileReader = new FileReader();
        
        fileReader.addEventListener("load", () => {
            setThumb(fileReader.result as string);
            setCompletedCropImage(fileReader.result as string);
        }, false);

        if(file){
            fileReader.readAsDataURL(file);
        }
    }

    return <>
        <div className="thumb__container" style={props.styleThumb}>
            <div className="thumb__original" style={{
                visibility: 'hidden',
            }}>
                <Image
                    alt="originalCrop"
                    src={completedCropImage}
                    onLoad={() => {}}
                    ref={originalImageRef}
                    style={{
                        maxWidth: '100%',
                        minWidth: '100%',
                        width: '100%',
                        display: "none"
                    }}
                ></Image>
            </div>
            <Image rounded 
                ref={thumbRef} 
                fluid 
                roundedCircle={props.roundedCircle} 
                width={"100%"}
                height={"100%"}
                src={thumb || defaultAvatar}>
            </Image>
        </div>
        {" "} 
        { 
        props.showCrop && <span 
            className='p-3'
            style={{
                overflowY: 'scroll',
                overflowX: 'hidden',
                maxHeight: '80vh',
                ...props.styleCrop
            }}>
                <Row className={"pt-3"} md={2} style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    background: 'inherit',
                    zIndex: 1
                }}>
                    <Col md={5}>
                        <Button onClick={() => {
                            if(fileRef.current){
                                handleCrop(fileRef.current);
                            }}}
                            style={{background:"var(--clr-logo)"}}
                        >
                            Crop Image
                        </Button>
                    </Col>
                    
                    <Col md={5}>
                        <label>Cropped Image size:</label>
                        <p>{((fileRef.current?.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
                    </Col>
                </Row>
            {
                thumb && <ImageCrop image={completedCropImage} 
                    originalImageRef={originalImageRef}
                    roundedCircle={props.roundedCircle}
                    onImageCropped={(blob, imgURLData) => {
                        if(fileRef.current && imgURLData){
                            const file = new File([blob], fileRef?.current?.name || 'image', {
                                type: blob.type
                            });
                            fileRef.current = file;
                            setThumb(imgURLData);
                        }
                    }}
                    allowResize={allowResize}
                ></ImageCrop>
            }
            </span>
        }
    </>
})

const ImageCrop = ({image, onImageCropped,originalImageRef, ...props}:{
    image: string, 
    originalImageRef: React.RefObject<HTMLImageElement>
    onImageCropped: (blob: Blob, imgURLData?: string, resize ?: number) => void
    roundedCircle?: boolean,
    allowResize: boolean,
}) => {  
    const [imgSrc, setImgSrc] = useState<string>(image);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>({
        width: 120,
        height: 120,
        unit: 'px',
        x: 0,
        y: 0
    });
    const [aspect, setAspect] = useState<number | undefined>(1);
    const [orientation ,setOrientation , setOrientationWithoutEvent] = useDebouncedInput<number, React.ChangeEvent<HTMLInputElement>>(100,{
        debouncedCallback: (value, event) =>{
            resizeHandler(value);
        }
    });
    const imageRef = React.useRef<HTMLImageElement>(null);

    // Sync with props
    useEffect(() =>{
        setImgSrc(image);
    },[image]);

    // Crop handler
    useEffect(() => {
        const t = setTimeout(() => {
            if(
                imageRef.current
                && originalImageRef.current
                && completedCrop?.width 
                && completedCrop?.height
            ){
                getCroppedImage(
                    imageRef.current,
                    completedCrop,
                    orientation).then(({blob, imgURL}) =>{
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
    // Reload crop state
    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        e.currentTarget.crossOrigin = 'anonymous';
        // setImgSrc(e.currentTarget);
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(_ => centerAspectCrop(width, height, aspect));
        }
    }
    // Triggered every move of cropper
    function getCroppedImage(sourceImage:HTMLImageElement, 
        cropConfig:PixelCrop, 
        resizing = 100,
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

        canvas.width = Math.floor(cropConfig.width * scaleX * pixelRatio) * (resizing / 100);
        canvas.height = Math.floor(cropConfig.height * scaleY * pixelRatio) * (resizing / 100);

        // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        const cropX = cropConfig.x * scaleX;
        const cropY = cropConfig.y * scaleY;

        const rotateRads = rotate * TO_RADIANS;
        const centerX = sourceImage.naturalWidth / 2;
        const centerY = sourceImage.naturalHeight / 2;

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
            sourceImage.naturalWidth * (resizing / 100),
            sourceImage.naturalHeight * (resizing / 100),
            // 0,
            // 0,
            // sourceImage.naturalWidth,
            // sourceImage.naturalWidth
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

                imageCompression(blob as File,{
                    maxSizeMB: 1,
                    fileType: 'image/jpeg',
                    alwaysKeepResolution: true,
                    initialQuality: 1
                }).then(compressedBlob => {
                    resolve({
                        blob: compressedBlob as Blob,
                        imgURL: croppedImageUrl,
                    });
                });
            }, "image/jpeg", 1);
        });
    }
    // Compress the size of image
    function compressImageSize(sourceImage: HTMLImageElement,resize: number, quality = 1): Promise<{
        blob: Blob,
        imgURL: string
    }>{
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        const originalWidth = sourceImage.width;
        const originalHeight = sourceImage.height;

        canvas.width = originalWidth * resize;
        canvas.height = originalHeight * resize;
        console.log(sourceImage);
        ctx.save();

        ctx.drawImage(
            sourceImage,
            0,
            0,
            originalWidth * resize,
            originalHeight * resize
        )

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
                
                imageCompression(blob as File,{
                    maxSizeMB: 1,
                    fileType: 'image/jpeg',
                    alwaysKeepResolution: true,
                    initialQuality: 1
                }).then(compressedBlob => {
                    resolve({
                        blob: compressedBlob as Blob,
                        imgURL: croppedImageUrl,
                    });
                }).catch(error =>{
                    console.log(error);
                });
            }, "image/jpeg", 1);
        });
    }
    // Triggered as use slide the range of resize input
    function resizeHandler(value: number){
        if(originalImageRef.current){
            console.log("resize", value);
            console.log(
                originalImageRef.current.width,
                originalImageRef.current.height
            );
            compressImageSize(
                originalImageRef.current
                ,(value / 100))
            .then(({blob, imgURL}) =>{
                setImgSrc(imgURL);
            });
        }
    }

    return <>
        {props.allowResize && <Form.Group controlId="resizeImage">
            <Form.Label>Resizing:</Form.Label>
            <Form.Control type="range" 
                min={10} 
                max={100} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{
                    const value = parseInt(e.target.value);
                    setOrientation(value, e);
                }}
                value={orientation}
            ></Form.Control>
            <p>{orientation} / 100 %</p>
        </Form.Group>}
        <div style={{
            maxWidth: '100%',
            maxHeight: '100%',
            overflowX: 'scroll',
            overflowY: 'hidden',
        }}>
            <div className="pt-3" style={{
                width: originalImageRef.current?.width,
                height: originalImageRef.current?.height,
            }}>
                <ReactCrop crop={crop}
                    onChange={(_,percentageCrop) => setCrop(percentageCrop)}
                    onComplete={(crop) => setCompletedCrop(crop)}
                    circularCrop={props.roundedCircle}
                    aspect={aspect}
                >
                    <Image 
                        alt="crop result"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        ref={imageRef}
                    ></Image>
                </ReactCrop>
            </div>
        </div>
    </>
}