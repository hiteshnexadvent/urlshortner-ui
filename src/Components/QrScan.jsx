import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";

export default function QrScan() {
  const [formData, setformData] = useState({ url: "" });
  const [qrImage, setQrImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [qrHistory, setqrHistory] = useState([]);

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/qrscan`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setQrImage(response.data.qrImage);
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.status === 429) {
          setErrorMsg(err.response.data.message);
        } else if (err.response.status === 400) {
          setErrorMsg("Please enter a valid URL.");
        } else {
          setErrorMsg("Something went wrong. Please try again.");
        }
      } else {
        setErrorMsg("Network error. Please check your internet connection.");
      }
    }
    };
    
    useEffect(() => {
        const fetchqr=async (e) => {
            
            try {
                
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fetchqr`, {
                    withCredentials: true
                });

                setqrHistory(response.data.qr);


            } catch (error) {
              console.error('History fetch failed:', error.message);
              setqrHistory([]);  // fallback to empty array to avoid crash

            }

        }
        fetchqr();
    }, [])
  
  // ----------------------------- download qr

  const handleDownload = (imgUrl, fileNameBase) => {
  const downloadImage = (format) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous'; // important for CORS

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${fileNameBase}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = imgUrl;
  };

  // Download both formats
  downloadImage('png');
  downloadImage('jpeg'); // for JPG use 'jpeg'
};


  return (
    <div
      style={{
        backgroundColor: "#0d0016",
        width: "100%",
        height: "auto",
        paddingBottom: "160px",
      }}
    >
      <div className="container">
        <div
          className="row"
          style={{
            borderRadius: "20px",
            backgroundColor: "white",
            width: "100%",
            height: "auto",
          }}
        >
          <div
            className="col-lg-6 col-12"
            style={{ textAlign: "start", padding: "20px" }}
          >
            <h2 style={{ fontWeight: "600" }}>Create a QR Code</h2>
            <p>No credit card required</p>

            <form onSubmit={handleSubmit}>
              <h4 style={{ marginTop: "70px", fontWeight: "600" }}>
                Enter your QR Code destination
              </h4>
              <input
                type="text"
                name="url"
                placeholder="https://example.com/my-long-url"
                style={{
                  width: "80%",
                  padding: "10px",
                  border: "1px solid #dfdfda",
                  borderRadius: "5px",
                }}
                onChange={handleChange}
                value={formData.url}
              />
              <button
                style={{
                  marginTop: "20px",
                  padding: "10px",
                  backgroundColor: "#144EE3",
                  border: "none",
                  color: "white",
                  borderRadius: "12px",
                  fontWeight: "600",
                }}
              >
                Get Your Qr Code For Free
                <FaArrowAltCircleRight
                  style={{ fontSize: "1.5rem", marginLeft: "7px" }}
                ></FaArrowAltCircleRight>
              </button>
            </form>
          </div>

          <div className="col-lg-6 col-12">
            <div
              className="box"
              style={{
                border: "1px solid black",
                height: "90%",
                width: "65%",
                marginTop: "18px",
                marginLeft: "175px",
                borderRadius: "30px",
                backgroundColor: "#dddee04e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              {qrImage ? (
                <img
                  src={qrImage}
                  alt="Generated QR"
                  style={{ height: "200px", width: "200px" }}
                />
              ) : (
                <img
                  src="/qr.png"
                  alt="Placeholder"
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          </div>
          {errorMsg && (
            <p style={{ color: "red", marginTop: "10px", fontWeight: "500" }}>
              {errorMsg}
            </p>
          )}
              </div>
              
              {/* ------------------------- history qr codes */}

              {Array.isArray(qrHistory) && qrHistory.length > 0 && (
  <div className="mt-5">
    <h2 style={{ color: 'white', marginBottom: '1rem',textAlign:'start',fontWeight:'700' }}>QR History</h2>
    <div className="table-container" style={{
      backgroundColor: '#1a1a2e',
      borderRadius: '10px',
      overflowX: 'auto',
      padding: '20px',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#0f3460', color: '#ffffff' }}>
            <th style={thStyle}>Original Link</th>
                                      <th style={thStyle}>QR Image</th>
                                      <th style={thStyle}>Created Date</th>
                                      <th style={thStyle}>Download</th>

          </tr>
        </thead>
        <tbody>
          {qrHistory.slice().reverse().slice(0, 5).map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #2c2c54' }}>
              <td style={tdStyle}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#8f8f8f',textAlign:'start',textDecoration:'none' }}>
                  {item.url.length > 60 ? item.url.slice(0, 60) + '...' : item.url}
                </a>
              </td>
              <td style={tdStyle}>
                <img src={item.qrImage} alt="QR Code" width="60" />
                  </td>
                  <td style={tdStyle}>
  {new Date(item.createdAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })}
              </td>
              <td style={tdStyle}>
  <button
    onClick={() => handleDownload(item.qrImage, `qr-${index}`)}
    style={{
      backgroundColor: '#144EE3',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
    }}
  >
    Download
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}




      </div>
    </div>
  );
}


const thStyle = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold'
};

const tdStyle = {
    padding: '10px',
    textAlign:'left',
    verticalAlign: 'middle',
    color: '#8f8f8f',
  fontSize:'1rem'
};
