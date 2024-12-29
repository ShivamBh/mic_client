import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import "../checkout.css";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(0);

  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleError = (error: any) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const fetchPaymentIntent = async () => {
    const response = await fetch(
      "http://localhost:4242/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setClientSecret(data.clientSecret);
      });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    //@ts-ignore
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the PaymentIntent and obtain clientSecret
    // const res = await fetch("/create-intent", {
    //   method: "POST",
    // });

    // const { client_secret: clientSecret } = await res.json();

    // Confirm the PaymentIntent using the details collected by the Payment Element

    // @ts-ignore
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: clientSecret,
      confirmParams: {
        return_url: "http://localhost:5173/donate/success",
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      // console.log(`Succecss`)
    }
  };

  useEffect(() => {
    console.log("amount", amount);
    fetchPaymentIntent().then((res) =>
      console.log("Finished setting up intent")
    );
  }, [amount]);

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="checkout-header">
        <h1>
          Thank you for supporting our project to slow down AI. To donate any
          amount, fill in the form below.{" "}
        </h1>
      </div>
      <div className="checkout-wrapper">
        <div className="donation-input-mobile">
          <p>Please enter donation amount</p>
          <div className="donation-amount-mobile">
            <input
              type="number"
              placeholder="amount"
              step={1}
              min={2}
              className="donation-input"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="address-wrapper">
          <div className="subheading subhead-mobile">Billing information</div>
          <AddressElement
            options={{
              mode: "billing",
              defaultValues: {
                name: "Jane Doe",
                address: {
                  line1: "Address Line 1",
                  line2: "Address Line 2",
                  city: "City Name",
                  state: "Alaska",
                  postal_code: "94080",
                  country: "US",
                },
              },
            }}
          />
        </div>
        <div className="payments-wrapper">
          <div className="subheading">Card information</div>
          <PaymentElement />
        </div>
        <div className="donation-wrapper">
          <div className="subheading">Donation amount</div>
          <div className="donation-amount">
            <input
              type="number"
              placeholder="amount"
              step={1}
              min={2}
              className="donation-input"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="donation-total">
              <p className="total-subheading">Total</p>
              <div className="total-display">
                <p>{amount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="submit-wrapper">
        <button
          className="payment-submit-mobile"
          type="submit"
          disabled={!stripe || loading}
        >
          {" "}
          Pay {amount ? `$${amount}` : ""}
        </button>

        <button
          className="payment-submit"
          type="submit"
          disabled={!stripe || loading}
        >
          Pay
        </button>
        {errorMessage && <div className="error">{errorMessage}</div>}
      </div>
    </form>
  );
};

export default CheckoutForm;
