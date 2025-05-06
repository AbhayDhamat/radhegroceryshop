
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Home.css";

const Home = () => {
  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "https://wallpaperaccess.com/full/1652237.jpg",
    "https://static.vecteezy.com/system/resources/previews/029/629/089/non_2x/studio-shot-of-various-fruits-and-vegetables-isolated-on-black-background-top-view-high-resolution-products-free-photo.jpeg",
    "https://food.amerikanki.com/wp-content/uploads/2020/11/Dairy-Products-Infographics.jpg",
  ];

  // Move to next image
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Move to previous image
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="home">
      <header className="hero">
        <div className="slider">
          <img
            src={images[currentIndex]}
            alt="Slider Image"
            className="slider-image"
          />
          <div className="slider-controls">
            <button className="prev" onClick={prevSlide}>
              &#10094;
            </button>
            <button className="next" onClick={nextSlide}>
              &#10095;
            </button>
          </div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Radhe Grocery Shop</h1>
          <h2 className="hero-title">Fresh Products Delivered to Your Doorstep</h2>
         
        </div>
      </header>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="category-list">
          <div className="category-card">
            <img src="https://tse1.mm.bing.net/th?id=OIP.4cCTsrDPqZ8ylOfBLY5y2wHaGL&pid=Api&P=0&h=220" alt="Product 1" />
            <h3>Fruits</h3>
            
          </div>
          <div className="category-card">
            <img src="https://tse2.mm.bing.net/th?id=OIP.j59FLmPlWSURUzTyozek9gHaE8&pid=Api&P=0&h=220" alt="Product 2" />
            <h3>Vegetables</h3>
            
          </div>
          <div className="category-card">
            <img src="https://tse4.mm.bing.net/th?id=OIP.-qtYY9ZkmNAv2s0Xvv-5UAHaEh&pid=Api&P=0&h=220" alt="Product 3" />
            <h3>DairyProduct</h3>
            
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Shop by Categories</h2>
        <div className="category-list">
          <Link to="/fruits" className="category-card">
            <img src="https://wallpaperaccess.com/full/1101708.jpg" alt="Fruits" />
            <h3>Fruits</h3>
          </Link>
          <Link to="/vegetables" className="category-card">
            <img src="https://tse3.mm.bing.net/th?id=OIP.TZTSdAmceXmvPPqo4lAcZwHaE7&pid=Api&P=0&h=220" alt="Vegetables" />
            <h3>Vegetables</h3>
          </Link>
          <Link to="/milk" className="category-card">
            <img src="https://tse4.mm.bing.net/th?id=OIP.s3zW74QJcWX5v7v30G2-lwHaHa&pid=Api&P=0&h=220" alt="Dairy" />
            <h3>Dairy</h3>
          </Link>
        </div>
      </section>

      {/* Promotions Section */}
      

      {/* Footer */}
     
    </div>
  );
};

export default Home;
