import React from 'react';
import { Carousel } from 'antd';
import image1 from '../../asset/image1.jpg';
import image2 from '../../asset/image2.png';
import image3 from '../../asset/image3.jpg';
import image4 from '../../asset/image4.jpg';
import 'antd/dist/reset.css';
import { CSSProperties } from 'react';
const contentStyle: CSSProperties = {
  paddingTop: '30px',
  marginBottom: '30px',
  height: '500px',
  width: '100%',
  objectFit: 'cover',
};

const Cover: React.FC = () => {
  return (
    <div>
      <Carousel
        arrows
        infinite={false}
      >
        <div>
          <img src={image1} alt="Slide 1" style={contentStyle} />
        </div>
        <div>
          <img src={image2} alt="Slide 2" style={contentStyle} />
        </div>
        <div>
          <img src={image3} alt="Slide 3" style={contentStyle} />
        </div>
        <div>
          <img src={image4} alt="Slide 4" style={contentStyle} />
        </div>
      </Carousel>
    </div>
  );
};

export default Cover;
