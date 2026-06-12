import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import '../checkout.css';
import { donationSummary } from '../utils/donation-summary';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState('');

  const [clientSecret, setClientSecret] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(true);

  const handleError = (error: any) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const fetchPaymentIntent = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe) return;

    setLoading(true);

    //@ts-ignore
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // @ts-ignore
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required',
      confirmParams: {
        return_url: import.meta.env.VITE_SITE_URL,
        receipt_email: email,
        payment_method_data: {
          billing_details: {
            email,
          },
        },
      },
    });

    if (error) {
      handleError(error);
    } else {
      setLoading(false);
      setSucceeded(true);
    }
  };

  useEffect(() => {
    if (amount <= 0) return;
    fetchPaymentIntent();
  }, [amount]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="checkout-wrapper">
          {/* Donation amount — mobile */}
          <div className="donation-input-mobile">
            <p>Donation amount</p>
            <div className="donation-amount-mobile">
              <input
                type="number"
                step={1}
                min={1}
                className="donation-input"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Donation amount — desktop */}
          <div className="donation-wrapper">
            <div className="subheading">Donation amount</div>
            <div className="donation-amount">
              <input
                type="number"
                step={1}
                min={1}
                className="donation-input"
                style={{ backgroundColor: '#EEEDED' }}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Billing info */}
          <div className="address-wrapper">
            <div className="subheading subhead-mobile">Billing information</div>
            <AddressElement options={{ mode: 'billing' }} />
          </div>

          {/* Card info */}
          <div className="payments-wrapper">
            <div className="subheading subhead-mobile subhead-card">Card information</div>
            <PaymentElement />
          </div>

          {/* Email */}
          <div className="email-wrapper">
            <div className="subheading subhead-mobile">Email</div>
            <input
              type="email"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
            />
          </div>
        </div>

        <div className="submit-wrapper">
          <button className="payment-submit-mobile" type="submit" disabled={!stripe || loading}>
            Pay {amount ? `$${amount}` : ''}
          </button>
          <button className="payment-submit" type="submit" disabled={!stripe || loading}>
            Pay {amount ? `$${amount}` : ''}
          </button>
          {errorMessage && <div className="error">{errorMessage}</div>}
        </div>
      </form>

      {succeeded ? (
        <div className="checkout-success">
          <p>{donationSummary(amount)}</p>
        </div>
      ) : null}
    </div>
  );
};

export default CheckoutForm;
