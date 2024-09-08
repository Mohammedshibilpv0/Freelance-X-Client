
interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
      onClick={onClose}
    >
      <div
        className="relative  p-4 rounded-lg"
        onClick={(e) => e.stopPropagation()} 
      >

        <img src={imageUrl} alt="Opened" className="max-w-full max-h-[80vh]" />
      </div>
    </div>
  );
};

export default ImageModal;
