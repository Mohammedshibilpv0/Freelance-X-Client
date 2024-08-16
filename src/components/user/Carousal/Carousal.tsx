import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import './Carousal.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PublishProps {
    data: {
        images: string[];
    };
}

const Carousal: React.FC<PublishProps> = ({ data }) => {
    return (
        <Swiper
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="rounded-lg overflow-hidden shadow-lg"
            modules={[Navigation, Pagination, Autoplay]}
        >
            {data.images.map((image, index) => (
                <SwiperSlide key={index}>
                    <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-64 object-cover"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default Carousal;
