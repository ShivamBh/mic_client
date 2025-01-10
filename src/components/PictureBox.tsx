import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function PictureBox() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "ease-out",
  };

  const images = {
    image1: new URL("../assets/rest-images/1.png", import.meta.url).href,
    image2: new URL("../assets/rest-images/2.png", import.meta.url).href,
    image3: new URL("../assets/rest-images/3.png", import.meta.url).href,
  };
  return (
    <>
      <div className="picture-box">
        <Slider className="slider" {...settings}>
          <img src={images.image1} alt="" className="slider-img" />
          <img src={images.image2} alt="" className="slider-img" />
          <img src={images.image3} alt="" className="slider-img" />
        </Slider>
      </div>
    </>
  );
}

export default PictureBox;
