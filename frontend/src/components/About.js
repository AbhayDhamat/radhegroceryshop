
// export default About;
import React from "react";
import "./About.css";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api'; // Import Google Map components

const About = () => {
  const location = {
    lat: 23.0225,  // Ahmedabad, India Latitude
    lng: 72.5714,  // Ahmedabad, India Longitude
  };

  return (
    <div className="about" style={{ background: "#1a1a1a", minHeight: "100vh", color: "#fff" }}>
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">About Us</h1>
          <p>Your trusted source for fresh groceries</p>
        </div>
      </div>

      <div className="featured-products">
        <h2>Our Story</h2>
        <div className="category-list">
          <div className="category-card">
            <h3>Our Mission</h3>
            <p>To provide fresh, high-quality groceries to our community while maintaining exceptional service standards.</p>
          </div>
          <div className="category-card">
            <h3>Our Vision</h3>
            <p>To become the most trusted and preferred grocery store in our region, known for quality and customer satisfaction.</p>
          </div>
          <div className="category-card">
            <h3>Our Values</h3>
            <p>Quality, Integrity, Customer Service, Community, and Sustainability guide everything we do.</p>
          </div>
        </div>
      </div>

      <div className="categories">
        <h2>Why Choose Us?</h2>
        <div className="category-list">
          <div className="category-card">
            <h3>Fresh Products</h3>
            <p>We source our products directly from local farmers and trusted suppliers.</p>
          </div>
          <div className="category-card">
            <h3>Quality Service</h3>
            <p>Our dedicated team ensures you have the best shopping experience.</p>
          </div>
          <div className="category-card">
            <h3>Fast Delivery</h3>
            <p>We ensure your groceries reach you fresh and on time.</p>
          </div>
        </div>
      </div>

      <div className="promotions">
        <div className="promotion-banner">
          <p>Join us in our journey to provide the best grocery experience!</p>
          {/* <button className="shop-now">Shop Now</button> */}
        </div>
      </div>

      {/* Adding the Google Map here */}
      <div className="map-container" style={{ marginTop: "30px", width: '100%', height: '400px' }}>
        <LoadScript googleMapsApiKey="AIzaSyDHdhkEYE7X_SxrM6i_APBv96nNrjjhv7A">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={location}  // The map's center coordinates (Ahmedabad)
            zoom={12}  // Set zoom level
          >
            <MarkerF position={location} />
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default About;
