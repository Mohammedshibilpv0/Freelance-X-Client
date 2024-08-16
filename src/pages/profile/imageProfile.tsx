import React, { useState, ChangeEvent, useEffect } from 'react';
import { editProfileImage } from '../../api/user/userServices';
import toastr from 'toastr';
import Store from '../../store/store';
import { FcEditImage } from 'react-icons/fc';

const ImageProfile: React.FC = () => {
  const user = Store((config) => config.user);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user.profile);
  const [changeImage, setChangeImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { updateUser } = Store();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setChangeImage(true);
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Revoke previous object URL to avoid memory leaks
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!changeImage) {
      toastr.error('Please select an image.');
      return;
    }

    if (!file) return;

    const userData = localStorage.getItem('userProfile');
    const formData = new FormData();
    formData.append('file', file);
    if (userData) {
      formData.append('Data', userData);
    }

    setIsLoading(true);

    try {
      const response = await editProfileImage(formData);
      if (response.message) {
        toastr.success(response.message);
        setPreviewUrl(response.url);
        updateUser('profile', response.url.trim());

        // Reset file state and preview URL
        setFile(null);
        setChangeImage(false);
      } else {
        toastr.error('An error occurred while uploading the image.');
      }
    } catch (error) {
      toastr.error('An error occurred while uploading the image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mb-6">
      <div
        className="relative w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${previewUrl || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'})`,
        }}
      >
        <div className="absolute bottom-0 right-0 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center">
          <input
            type="file"
            name="profile"
            id="upload_profile"
            hidden
            onChange={handleFileChange}
          />
          <FcEditImage
            size={30}
            className="cursor-pointer"
            onClick={() => document.getElementById('upload_profile')?.click()}
          />
        </div>
      </div>
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Upload'}
      </button>
    </div>
  );
};

export default ImageProfile;
