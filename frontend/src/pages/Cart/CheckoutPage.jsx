// import React, { useContext, useMemo, useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Cart from './Cart';
// import './Cart.css';
// import { CartContext } from '../../context/CartContext';
// import AddressPopup from '../../components/AddressPopup.jsx';
// import { useNavigate } from 'react-router-dom';
// import { ClipLoader } from "react-spinners";


// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const { cartItems, removeFromCart, updateCartItemQuantity, setCartItems } = useContext(CartContext);

//   const [address, setAddress] = useState(null);
//   const [showAddressPopup, setShowAddressPopup] = useState(false);
//   const [loading, setLoading] = useState(false); // Loading state
//   // Calculate the total price
//   const totalPrice = useMemo(() => {
//     return cartItems.reduce((acc, item) => {
//       const cleanPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
//       const quantity = parseInt(item.quantity) || 0;
//       return acc + cleanPrice * quantity;
//     }, 0);
//   }, [cartItems]);

//   const discount = 5649;
//   const deliveryCharges = 80;
//   const protectPromiseFee = 9;
//   const finalAmount = totalPrice > 0 ? totalPrice - discount + deliveryCharges + protectPromiseFee : 0;

//   const handlePlaceOrder = async () => {
//     setLoading(true);
//     if (!address) {
//       alert("Please add a delivery address.");
//       return;
//     }

//     // const userId = localStorage.getItem("userId"); 


//     // if (!userId) {
//     //   alert("User not logged in.");
//     //   navigate("/login");
//     //   return;
//     // }

//     const orderData = {
//       // userId: userId,
//       items: cartItems.map(item => ({
//         name: item.name,
//       })),
//       // You can remove userId if not required
//       orderId: `ORD-${Date.now()}`,
//     };

//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(orderData),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed to place the order");

//       // Clear the cart after successful order
//       setCartItems([]);

//       // Navigate to Thank You page
//       navigate("/thank-you");
//     } catch (err) {
//       console.error("Error placing order:", err);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false); // Stop loading after order is placed or failed
//     }
//   };


//   // Fetch address on load
//   useEffect(() => {
//     const fetchAddress = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         const data = await res.json();
//         if (res.ok && data.length > 0) {
//           setAddress(data[0]); // You can support multiple later
//         }
//       } catch (err) {
//         console.error("Error fetching address:", err);
//       }
//     };

//     fetchAddress();
//   }, []);

//   const handleAddressSubmit = async (formData, addressId = null) => {
//     try {
//       const method = addressId ? "PUT" : "POST";  // Use PUT for editing, POST for adding
//       const url = addressId
//         ? `${import.meta.env.VITE_API_URL}/api/address/${addressId}`  // Editing address
//         : `${import.meta.env.VITE_API_URL}/api/address`;  // Adding new address

//       const res = await fetch(url, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to save address");

//       setAddress(data);  // Update the address state
//       setShowAddressPopup(false);  // Close the popup
//     } catch (err) {
//       alert("Error: " + err.message);
//     }
//   };

//   return (
//     <div className="checkout-page p-3">
//       <div className="container">
//         <div className="mb-4">
//           <h5 className="section-heading">Delivery Address</h5>
//           {address ? (
//             <div className="border p-2 rounded bg-light mb-2 address-card">
//               <p className="mb-1"><strong>{address.fullName}</strong></p>
//               <p className="mb-1">{address.houseNo}, {address.street}, {address.area}</p>
//               <p className="mb-1">{address.city}, {address.state} - {address.zipCode}</p>
//               <p className="mb-1">{address.country}</p>
//               <p className="mb-1">Phone: {address.phone}</p>
//               <button className="edit-btn mt-2" onClick={() => setShowAddressPopup(true)}>
//                 Edit Address
//               </button>
//             </div>
//           ) : (
//             <button className="btn btn-primary" onClick={() => setShowAddressPopup(true)}>
//               Add Address
//             </button>
//           )}
//         </div>

//         <div className="row">
//           <div className="col-md-6 mb-4">
//             {cartItems.length > 0 ? (
//               cartItems.map((item) => (
//                 <Cart
//                   key={item._id}
//                   image={item.image}
//                   name={item.name}
//                   price={item.price}
//                   stockStatus={item.stockStatus}
//                   quantity={item.quantity}
//                   onQuantityChange={(newQty) => updateCartItemQuantity(item._id, newQty)}
//                   onRemove={() => removeFromCart(item._id)}
//                 />
//               ))
//             ) : (
//               <p className="text-mute" style={{ color: "white" }}>Your cart is empty.</p>
//             )}
//           </div>

//           <div className="col-md-6 mb-4">
//             <div className="price-details-card p-4 shadow-sm">
//               <h5 className="section-heading">Price details</h5>

//               <div className="d-flex justify-content-between mb-2">
//                 <span>Price ({cartItems.length} items)</span>
//                 <span>₹ {totalPrice}</span>
//               </div>

//               <div className="d-flex justify-content-between mb-2">
//                 <span>Discount</span>
//                 <span>- ₹ {discount}</span>
//               </div>

//               <div className="d-flex justify-content-between mb-2">
//                 <span>Delivery Charges</span>
//                 <span>₹ {deliveryCharges}</span>
//               </div>

//               <div className="d-flex justify-content-between mb-2">
//                 <span>Protect Promise Fee</span>
//                 <span>₹ {protectPromiseFee}</span>
//               </div>

//               <hr />

//               <div className="d-flex justify-content-between fw-bold">
//                 <span>TOTAL</span>
//                 <span>₹ {finalAmount}</span>
//               </div>
//             </div>


//             {loading ? (
//               <div className="text-center mt-3">
//                 <ClipLoader size={50} color="#00BFFF" loading={loading} />
//               </div>
//             ) : (
//               cartItems.length > 0 && (
//                 <div className="text-end mt-3">
//                   <button className="btn place-order-btn" onClick={handlePlaceOrder}>
//                     PLACE ORDER
//                   </button>
//                 </div>
//               )
//             )}

//           </div>
//         </div>
//       </div>

//       {showAddressPopup && (
//         <AddressPopup
//           onClose={() => setShowAddressPopup(false)}
//           onSubmit={handleAddressSubmit}
//         />
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;





















import React, { useContext, useMemo, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cart from './Cart';
import './Cart.css';
import { CartContext } from '../../context/CartContext';
import AddressPopup from '../../components/AddressPopup.jsx';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    loading,
  } = useContext(CartContext);

  const [address, setAddress] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Calculate the total price
  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = parseFloat(item.productId.price) || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const discount = 5649;
  const deliveryCharges = 80;
  const protectPromiseFee = 9;
  const finalAmount =
    totalPrice > 0 ? totalPrice - discount + deliveryCharges + protectPromiseFee : 0;

  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please add a delivery address.");
      return;
    }

    // Include all required fields for each item based on the model validation
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.productId._id,
        name: item.productId.title || item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
        image: item.productId.image
      })),
      orderId: `ORD-${Date.now()}`,
      shippingAddress: {
        fullName: address.fullName,
        houseNo: address.houseNo,
        street: address.street,
        area: address.area,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone
      },
      totalAmount: finalAmount
    };

    try {
      setOrderLoading(true);
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      // Clear cart on both frontend and backend using the async function
      await clearCart();

      // In your cart checkout component
      navigate("/thank-you", { state: { source: "order" } });
    } catch (err) {
      console.error("Error placing order:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setOrderLoading(false);
    }
  };

  // Fetch address on load
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(`${API_URL}/api/address`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.length > 0) {
          setAddress(data[0]);
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };

    fetchAddress();
  }, []);

  const handleAddressSubmit = async (formData, addressId = null) => {
    try {
      const method = addressId ? "PUT" : "POST";
      const url = addressId
        ? `${API_URL}/api/address/${addressId}`
        : `${API_URL}/api/address`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save address");

      setAddress(data);
      setShowAddressPopup(false);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="checkout-page p-3">
      <div className="container">
        <div className="mb-4">
          <h5 className="section-heading">Delivery Address</h5>
          {address ? (
            <div className="border p-2 rounded bg-light mb-2 address-card">
              <p className="mb-1"><strong>{address.fullName}</strong></p>
              <p className="mb-1">{address.houseNo}, {address.street}, {address.area}</p>
              <p className="mb-1">{address.city}, {address.state} - {address.zipCode}</p>
              <p className="mb-1">{address.country}</p>
              <p className="mb-1">Phone: {address.phone}</p>
              <button className="edit-btn mt-2" onClick={() => setShowAddressPopup(true)}>
                Edit Address
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowAddressPopup(true)}>
              Add Address
            </button>
          )}
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            {loading ? (
              <ClipLoader color="#fff" />
            ) : cartItems.length > 0 ? (
              cartItems.map((item) => (
                <Cart
                  key={item.productId._id}
                  image={item.productId.image}
                  name={item.productId.title}
                  price={item.productId.price}
                  stockStatus={item.productId.stock}
                  quantity={item.quantity}
                  onQuantityChange={(newQty) =>
                    updateCartItemQuantity(item.productId._id, newQty)
                  }
                  onRemove={() => removeFromCart(item.productId._id)}
                />
              ))
            ) : (
              <p className="text-mute" style={{ color: "white" }}>
                Your cart is empty. Add items to your cart to proceed.
              </p>
            )}
          </div>

          <div className="col-md-6 mb-4">
            <div className="price-details-card p-4 shadow-sm">
              <h5 className="section-heading">Price details</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Price ({cartItems.length} items)</span>
                <span>₹ {totalPrice}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Discount</span>
                <span>- ₹ {discount}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Charges</span>
                <span>₹ {deliveryCharges}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Protect Promise Fee</span>
                <span>₹ {protectPromiseFee}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold">
                <span>TOTAL</span>
                <span>₹ {finalAmount}</span>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="text-end mt-3">
                <button
                  className="btn place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                >
                  {orderLoading ? <ClipLoader color="#fff" size={20} /> : "PLACE ORDER"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddressPopup && (
        <AddressPopup
          onClose={() => setShowAddressPopup(false)}
          onSubmit={handleAddressSubmit}
          initialData={address}
        />
      )}
    </div>
  );
};

export default CheckoutPage;