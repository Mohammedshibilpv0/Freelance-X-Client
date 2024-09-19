import React, { useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { IoMdAddCircleOutline, IoMdClose } from 'react-icons/io';
import { postImage } from '../../../api/user/userServices';
import Loading from '../../../style/loading';
import Modal from 'react-modal';

interface ImageUploaderProps {
    images: string[];
    onImagesChange: (index: number, imageUrl: string) => void;
    onRemoveImage: (index: number) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange, onRemoveImage }) => {
    const fileInputRefs = [
        useRef<HTMLInputElement | null>(null),
    ];
    const [uploadLoading,setUploadLoading]=useState<boolean>(false)
    const [loading, setLoading] = useState<boolean[]>([false, false, false]);
    const [crop, setCrop] = useState<Crop>({ aspect: 16 / 9 });
    const [src, setSrc] = useState<string | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setSrc(reader.result as string);
                setCurrentIndex(index);
                setModalIsOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageLoaded = (image: HTMLImageElement) => {
        setImage(image);
    };

    const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx || !crop.width || !crop.height) {
                reject(new Error('Could not get canvas context or crop dimensions'));
                return;
            }

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = crop.width;
            canvas.height = crop.height;

            ctx.drawImage(
                image,
                crop.x ? crop.x * scaleX : 0,
                crop.y ? crop.y * scaleY : 0,
                crop.width ? crop.width * scaleX : 0,
                crop.height ? crop.height * scaleY : 0,
                0,
                0,
                crop.width,
                crop.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleCropComplete = async () => {
        if (image && crop.width && crop.height) {
            try {
                setUploadLoading(true)
                const croppedBlob = await getCroppedImg(image, crop);
                setLoading((prev) => {
                    const newLoading = [...prev];
                    newLoading[currentIndex!] = true;
                    return newLoading;
                });

                const data = new FormData();
                data.append('image', croppedBlob, 'cropped_image.jpg');

                const response = await postImage(data);
                if (response && response.url) {
                    setUploadLoading(false)
                    const imageUrl = response.url;

                    onImagesChange(currentIndex!, imageUrl);
                }
            } catch (error) {
                setUploadLoading(false)
                console.error('Error uploading image:', error);
            } finally {
                setUploadLoading(false)
                setLoading((prev) => {
                    const newLoading = [...prev];
                    newLoading[currentIndex!] = false;
                    return newLoading;
                });
            }
        }
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
        setSrc(null);
        setCrop({ aspect: 1 });
        setImage(null);
        setCurrentIndex(null);
    };

    const handleSubmit = async () => {
        await handleCropComplete();
        handleModalClose();
    };
    if(uploadLoading){
        return (
            <Loading/>
        )
    }

    return (
        <div className="flex gap-4">
            {fileInputRefs.map((_, index) => (
                <div key={index} className="relative">
                    <input
                        type="file"
                        ref={fileInputRefs[index]}
                        onChange={(e) => handleFileChange(e, index)}
                        className="hidden"
                    />
                    <div
                        className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
                        onClick={() => fileInputRefs[index].current?.click()}
                    >
                        {loading[index] ? (
                            <Loading />
                        ) : images[index] ? (
                            <img
                                src={images[index]}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <IoMdAddCircleOutline className="text-4xl text-gray-300" />
                        )}
                    </div>
                    {images[index] && !loading[index] && (
                        <button
                            className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-600"
                            onClick={() => onRemoveImage(index)}
                        >
                            <IoMdClose className="text-xl" />
                        </button>
                    )}
                </div>
            ))}

<Modal
    isOpen={modalIsOpen}
    onRequestClose={handleModalClose}
    contentLabel="Crop Image"
    className="fixed inset-0 flex items-center justify-center"
    overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    appElement={document.getElementById('root') || undefined}
>
    <div className="bg-white p-4 rounded-lg w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mt-5 overflow-auto">
        <h2 className="text-xl mb-4">Crop Image</h2>
        {src && (
            <ReactCrop
                src={src}
                crop={crop}
                onImageLoaded={handleImageLoaded}
                onChange={setCrop}
                className="w-full h-full"  
            />
        )}
        <div className="flex justify-end gap-2 mt-4">
            <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={handleModalClose}
            >
                Cancel
            </button>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    </div>
</Modal>

        </div>
    );
};

export default ImageUploader;