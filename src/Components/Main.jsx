import React, { useEffect, useState } from 'react'
import './Style.css'
import axios from "axios";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaLink } from "react-icons/fa"; 

export default function Main() {

  const [originalUrl, setoriginalUrl] = useState({ url: '' });
  const [shortUrl, setshortUrl] = useState('');
  const [urlHistory, seturlHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const [userRole, setUserRole] = useState('');
  const [filterDays, setFilterDays] = useState(7);
  const [filteredURLs, setFilteredURLs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setoriginalUrl({ ...originalUrl, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!originalUrl.url.trim()) {
      setErrorMsg("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/short`, { originalUrl: originalUrl.url }, {
      withCredentials: true
    })
      .then((res) => {
        setshortUrl(res.data.url.shortUrl);
        setErrorMsg('');
        console.log('API Response');
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 429) {
          setErrorMsg(err.response.data.message);
        } else {
          setErrorMsg('Please add url.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/my-urls`, {
          withCredentials: true
        })
        seturlHistory([...response.data.urls].reverse());
      } catch (error) {
        console.log('History fetch failed:', error.message);
      }
    }

    fetchHistory();
  }, [])

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
  if (urlHistory.length > 0) {
    filterURLHistory(filterDays, urlHistory);
  }
}, [urlHistory]);


  useEffect(() => {
    if (errorMsg || shortUrl) {
      const timer = setTimeout(() => {
        setErrorMsg('');
        setshortUrl('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, shortUrl]);

  const handleFilterChange = (days) => {
    const intDays = parseInt(days);
    setFilterDays(intDays);
    filterURLHistory(intDays, urlHistory);
  };

  const filterURLHistory = (days, data = urlHistory) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const filtered = data.filter((url) => new Date(url.createdAt) >= cutoff);
    setFilteredURLs(filtered);
  };

  const downloadCSV = () => {
    if (filteredURLs.length === 0) return;

    const headers = ["Short URL", "Original URL", "Clicks", "Date"];
    const rows = filteredURLs.map((item) => [
      `${process.env.REACT_APP_API_BASE_URL}/${item.shortUrl}`,
      item.originalUrl,
      item.clicks,
      new Date(item.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "url_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    if (filteredURLs.length === 0) return;

    const doc = new jsPDF();
    const headers = ["Short URL", "Original URL", "Clicks", "Date"];
    const rows = filteredURLs.map((item) => [
      `${process.env.REACT_APP_API_BASE_URL}/${item.shortUrl}`,
      item.originalUrl,
      item.clicks.toString(),
      new Date(item.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
    });

    doc.save("url_history.pdf");
  };

  const urlsToDisplay = (userRole === 'Premium' || userRole === 'Advance') ? filteredURLs : urlHistory;

  return (
    <div style={{ backgroundColor: '#0d0016', width: '100%', height: 'auto', paddingBottom: '50px' }} id='main'>
      <div className="container">
        <div className="row">
          <div className="col-12" style={{ marginTop: '70px' }} id='links'>
            <h1 style={{
              fontSize: '60px',
              fontWeight: '800',
              background: 'linear-gradient(90deg, #144EE3, #EB568E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Shorten Your Loooong Links :)
            </h1>

            <p style={{ marginTop: '30px', color: '#C9CED6' }}>
              Linkely is an efficient and easy to use URL shortening service that streamlines your <br /> online experience.
            </p>

            <form onSubmit={handleSubmit} style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1c1e2e",
              borderRadius: "50px",
              border: "4px solid #2d2f45",
              padding: "5px",
              maxWidth: "600px",
              width: "100%",
              margin: 'auto',
              marginTop: '40px',
              height: '76px'
            }}>
              <div style={{ padding: "0 15px", color: "#888" }}>
                <FaLink />
              </div>

              <input
                type="text"
                placeholder="Enter the link here"
                value={originalUrl.url}
                name='url'
                onChange={handleChange}
                style={{
                  flex: 1,
                  padding: "15px",
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                }}
                className="custom-input"
              />

              <button
                type="submit"
                style={{
                  padding: "12px 25px",
                  background: "linear-gradient(90deg, #2b6eff, #007bff)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "30px",
                  marginRight: "0px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  height: '60px',
                  width: '178px'
                }}
              >
                {loading ? 'Loading...' : 'Shorten Now!'}
              </button>
            </form>

            {shortUrl && (
              <div style={{ marginTop: "20px", color: "#fff" }} className="short-url-display">
                <p>Shortened URL:</p>
                <a
                  href={`${process.env.REACT_APP_API_BASE_URL}/${shortUrl}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ color: '#00BFFF', textDecoration: 'underline' }}
                >
                  {`${process.env.REACT_APP_API_BASE_URL}/${shortUrl}`}
                </a>
              </div>
            )}

            <h4 style={{ fontSize: '15px', marginTop: '30px', color: '#8e978e', fontWeight: '600' }}>{errorMsg}</h4>
          </div>

          {(userRole === 'Premium' || userRole === 'Advance') && (
            <div style={{
              marginTop: "50px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              padding: "0 10px",
            }}>
              <div>
                <label htmlFor="dateFilterTop" style={{
                  color: "white",
                  marginRight: "10px",
                  fontWeight: "600",
                }}>
                  Filter:
                </label>
                <select
                  id="dateFilterTop"
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
                <button onClick={downloadCSV} style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "8px 16px",
                  marginRight: "10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}>
                  Download CSV
                </button>
                <button onClick={downloadPDF} style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}>
                  Download PDF
                </button>
              </div>
            </div>
          )}

          {/* BASIC PLAN USERS MESSAGE */}
          {userRole === 'Basic' && (
            <p style={{ color: 'gray', marginTop: '40px', textAlign: 'center' }}>
              URL history is only available for Advance and Premium users.
            </p>
          )}

          {/* TABLE ONLY FOR ADVANCE/PREMIUM USERS */}
          {(userRole === 'Premium' || userRole === 'Advance') && (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#222', color: '#fff' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #333' }}>Short Link</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #333' }}>Original Link</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #333' }}>Clicks</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #333' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {urlsToDisplay
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((url, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#1a1a1a' : '#131313' }}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #333', textAlign: 'start' }}>
                        <a href={`${process.env.REACT_APP_API_BASE_URL}/${url.shortUrl}`} target="_blank" rel="noreferrer" style={{ color: '#C9CED6', textDecoration: 'none', fontSize: '13px' }}>
                          {`${process.env.REACT_APP_API_BASE_URL}/${url.shortUrl}`}
                        </a>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <img src={`https://www.google.com/s2/favicons?sz=64&domain_url=${new URL(url.originalUrl).hostname}`} alt="icon" width="16" height="16" />
                          <a href={url.originalUrl} target="_blank" rel="noreferrer" style={{ color: '#C9CED6', textDecoration: 'none', fontSize: '13px', wordBreak: 'break-all' }}>
                            {url.originalUrl.length > 50 ? url.originalUrl.slice(0, 50) + '...' : url.originalUrl}
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #333', textAlign: 'start', color: '#C9CED6', fontSize: '13px' }}>{url.clicks}</td>
                      <td style={{ fontSize: '13px', padding: '12px', borderBottom: '1px solid #333', textAlign: 'start', color: '#C9CED6' }}>
                        {new Date(url.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  )
}
