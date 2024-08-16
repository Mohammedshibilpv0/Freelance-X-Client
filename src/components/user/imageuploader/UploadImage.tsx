import React, { useRef, useState } from "react";
import { IoMdAddCircleOutline, IoMdClose } from "react-icons/io";
import { postImage } from "../../../api/user/userServices";
import Loading from "../../../style/loading";

interface ImageUploaderProps {
    images: string[];
    onImagesChange: (index: number, imageUrl: string) => void;
    onRemoveImage: (index: number) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange, onRemoveImage }) => {
    const fileInputRefs = [
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
    ];

    const [loading, setLoading] = useState<boolean[]>([false, false, false]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const data = new FormData();
            data.append("image", file);

            setLoading((prev) => {
                const newLoading = [...prev];
                newLoading[index] = true;
                return newLoading;
            });

            try {
                const response = await postImage(data);
                if (response && response.data) {
                    const imageUrl = response.data.url;
                    onImagesChange(index, imageUrl);
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            } finally {
                setLoading((prev) => {
                    const newLoading = [...prev];
                    newLoading[index] = false;
                    return newLoading;
                });
            }
        }
    };

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
                            <Loading /> // Render loading component while image is being uploaded
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
        </div>
    );
};

export default ImageUploader;
