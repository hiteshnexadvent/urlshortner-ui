import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { jsPDF } from "jspdf";

export default function QrScan() {
  const [formData, setformData] = useState({ url: "" });
  const [qrImage, setQrImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [qrHistory, setqrHistory] = useState([]);
  const [filteredQRs, setFilteredQRs] = useState([]);
  const [filterDays, setFilterDays] = useState(5);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  
const filterQRHistory = useCallback((days, data = qrHistory) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const filtered = data.filter((qr) => new Date(qr.createdAt) >= cutoff);
  setFilteredQRs(filtered);
}, [qrHistory]); // include only necessary dependencies

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, withLogo = false) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/qrscan`,
      { ...formData, withLogo },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    setQrImage(response.data.qrImage);
  } catch (err) {
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
    const fetchplan = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/getUserRole`, {
          withCredentials: true,
        });

        setUserRole(response.data.role);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchplan();
  }, []);

  useEffect(() => {
  const fetchqr = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/fetchqr`,
        { withCredentials: true }
      );
      setqrHistory(response.data.qr);
    } catch (error) {
      console.error("History fetch failed:", error.message);
      setqrHistory([]);
      setFilteredQRs([]);
    } finally {
      setLoading(false);
    }
  };
  fetchqr();
  }, []); // ✅ only run once on mount
  
  useEffect(() => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - filterDays);
  const filtered = qrHistory.filter((qr) => new Date(qr.createdAt) >= cutoff);
  setFilteredQRs(filtered);
}, [qrHistory, filterDays]); // ✅ stable filtering logic


  const handleDownload = (imgUrl, fileNameBase) => {
    const downloadImage = (format) => {
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL(`image/${format}`);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${fileNameBase}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      img.src = imgUrl;
    };

    downloadImage("png");
  };

  const handleFilterChange = (days) => {
    const intDays = parseInt(days);
    setFilterDays(intDays);
    setLoading(true);
    filterQRHistory(intDays, qrHistory);
    setTimeout(() => setLoading(false), 300);
  };


  const downloadCSV = () => {
    if (filteredQRs.length === 0) return;

    const headers = ["URL", "QR Image", "Created Date"];
    const rows = filteredQRs.map((item) => [
      item.url,
      item.qrImage,
      new Date(item.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "qr_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = async () => {
    if (filteredQRs.length === 0) return;

    const doc = new jsPDF();
    const yStart = 10;
    let y = yStart;

    for (let i = 0; i < filteredQRs.length; i++) {
      const item = filteredQRs[i];

      doc.text(`URL: ${item.url}`, 10, y);
      doc.text(`Created: ${new Date(item.createdAt).toLocaleDateString()}`, 10, y + 8);
      try {
        doc.addImage(item.qrImage, "PNG", 10, y + 12, 30, 30);
      } catch (err) {
        doc.text("[Image load failed]", 10, y + 20);
      }

      y += 50;

      if (y > 270) {
        doc.addPage();
        y = yStart;
      }
    }

    doc.save("qr_history.pdf");
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

            <form onSubmit={(e) => handleSubmit(e, false)}>
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
  {/* Normal QR Button */}
  <button
    type="submit"
    onClick={(e) => handleSubmit(e, false)}
    style={{
      marginTop: "20px",
      padding: "10px",
      backgroundColor: "#144EE3",
      border: "none",
      color: "white",
      borderRadius: "12px",
      fontWeight: "600",
      marginRight: "10px",
    }}
  >
    Get QR Code
    <FaArrowAltCircleRight style={{ fontSize: "1.5rem", marginLeft: "7px" }} />
  </button>

  {/* With Logo QR Button - Only for Premium users */}
  {userRole === "Premium" && (
    <button
      onClick={(e) => handleSubmit(e, true)}
      style={{
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "#28a745",
        border: "none",
        color: "white",
        borderRadius: "12px",
        fontWeight: "600",
      }}
    >
      Get QR Code With Logo
      <FaArrowAltCircleRight style={{ fontSize: "1.5rem", marginLeft: "7px" }} />
    </button>
  )}
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

        {["Advance", "Premium"].includes(userRole) && (
          <div
            style={{
              marginTop: "50px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              padding: "0 10px",
            }}
          >
            <div>
              <label
                htmlFor="dateFilter"
                style={{
                  color: "white",
                  marginRight: "10px",
                  fontWeight: "600",
                }}
              >
                Filter:
              </label>
              <select
                id="dateFilter"
                onChange={(e) => handleFilterChange(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "5px",
                  fontSize: "14px",
                }}
              >
                <option value="5">Last 5 Days</option>
                <option value="10">Last 10 Days</option>
                <option value="30">Last 1 Month</option>
              </select>
            </div>

            <div>
              <button
                onClick={downloadCSV}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "8px 16px",
                  marginRight: "10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Download CSV
              </button>
              <button
                onClick={downloadPDF}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Download PDF
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
            <div className="spinner" />
            <p style={{ marginTop: "10px", fontWeight: "500" }}>
              Loading QR history...
            </p>
          </div>
        ) : userRole === "Basic" ? (
          <div
            style={{
              color: "#737a73",
              textAlign: "center",
              marginTop: "40px",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            🔒 QR history is only available for Advance and Premium users.
          </div>
        ) : filteredQRs.length === 0 ? (
          <div
            style={{
              color: "#737a73",
              textAlign: "center",
              marginTop: "40px",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
             Make Your First QR .
          </div>
        ) : (
          <div className="mt-5">
            <h2
              style={{
                color: "white",
                marginBottom: "1rem",
                textAlign: "start",
                fontWeight: "700",
              }}
            >
              QR History
            </h2>
            <div
              className="table-container"
              style={{
                backgroundColor: "#1a1a2e",
                borderRadius: "10px",
                overflowX: "auto",
                padding: "20px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  color: "white",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#0f3460", color: "#ffffff" }}>
                    <th style={thStyle}>Original Link</th>
                    <th style={thStyle}>QR Image</th>
                    <th style={thStyle}>Created Date</th>
                    <th style={thStyle}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQRs
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #2c2c54" }}>
                        <td style={tdStyle}>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#8f8f8f",
                              textAlign: "start",
                              textDecoration: "none",
                            }}
                          >
                            {item.url.length > 60
                              ? item.url.slice(0, 60) + "..."
                              : item.url}
                          </a>
                        </td>
                        <td style={tdStyle}>
                          <img src={item.qrImage} alt="QR Code" width="60" />
                        </td>
                        <td style={tdStyle}>
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td style={tdStyle}>
                          <button
                            onClick={() =>
                              handleDownload(item.qrImage, `qr-${index}`)
                            }
                            style={{
                              backgroundColor: "#144EE3",
                              color: "white",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: "600",
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
  padding: "12px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "10px",
  textAlign: "left",
  verticalAlign: "middle",
  color: "#8f8f8f",
  fontSize: "1rem",
};
