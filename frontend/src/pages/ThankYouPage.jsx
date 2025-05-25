import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./styles/ThankYouPage.css";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sourceType, setSourceType] = useState('order'); // Default to order

  useEffect(() => {
    // Check if we have state information about where the user came from
    if (location.state && location.state.source) {
      setSourceType(location.state.source);
    }
  }, [location]);

  const handleReturnHome = () => {
    navigate("/");
  };

  // Render different content based on the source
  const renderContent = () => {
    switch (sourceType) {
      case 'patent':
        return (
          <>
            <h2>Application Submitted!</h2>
            <p>Thank you for submitting your patent application. Our team will review your submission and get back to you shortly.</p>
            <p>You will receive updates about your application status via email.</p>
          </>
        );
      case 'order':
      default:
        return (
          <>
            <h2>Thank You for Your Order!</h2>
            <p>Your order has been successfully placed. We will notify you once it's on its way.</p>
          </>
        );
    }
  };

  return (
    <div className="thank-you-page">
      {renderContent()}
      <button onClick={handleReturnHome} className="return-home-btn">
        Return to Home
      </button>
    </div>
  );
};

export default ThankYouPage;