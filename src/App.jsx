import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [links, setLinks] = useState(null);

  const fetchLinks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/payment-links");
      const data = response.data;
      setLinks(data.payment_links);
      console.log(links);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  const handleRemove = (id) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Show Links</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {/* Check if links is available and not empty */}
          {links && links.length > 0 ? (
            links.map((link, index) => (
              <tr key={index}>
                <td>
                  <a href={link.short_url} target="_blank">
                    {link.short_url}
                  </a>
                </td>
                <td>{link.amount}</td>
                <td>{link.status}</td>
                <td>
                  <button onClick={() => handleRemove(link.id)}>Cancel</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No links available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
