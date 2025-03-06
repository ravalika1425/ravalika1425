import React, { useState } from 'react';
interface CarouselProps {
    images: string[];
  }
  
  const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log("Images : ", images)

  const goToNextSlide = () => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
  };

  const goToPrevSlide = () => {
    const nextIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(nextIndex);
  };

  return (
    <div className="carousel">
      <style>
        {`
          .carousel {
            position: relative;
            overflow: hidden;
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
          }

          .slides {
            display: flex;
            width:600px;
          }

          .slide {
            flex: 0 0 100%;
            height: 300px; /* Adjust slide height as needed */
            background-size: cover;
            background-position: center;
            transition: transform 0.5s ease;
          }

          .slide.active {
            transform: translateX(0);
            border-radius:20px;
          }

          .prev, .next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(0, 0, 0, 0.3);
            color: white;
            border: none;
            cursor: pointer;
            padding: 10px;
            z-index: 2;
            width:43px;
            border-radius:50%;
          }

          .prev {
            left: 10px;
          }

          .next {
            right: 10px;
          }
        `}
      </style>
      <div className="slides">
        {/* {images.map((image, index) => (
         
        ))} */}
         <div
            key={currentIndex}
            className='slide active'
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          ></div>
      </div>
      <button className="prev" onClick={goToPrevSlide}>&#10094;</button>
      <button className="next" onClick={goToNextSlide}>&#10095;</button>
    </div>
  );
};

export default Carousel;
