import React from "react";
import "./Features.css";
import "./Home.css";

const Features = () => {
  const featureList = [
    {
      id: 1,
      title: "Fresh & Organic Produce",
      description:
        "We offer a wide range of fresh, organic produce straight from the farm to your doorstep. Enjoy the best fruits, vegetables, and greens all year round.",
      icon: "https://tse3.mm.bing.net/th?id=OIP.bFEIC4F42ZIQqO3n9JQqXwHaE8&pid=Api&P=0&h=220",
    }, 
    // {
    //   id: 2,
    //   title: "Fast Delivery",
    //   description:
    //     "Our reliable delivery service ensures that your groceries arrive at your doorstep quickly and safely, usually within 1-2 days of your order.",
    //   icon: "https://tse1.mm.bing.net/th?id=OIP.x5zu_dLVt8ac2eh2WkykxAHaFL&pid=Api&P=0&h=220",
    // },
    {
      id: 3,
      title: "Affordable Prices",
      description:
        "We offer competitive pricing on all our products. Whether you're looking for everyday essentials or specialty items, you'll find great deals here.",
      icon: "https://tse2.mm.bing.net/th?id=OIP.wLwU-gwdtocApq3FFtHz7QAAAA&pid=Api&P=0&h=220",
    },
    {
      id: 4,
      title: "24/7 Customer Support",
      description:
        "Our dedicated customer support team is available around the clock to assist with any questions or concerns you may have about your orders or products.",
      icon: "https://tse1.mm.bing.net/th?id=OIP.YyDl0xTeGeLc5taKCX4J7AHaHa&pid=Api&P=0&h=220",
    },
   
  ];

  return (
    <div className="about" style={{ background: "#1a1a1a", minHeight: "100vh", color: "#fff" }}>
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Our Features</h1>
          <p>Why Choose Us for Your Grocery Needs</p>
        </div>
      </div>

      <div className="featured-products">
        <h2>Why Choose Us?</h2>
        <div className="category-list">
          {featureList.map((feature, index) => (
            <div key={index} className="category-card">
              <img src={feature.icon} alt={feature.title} style={{ fontSize: "3rem", marginBottom: "1rem" }} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="promotions">
        <div className="promotion-banner">
          <p>Experience the convenience and quality of shopping with us today!</p>
          {/* <button className="shop-now">Start Shopping</button> */}
        </div>
      </div>
    </div>
  );
};

export default Features;
