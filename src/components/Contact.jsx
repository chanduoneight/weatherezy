import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a message sending process
    setMessageSent(true);
    // Reset the form after submission (optional)
    e.target.reset();
    setTimeout(() => setMessageSent(false), 5000); // Hide the message after 5 seconds
  };

  return (
    <>
      <h2 className="contact-heading">Contact Us</h2>
      <div className="contact-page">
        <div className="container">
          {/* Contact Information */}
          {/* Contact Form */}
          <div className="form-section">
            <h4 className="contact-info-heading">Send Us a Message</h4>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
            {messageSent && (
              <div className="alert alert-success mt-3" role="alert">
                Your message has been sent successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
