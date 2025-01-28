import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


const imageList = () => {
  return (
    <>
      {
        
      }
    </>
  )
}

function PictureBox() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2200,
    cssEase: "ease-out",
    arrows: false
  };

  const images = {
    image1: new URL("../assets/rest-images/1.gif", import.meta.url).href,
    image2: new URL("../assets/rest-images/2.gif", import.meta.url).href,
    image3: new URL("../assets/rest-images/3.gif", import.meta.url).href,
    image4: new URL("../assets/rest-images/4.gif", import.meta.url).href,
    image5: new URL("../assets/rest-images/5.gif", import.meta.url).href,
    image6: new URL("../assets/rest-images/6.gif", import.meta.url).href,

    image7: new URL("../assets/rest-images/7.gif", import.meta.url).href,
    image8: new URL("../assets/rest-images/8.gif", import.meta.url).href,
    image9: new URL("../assets/rest-images/9.gif", import.meta.url).href,
    image10: new URL("../assets/rest-images/10.gif", import.meta.url).href,
    image11: new URL("../assets/rest-images/11.gif", import.meta.url).href,
    
    image12: new URL("../assets/rest-images/12.gif", import.meta.url).href,
    image13: new URL("../assets/rest-images/13.gif", import.meta.url).href,
    image14: new URL("../assets/rest-images/14.gif", import.meta.url).href,
    image15: new URL("../assets/rest-images/15.gif", import.meta.url).href,
    image16: new URL("../assets/rest-images/16.gif", import.meta.url).href,

    
  };
  return (
    <>
      <div className="picture-box"
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <Slider className="slider" {...settings}>
          <img src={images.image1} alt="" className="slider-img" />
          <img src={images.image2} alt="" className="slider-img" />
          <img src={images.image3} alt="" className="slider-img" />
          <img src={images.image4} alt="" className="slider-img" />
          <img src={images.image5} alt="" className="slider-img" />
          <img src={images.image6} alt="" className="slider-img" />
          <img src={images.image7} alt="" className="slider-img" />
          <img src={images.image8} alt="" className="slider-img" />
          <img src={images.image9} alt="" className="slider-img" />
          <img src={images.image10} alt="" className="slider-img" />
          <img src={images.image11} alt="" className="slider-img" />
          <img src={images.image12} alt="" className="slider-img" />
          <img src={images.image13} alt="" className="slider-img" />
          <img src={images.image14} alt="" className="slider-img" />
          {/* {
            [...Array(55).keys()].map(item => (
                <img 
                  key={`image-${item}`}
                  src={ new URL(`../assets/rest-images/${item}.gif`, import.meta.url).href} 
                  alt="" 
                  style={{width: "100%", height: "100%"}}
                  className="slider-img" 
                />
            ))
          } */}
        </Slider>
      </div>
    </>
  );
}

export default PictureBox;
