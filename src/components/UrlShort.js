import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineCopy } from "react-icons/ai";

const UrlShort = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [customId, setCustomId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidUrl = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?([\\w\\d\\-]+\\.)+[\\w\\d]{2,}(\\/[^\\s]*)?$"
    );
    return pattern.test(url);
  };

  const isValidCustomId = (id) => {
    const pattern = /^[a-zA-Z0-9]{1,9}$/;
    return pattern.test(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!longUrl || !isValidUrl(longUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    if (customId && !isValidCustomId(customId)) {
      setError("Custom ID must be alphanumeric and no longer than 9 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/shorten", { 
        longUrl, 
        customId: customId || undefined
      });
      setShortUrl(response.data.shortUrl);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        toast.success(
          <div>
            <AiOutlineCopy style={{ marginRight: "10px", fontSize: "20px" }} />
            URL copied to clipboard!
          </div>,
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      })
      .catch((err) => console.error('Error copying to clipboard: ', err));
  };

  return (
    <div className="container">
      <h1>Make it Short...!</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Custom ID (optional)"
          value={customId}
          onChange={(e) => setCustomId(e.target.value)}
          className="input"
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Shortening..." : "Short it"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {shortUrl && (
        <div className="result">
          <p>Shortened URL:</p>
          <a href={`http://${shortUrl}`} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
          <button onClick={handleCopy} className="copy-button">
            <AiOutlineCopy />
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UrlShort;
