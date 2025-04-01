

// // import React, { useState } from 'react';
// // import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
// // import { useLocation } from 'react-router-dom'; // To get the totalAmount passed from the Order page
// // import "./Payment.css"

// // const Payment = () => {
// //   const [loading, setLoading] = useState(false);
// //   const [errorMessage, setErrorMessage] = useState(null);
  
// //   const location = useLocation();
// //   const totalAmount = location.state?.totalAmount || 0; // Retrieving totalAmount passed from Order.js

// //   const stripe = useStripe();
// //   const elements = useElements();

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();

// //     if (!stripe || !elements) {
// //       return; // Stripe.js hasn't loaded yet
// //     }

// //     setLoading(true);

// //     try {
// //       // Step 1: Create PaymentIntent from the backend
// //       const response = await fetch('http://localhost:5000/create-payment-intent', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ amount: totalAmount }), // Pass the total amount from the order
// //       });

// //       const { clientSecret, error } = await response.json();

// //       if (error) {
// //         setErrorMessage(error);
// //         setLoading(false);
// //         return;
// //       }

// //       // Step 2: Confirm the payment with the card details
// //       const result = await stripe.confirmCardPayment(clientSecret, {
// //         payment_method: {
// //           card: elements.getElement(CardElement),
// //         },
// //       });

// //       if (result.error) {
// //         setErrorMessage(result.error.message);
// //       } else {
// //         if (result.paymentIntent.status === 'succeeded') {
// //           alert('Payment Successful!');
// //         }
// //       }

// //     } catch (error) {
// //       setErrorMessage('Payment failed. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Complete Your Payment</h2>
// //       <form onSubmit={handleSubmit}>
// //         <div>
// //           <CardElement /> {/* Stripe card element to collect card info */}
// //         </div>
// //         {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
// //         <button type="submit" disabled={!stripe || loading}>
// //           {loading ? 'Processing...' : 'Pay Now'}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Payment;
// import React, { useState } from 'react';
// import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
// import { useLocation } from 'react-router-dom'; // To get the totalAmount passed from the Order page
// import './Payment.css'; // Import the CSS file

// const Payment = () => {
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
  
//   const location = useLocation();
//   const totalAmount = location.state?.totalAmount || 0; // Retrieving totalAmount passed from Order.js

//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) {
//       return; // Stripe.js hasn't loaded yet
//     }

//     setLoading(true);

//     try {
//       // Step 1: Create PaymentIntent from the backend
//       const response = await fetch('http://localhost:5000/create-payment-intent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ amount: totalAmount }), // Pass the total amount from the order
//       });

//       const { clientSecret, error } = await response.json();

//       if (error) {
//         setErrorMessage(error);
//         setLoading(false);
//         return;
//       }

//       // Step 2: Confirm the payment with the card details
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//         },
//       });

//       if (result.error) {
//         setErrorMessage(result.error.message);
//       } else {
//         if (result.paymentIntent.status === 'succeeded') {
//           alert('Payment Successful!');
//         }
//       }

//     } catch (error) {
//       setErrorMessage('Payment failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="payment-page">
//       <h2>Complete Your Payment</h2>
//       <form onSubmit={handleSubmit} className="payment-container">
//         <div className="card-element">
//           <CardElement /> {/* Stripe card element to collect card info */}
//         </div>
//         {errorMessage && <div className="error-message">{errorMessage}</div>}
//         <button type="submit" className={loading ? 'processing-btn' : 'pay-now-btn'} disabled={!stripe || loading}>
//           {loading ? 'Processing...' : `Pay ₹${totalAmount}`} {/* Convert paise to INR */}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Payment;
import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State for success message modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  
  const location = useLocation();
  const totalAmount = location.state?.totalAmount || 0; // Retrieving totalAmount passed from Order.js

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js hasn't loaded yet
    }

    setLoading(true);

    try {
      // Step 1: Create PaymentIntent from the backend
      const response = await fetch('http://localhost:5000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        setErrorMessage(error);
        setLoading(false);
        return;
      }

      // Step 2: Confirm the payment with the card details
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setPaymentSuccess(true); // Payment successful
          setIsModalOpen(true); // Open the success modal
        }
      }

    } catch (error) {
      setErrorMessage('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Optionally reset the payment state after modal is closed
    setPaymentSuccess(false);
  };

  return (
    <div className='payment'>
    <div className="payment-page">
     
      <h2>Complete Your Payment</h2>
      <form onSubmit={handleSubmit} className="payment-container">
        <div className="card-element">
          <CardElement />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit" className={loading ? 'processing-btn' : 'pay-now-btn'} disabled={!stripe || loading}>
          {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
        </button>
      </form>

      {/* Success Popup Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Payment Successful!</h3>
            <p>Your payment of ₹{totalAmount} was successful.</p>
            <button onClick={closeModal} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Payment;
