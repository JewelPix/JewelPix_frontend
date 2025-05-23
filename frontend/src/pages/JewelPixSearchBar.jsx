import React, { useState, useContext } from "react";
import { ProductContext } from "../context/ProductContext.jsx";
import { Form, InputGroup, Modal, Button } from "react-bootstrap";
import { Search, Camera } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/JewelPixSearchBar.css";

const JewelPixSearchBar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setProducts } = useContext(ProductContext);
  const navigate = useNavigate();

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => {
    setShowPopup(false);
    setImage(null);
  };

  const handleTextSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/search?query=${searchQuery}`);
      setProducts(res.data); // Update products in context
      navigate(`/?query=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Text search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleTextSearch();
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageSearch = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post(
        `https://tired-kimmie-gajala-sonic-solutions-2de32759.koyeb.app/api/visual-search`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProducts(res.data.results); // Update products in context
      handleClosePopup();
    } catch (error) {
      console.error("Image search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileUploadInput").click();
  };

  return (
    <>
      <div className="search-container">
        <h1 className="jewelpix-title">JewelPix</h1>
        <p className="jewelpix-tagline">Snap & find the perfect jewelry instantly</p>
        <InputGroup className="search">
          <InputGroup.Text className="search-icon" onClick={handleTextSearch}>
            <Search size={24} color="#FFD700" />
          </InputGroup.Text>
          <Form.Control
            placeholder="search any jewellery......."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <InputGroup.Text className="camera-icon" onClick={handleOpenPopup}>
            <Camera size={24} color="#FFD700" />
          </InputGroup.Text>
        </InputGroup>
      </div>

      <input
        type="file"
        id="fileUploadInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Modal show={showPopup} onHide={handleClosePopup} centered>
        <Modal.Body>
          <div className="popup-content d-flex flex-column align-items-center">
            <Button className="popup-button mb-2" onClick={triggerFileInput}>
              {image ? "Change Image" : "Upload Image 🖼️"}
            </Button>

            {image && (
              <div style={{ textAlign: "center" }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
              </div>
            )}

            <Button
              className="popup-button mb-2"
              onClick={handleImageSearch}
              disabled={!image || loading}
            >
              {loading ? "Searching..." : "Search by Image"}
            </Button>

            <Button className="done-button" onClick={handleClosePopup}>
              Done
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default JewelPixSearchBar;