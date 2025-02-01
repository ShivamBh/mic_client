import { useNavigation, useSearchParams } from "react-router-dom";
import "../payment-success.css";

function PaymentSuccess() {
  const params = useSearchParams();

  const image = {
    src: new URL("../assets/success.webp", import.meta.url).href,
  };

  return (
    <>
      <div className="success-wrapper">
        <div className="header">
          <h1>Your payment has been successfully processed.</h1>
        </div>
        <div className="image">
          <img src={image.src} alt="Line art of a waterfall" />
        </div>
        <div className="footer">
          <p>Thank you for your support!</p>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
