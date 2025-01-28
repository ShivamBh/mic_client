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

    image17: new URL("../assets/rest-images/17.gif", import.meta.url).href,
    image18: new URL("../assets/rest-images/18.gif", import.meta.url).href,
    image19: new URL("../assets/rest-images/19.gif", import.meta.url).href,
    image20: new URL("../assets/rest-images/20.gif", import.meta.url).href,
    image21: new URL("../assets/rest-images/21.gif", import.meta.url).href,
    image22: new URL("../assets/rest-images/22.gif", import.meta.url).href,

    image23: new URL("../assets/rest-images/23.gif", import.meta.url).href,
    image24: new URL("../assets/rest-images/24.gif", import.meta.url).href,
    image25: new URL("../assets/rest-images/25.gif", import.meta.url).href,
    image26: new URL("../assets/rest-images/26.gif", import.meta.url).href,
    image27: new URL("../assets/rest-images/27.gif", import.meta.url).href,
    
    image28: new URL("../assets/rest-images/28.gif", import.meta.url).href,
    image29: new URL("../assets/rest-images/29.gif", import.meta.url).href,
    image30: new URL("../assets/rest-images/30.gif", import.meta.url).href,
    image31: new URL("../assets/rest-images/31.gif", import.meta.url).href,
    image32: new URL("../assets/rest-images/32.gif", import.meta.url).href,

    image33: new URL("../assets/rest-images/33.gif", import.meta.url).href,
    image34: new URL("../assets/rest-images/34.gif", import.meta.url).href,
    image35: new URL("../assets/rest-images/35.gif", import.meta.url).href,
    image36: new URL("../assets/rest-images/36.gif", import.meta.url).href,
    image37: new URL("../assets/rest-images/37.gif", import.meta.url).href,

    image38: new URL("../assets/rest-images/38.gif", import.meta.url).href,
    image39: new URL("../assets/rest-images/39.gif", import.meta.url).href,
    image40: new URL("../assets/rest-images/40.gif", import.meta.url).href,
    image41: new URL("../assets/rest-images/41.gif", import.meta.url).href,
    image42: new URL("../assets/rest-images/42.gif", import.meta.url).href,

    image43: new URL("../assets/rest-images/43.gif", import.meta.url).href,
    image44: new URL("../assets/rest-images/44.gif", import.meta.url).href,
    image45: new URL("../assets/rest-images/45.gif", import.meta.url).href,
    image46: new URL("../assets/rest-images/46.gif", import.meta.url).href,
    image47: new URL("../assets/rest-images/47.gif", import.meta.url).href,

    image48: new URL("../assets/rest-images/48.gif", import.meta.url).href,
    image49: new URL("../assets/rest-images/49.gif", import.meta.url).href,
    image50: new URL("../assets/rest-images/50.gif", import.meta.url).href,
    image51: new URL("../assets/rest-images/51.gif", import.meta.url).href,
    image52: new URL("../assets/rest-images/52.gif", import.meta.url).href,
    image53: new URL("../assets/rest-images/53.gif", import.meta.url).href,
    image54: new URL("../assets/rest-images/54.gif", import.meta.url).href,
    image55: new URL("../assets/rest-images/55.gif", import.meta.url).href,
    
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

          <img src={images.image15} alt="" className="slider-img" />
          <img src={images.image16} alt="" className="slider-img" />
          <img src={images.image17} alt="" className="slider-img" />
          <img src={images.image18} alt="" className="slider-img" />
          <img src={images.image19} alt="" className="slider-img" />
          <img src={images.image20} alt="" className="slider-img" />
          <img src={images.image21} alt="" className="slider-img" />
          <img src={images.image22} alt="" className="slider-img" />
          <img src={images.image23} alt="" className="slider-img" />
          <img src={images.image24} alt="" className="slider-img" />
          <img src={images.image25} alt="" className="slider-img" />
          <img src={images.image26} alt="" className="slider-img" />
          <img src={images.image27} alt="" className="slider-img" />
          <img src={images.image28} alt="" className="slider-img" />

          <img src={images.image29} alt="" className="slider-img" />
          <img src={images.image30} alt="" className="slider-img" />
          <img src={images.image31} alt="" className="slider-img" />
          <img src={images.image32} alt="" className="slider-img" />
          <img src={images.image33} alt="" className="slider-img" />
          <img src={images.image34} alt="" className="slider-img" />
          <img src={images.image35} alt="" className="slider-img" />
          <img src={images.image36} alt="" className="slider-img" />
          <img src={images.image37} alt="" className="slider-img" />
          <img src={images.image38} alt="" className="slider-img" />
          <img src={images.image39} alt="" className="slider-img" />
          <img src={images.image40} alt="" className="slider-img" />
          <img src={images.image41} alt="" className="slider-img" />
          <img src={images.image42} alt="" className="slider-img" />

          <img src={images.image43} alt="" className="slider-img" />
          <img src={images.image44} alt="" className="slider-img" />
          <img src={images.image45} alt="" className="slider-img" />
          <img src={images.image46} alt="" className="slider-img" />
          <img src={images.image47} alt="" className="slider-img" />
          <img src={images.image48} alt="" className="slider-img" />
          <img src={images.image49} alt="" className="slider-img" />
          <img src={images.image50} alt="" className="slider-img" />
          <img src={images.image51} alt="" className="slider-img" />
          <img src={images.image52} alt="" className="slider-img" />
          <img src={images.image53} alt="" className="slider-img" />
          <img src={images.image54} alt="" className="slider-img" />
          <img src={images.image55} alt="" className="slider-img" />
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
