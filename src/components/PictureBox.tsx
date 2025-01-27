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
  };

  // const images = {
  //   image1: new URL("../assets/rest-images/01.jpg", import.meta.url).href,
  //   image2: new URL("../assets/rest-images/02.jpg", import.meta.url).href,
  //   image3: new URL("../assets/rest-images/03.jpg", import.meta.url).href,
  // };
  return (
    <>
      <div className="picture-box"
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <Slider className="slider" {...settings}>
          {/* <img src={images.image1} alt="" className="slider-img" />
          <img src={images.image2} alt="" className="slider-img" />
          <img src={images.image3} alt="" className="slider-img" /> */}
          {
            [...Array(55).keys()].map(item => (
              <>
                <img 
                  src={ new URL(`../assets/rest-images/${item < 10 ? "0" + "item" : item }.jpg`, import.meta.url).href} 
                  alt="" 
                  style={{width: "100%", height: "100%"}}
                  className="slider-img" 
                />
              </>
            ))
          }
        </Slider>
      </div>
    </>
  );
}

export default PictureBox;
