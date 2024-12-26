import { useNavigation, useSearchParams } from "react-router-dom";

function PaymentSuccess() {
  const params = useSearchParams();
  console.log(params);
  return (
    <>
      <div>Payment Success</div>
      <div>
        <p>Metadata</p>
      </div>
    </>
  );
}

export default PaymentSuccess;
