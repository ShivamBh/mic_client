import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_PSssaMY1e9Fli0ZChMNzQoSp");

function DonatePage() {
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
  }, []);

  // const appearance = {
  //   theme: "flat",
  //   variables: {
  //     fontFamily: ' "Gill Sans", sans-serif',
  //     fontLineHeight: "1.5",
  //     borderRadius: "10px",
  //     colorBackground: "#F6F8FA",
  //     accessibleColorOnColorPrimary: "#262626",
  //   },
  //   rules: {
  //     ".Block": {
  //       backgroundColor: "var(--colorBackground)",
  //       boxShadow: "none",
  //       padding: "12px",
  //     },
  //     ".Input": {
  //       padding: "12px",
  //     },
  //     ".Input:disabled, .Input--invalid:disabled": {
  //       color: "lightgray",
  //     },
  //     ".Tab": {
  //       padding: "10px 12px 8px 12px",
  //       border: "none",
  //     },
  //     ".Tab:hover": {
  //       border: "none",
  //       boxShadow:
  //         "0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
  //     },
  //     ".Tab--selected, .Tab--selected:focus, .Tab--selected:hover": {
  //       border: "none",
  //       backgroundColor: "#fff",
  //       boxShadow:
  //         "0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
  //     },
  //     ".Label": {
  //       fontWeight: "500",
  //     },
  //   },
  // };

  return (
    <>
      <div className="donate-container">
        <Elements
          stripe={stripePromise}
          options={{
            amount: 1000,
            currency: "usd",
            mode: "payment",
            appearance: {
              rules: {
                ".Label": {
                  color: "black",
                  fontSize: "0",
                },
                ".Block": {
                  width: "100%",
                },
                ".Input": {
                  border: "2px solid black",
                  borderRadius: "none",
                  display: "inline-block",
                  width: "100%",
                },
                ".Input::placeholder": {
                  color: "black",
                },
              },
            },
          }}
        >
          <CheckoutForm />
        </Elements>
      </div>
    </>
  );
}

export default DonatePage;
