import React from 'react';
import { Carousel, Card } from 'react-bootstrap';


const Slider = ({ images }: { images: string[] }) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <Card style={{ width: '60rem', marginLeft: "40px" }}>
            <Card.Img variant="top" src={image} style={{ height: '400px' }} />
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Slider;
