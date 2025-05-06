// import React, { createContext, useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from './components/Footer';
// import Home from "./components/Home";
// import About from "./components/About";
// import Features from "./components/Features";
// import Blogs from "./components/Blogs";
// import Contact from "./components/Contact";
// import Fruits from "./components/Fruits";
// import Vegetables from "./components/Vegetables";
// import Dairy from "./components/Dairy";
// import LoginPage from "./components/LoginPage";
// import Signup from "./components/Signup";
// import FirstPage from "./components/FirstPage";
// import Admin from "./components/Admin";
// import Order from "./components/Order";
// import AdminOrders from "./components/AdminOrders";
// import Profile from "./components/Profile";
// import ForgotPassword from "./components/ForgotPassword";
// import ResetPassword from "./components/ResetPassword";
// import Payment from "./components/Payment";

// //import "./App.css";

// // ✅ Context for managing selected products
// export const OrderContext = createContext();

// // ✅ Layout for pages WITH the Navbar and Footer (except /order, /login, /signup, /forget, /reset-password)
// const MainLayout = ({ children }) => (
//   <>
//     <Header />
//     <main>{children}</main>
//     <Footer /> {/* Footer added here */}
//   </>
// );

// // ✅ Layout for pages WITHOUT Header and Footer (login, signup, forget, reset-password, firstpage)
// const NoHeaderFooterLayout = ({ children }) => <main>{children}</main>;

// // ✅ Layout for pages WITHOUT Footer (only header for pages like /order)
// const WithoutFooterLayout = ({ children }) => (
//   <>
//     <Header />
//     <main>{children}</main>
//   </>
// );

// const App = () => {
//   const [orderItems, setOrderItems] = useState([]);

//   // Function to add items to the order
//   const addToOrder = (item) => {
//     setOrderItems((prevItems) => {
//       const existingItem = prevItems.find((i) => i._id === item._id);
//       if (existingItem) {
//         return prevItems.map((i) =>
//           i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i
//         );
//       }
//       return [...prevItems, item];
//     });
//   };

//   return (
//     <OrderContext.Provider value={{ orderItems, addToOrder }}>
//       <Router>
//         <Routes>
//           {/* Routes without Header and Footer (Login, Signup, Forget, Reset Password, FirstPage) */}
//           <Route path="/login" element={<NoHeaderFooterLayout><LoginPage /></NoHeaderFooterLayout>} />
//           <Route path="/signup" element={<NoHeaderFooterLayout><Signup /></NoHeaderFooterLayout>} />
//           <Route path="/forget" element={<NoHeaderFooterLayout><ForgotPassword /></NoHeaderFooterLayout>} />
//           <Route path="/reset-password" element={<NoHeaderFooterLayout><ResetPassword /></NoHeaderFooterLayout>} />
//           <Route path="/" element={<NoHeaderFooterLayout><FirstPage /></NoHeaderFooterLayout>} />

//           {/* Routes with Header and Footer (Home, About, Contact, etc.) */}
//           <Route
//             path="/*"
//             element={
//               <MainLayout>
//                 <Routes>
//                   <Route path="/home" element={<Home />} />
//                   <Route path="/about" element={<About />} />
//                   <Route path="/features" element={<Features />} />
//                   <Route path="/blogs" element={<Blogs />} />
//                   <Route path="/contact" element={<Contact />} />
//                   <Route path="/fruits" element={<Fruits />} />
//                   <Route path="/vegetables" element={<Vegetables />} />
//                   <Route path="/milk" element={<Dairy />} />
//                   <Route path="/admin" element={<Admin />} />
//                   <Route path="/adminorders" element={<AdminOrders />} />
//                   <Route path="/profile" element={<Profile />} />
//                   <Route path="/payment" element={<Payment />} />
                  
//                 </Routes>
//               </MainLayout>
//             }
//           />

//           {/* Routes with Header but without Footer (Order page) */}
//           <Route
//             path="/order"
//             element={
//               <WithoutFooterLayout>
//                 <Order />
//               </WithoutFooterLayout>
//             }
//           />
//         </Routes>
//       </Router>
//     </OrderContext.Provider>
//   );
// };

// export default App;

import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"; // Import loadStripe to load Stripe.js

import Header from "./components/Header";
import Footer from './components/Footer';
import Home from "./components/Home";
import About from "./components/About";
import Features from "./components/Features";
import Blogs from "./components/Blogs";
import Contact from "./components/Contact";
import Fruits from "./components/Fruits";
import Vegetables from "./components/Vegetables";
import Dairy from "./components/Dairy";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import FirstPage from "./components/FirstPage";
import Admin from "./components/Admin";
import Order from "./components/Order";
import AdminOrders from "./components/AdminOrders";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Payment from "./components/Payment";
import VerifyOtpPage from "./components/VerifyOtpPage";
import AdminContacts from "./components/AdminContacts";


// Initialize Stripe with your public key
const stripePromise = loadStripe('pk_test_51R67GI4QoKRR4mf5MMOV5YfM572NfqUvrD8SWXVRR5mXavsk6kDt05b1yAwQJYLVFcgDdPZQSAS88jdiVr5cmFPH00mFRHUDPe'); // Replace with your actual public key from Stripe

// ✅ Context for managing selected products
export const OrderContext = createContext();

// ✅ Layout for pages WITH the Navbar and Footer (except /order, /login, /signup, /forget, /reset-password)
const MainLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

// ✅ Layout for pages WITHOUT Header and Footer (login, signup, forget, reset-password, firstpage)
const NoHeaderFooterLayout = ({ children }) => <main>{children}</main>;

// ✅ Layout for pages WITHOUT Footer (only header for pages like /order)
const WithoutFooterLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
  </>
);

const App = () => {
  const [orderItems, setOrderItems] = useState([]);

  // Function to add items to the order
  const addToOrder = (item) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === item._id);
      if (existingItem) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
  };

  return (
    <OrderContext.Provider value={{ orderItems, addToOrder }}>
      {/* Wrap your entire Router with the Elements provider */}
      <Elements stripe={stripePromise}>
        <Router>
          <Routes>
            {/* Routes without Header and Footer (Login, Signup, Forget, Reset Password, FirstPage) */}
            <Route path="/login" element={<NoHeaderFooterLayout><LoginPage /></NoHeaderFooterLayout>} />
            <Route path="/signup" element={<NoHeaderFooterLayout><Signup /></NoHeaderFooterLayout>} />
            <Route path="/forget" element={<NoHeaderFooterLayout><ForgotPassword /></NoHeaderFooterLayout>} />
            <Route path="/verify-otp"element={<NoHeaderFooterLayout><VerifyOtpPage /></NoHeaderFooterLayout>} />
            <Route path="/reset-password" element={<NoHeaderFooterLayout><ResetPassword /></NoHeaderFooterLayout>} />
            
            <Route path="/" element={<NoHeaderFooterLayout><FirstPage /></NoHeaderFooterLayout>} />

            {/* Routes with Header and Footer (Home, About, Contact, etc.) */}
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/fruits" element={<Fruits />} />
                  <Route path="/vegetables" element={<Vegetables />} />
                  <Route path="/milk" element={<Dairy />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/adminorders" element={<AdminOrders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admincontacts" element={<AdminContacts />} />
                  
                  
                </Routes>
              </MainLayout>
            } />
<Route path="/payment" element={<Payment />} />
            {/* Routes with Header but without Footer (Order page) */}
            <Route path="/order" element={<WithoutFooterLayout><Order /></WithoutFooterLayout>} />
          </Routes>
        </Router>
      </Elements>
    </OrderContext.Provider>
  );
};

export default App;

