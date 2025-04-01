import React from 'react';
import './Blogs.css';

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Benefits of Eating Organic Foods",
      excerpt: "Discover the health benefits of organic produce and why it's worth the investment.",
      image: "https://tse2.mm.bing.net/th?id=OIP.7kw1ME9T2xaPZjQe3Ckj9gHaHa&pid=Api&P=0&h=220",
      date: "March 4, 2025"
    },
    {
      id: 3,
      title: "How to Store Fresh Produce to Keep It Fresh Longer",
      excerpt: "Learn the best ways to store fruits and vegetables to reduce waste and preserve freshness.",
      image: "https://tse3.mm.bing.net/th?id=OIP.syGvOauQpqie5Pnpxsr3xwAAAA&pid=Api&P=0&h=220",
      date: "March 3, 2025"
    },
    {
      id: 4,
      title: "Seasonal Fruits and Vegetables You Should Be Eating",
      excerpt: "Find out which fruits and veggies are in season this month and how to incorporate them into your meals.",
      image: "https://tse2.mm.bing.net/th?id=OIP.BpWH2L1_U52M12XHaztMrQHaEK&pid=Api&P=0&h=220",
      date: "March 2, 2025"
    },
  ];

  return (
    <div className="home">
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Our Blog</h1>
          <h2 className="hero-title">Stay Updated with Latest Food Insights</h2>
        </div>
      </header>

      <section className="featured-products">
        <h2>Latest Articles</h2>
        <div className="category-list">
          {blogPosts.map((post) => (
            <article key={post.id} className="category-card">
              <img src={post.image} alt={post.title} />
              <h3>{post.title}</h3>
              <p className='blog-excerpt'>{post.excerpt}</p>
              <div className="blog-excerpt">
                <span>{post.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="categories">
        <h2>Want to contribute?</h2>
        <div className="category-list">
          <div className="category-card">
           
            <p className='blog-excerpt'>Share your food knowledge with our community</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;