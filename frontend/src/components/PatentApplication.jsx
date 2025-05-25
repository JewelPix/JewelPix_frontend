import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatentApplication.css";

const PatentApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uploadedImage = location.state?.image || "";
  const userId = location.state?.userId || "";

  const [formData, setFormData] = useState({
    userId,
    designImage: uploadedImage,
    type: "patent",
    title: "",
    description: "",
    inventorName: "",
    country: "",
    priorityClaim: false,
    priorityDetails: {
      previousApplicationNumber: "",
      previousFilingDate: "",
      previousCountry: ""
    },
    supportingDocuments: []
  });

  const [uploadingDocuments, setUploadingDocuments] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("priorityDetails.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        priorityDetails: {
          ...prev.priorityDetails,
          [key]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/protection/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // include token if route is protected
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

  
      navigate("/thank-you", { state: { source: "patent" } });
      
    } catch (error) {
      console.error("Error submitting application:", error.message);
      alert("Failed to submit application. " + error.message);
    }
  };

  const handleBack = () => {
    navigate("/accuracycard", {
      state: {
        uploadedImages: location.state?.uploadedImages,
        scanResult: location.state?.scanResult
      }
    });
  };

  return (
    <div className="patent-form">
      <div className="patent-form-container">
        <div className="form-header">
          <button className="back-btn" onClick={handleBack}>← Back</button>
          <h2>Patent Application Form</h2>
        </div>

        <form onSubmit={handleSubmit} className="form-fields">
          <input type="text" name="title" placeholder="Design Title" value={formData.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <input type="text" name="inventorName" placeholder="Inventor Name" value={formData.inventorName} onChange={handleChange} required />
          <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />

          <div className="checkbox-wrapper">
            <input
              className="checkbox-input"
              type="checkbox"
              name="priorityClaim"
              id="priorityClaim"
              checked={formData.priorityClaim}
              onChange={handleChange}
            />
            <label htmlFor="priorityClaim">Claim Priority</label>
          </div>

          {formData.priorityClaim && (
            <>
              <input
                type="text"
                name="priorityDetails.previousApplicationNumber"
                placeholder="Previous Application Number"
                value={formData.priorityDetails.previousApplicationNumber}
                onChange={handleChange}
                required={formData.priorityClaim}
              />
              <input
                type="date"
                name="priorityDetails.previousFilingDate"
                value={formData.priorityDetails.previousFilingDate}
                onChange={handleChange}
                required={formData.priorityClaim}
              />
              <input
                type="text"
                name="priorityDetails.previousCountry"
                placeholder="Previous Country"
                value={formData.priorityDetails.previousCountry}
                onChange={handleChange}
                required={formData.priorityClaim}
              />
            </>
          )}
          <p className="note">
            Note: Ensure all information is accurate before submitting. Once submitted, you cannot edit the application.
            If you need to make changes, please contact support.
          </p>
          <p className="note">
            By submitting this application, you confirm that the design is original and does not infringe on any existing patents.
          </p>
          <p className="note">
            If you have any questions, please contact our support team at <a href="mailto:jewelpix@gmail.com<">jewelpix@gmail.com</a>.
          </p>


          <button type="submit" className="auth-btn" disabled={uploadingDocuments}>
            {uploadingDocuments ? 'Please wait...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatentApplicationForm;