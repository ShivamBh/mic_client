import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import { useMediaQuery } from 'react-responsive'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_live_iYgagXgyNiV8yH5JTNb1jrv2");

function DonatePage() {

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 800px)' })

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
            fonts: [
              {
                cssSrc: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900"
              }
            ],
            amount: 1000,
            currency: "usd",
            mode: "payment",
            appearance: {
              labels: "floating",
              rules: {
                ".Label": {
                  color: "black",
                  fontSize: "0",
                  fontFamily: 'Inter',
                  padding: "4px 2px"
                },
                ".Block": {
                  width: "100%",
                },
                ".Input": {
                  border: "2px solid black",
                  borderRadius: "none",
                  display: "inline-block",
                  width: "100%",
                  fontSize: isTabletOrMobile ? "22px" : "24px",
                  marginBottom: isTabletOrMobile ? "16px" : "8px",
                  color: "black",
                  fontFamily: "Inter",
                  padding: "8px"

                },
                ".Input::placeholder": {
                  color: "black",
                },
                ".DropdownItem": {
                  color: "black"
                },
                ".Dropdown": {
                  color: "black"
                },
                ".PickerItem": {
                  color: "black"
                }
              },
            },
          }}
        >
          <CheckoutForm />
        </Elements>
        <div className="donate-disclaimer">
        <p>
        *Donations made will exclusively fund the economy of Tara Kelton’s project and not Fondazione MACTE
        </p>
      </div>
      </div>
      
    </>
  );
}

export default DonatePage;
