import React, { useRef } from "react";
import emailjs from "emailjs-com";

export default function Subscribe() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      form.current,
      "YOUR_USER_ID"
    ).then(
      (result) => {
        alert("Subscribed!");
      },
      (error) => {
        alert("Failed to subscribe.");
      }
    );
  };

  return (
    <section className="subscribe-section">
      <h2 className="section-title">Subscribe for Updates</h2>
      <form ref={form} onSubmit={sendEmail} className="subscribe-form">
        <input
          type="email"
          name="user_email"
          placeholder="Your email"
          required
        />
        <button type="submit" className="cta-button">Subscribe</button>
      </form>
    </section>
  );
}