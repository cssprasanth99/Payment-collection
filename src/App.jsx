import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [links, setLinks] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const fetchLinks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/payment-links");
      setLinks(response.data.payment_links || []);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    if (!name || !amount) {
      alert("Please provide both name and amount.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/payment-links/create",
        {
          name,
          amount: parseInt(amount),
        }
      );

      console.log("Payment link created:", response.data);
      fetchLinks();
      setName("");
      setAmount("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCancelLink = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this payment link?"
    );
    if (!confirmCancel) return;

    try {
      await axios.post(`http://localhost:5000/payment-links/cancel/${id}`);
      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
      alert("Payment link cancelled successfully!");
    } catch (error) {
      console.error(error.message);
      alert("Error cancelling the payment link.");
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div>
      <h1>Create Payment Link</h1>
      <form onSubmit={handleCreateLink}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div>
          <label>Amount (INR):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <button type="submit">Create Payment Link</button>
      </form>

      <h2>Payment Links</h2>
      <table>
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {links.length === 0 ? (
            <tr>
              <td colSpan="4">No payment links available</td>
            </tr>
          ) : (
            links.map((link, index) => (
              <tr key={index}>
                <td>{link.short_url}</td>
                <td>{link.amount}</td>
                <td>{link.status}</td>
                <td>
                  <button onClick={() => handleCancelLink(link.id)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
