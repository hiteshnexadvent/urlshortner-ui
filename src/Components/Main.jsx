import React, { useEffect, useState } from 'react'
import './Style.css'
import axios from "axios";
import { FaLink } from "react-icons/fa"; 

export default function Main() {

  const [originalUrl, setoriginalUrl] = useState({ url: '' });
  const [shortUrl, setshortUrl] = useState('');
  const [urlHistory, seturlHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setoriginalUrl({ ...originalUrl, [e.target.name]: e.target.value });
  }

  const handleSubmit =  (e) => {
    
    e.preventDefault();

    axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/short`, { originalUrl: originalUrl.url, }, {
      withCredentials: true
    })
    
      .then((res) => {
        setshortUrl(res.data.url.shortUrl);
        setErrorMsg(''); // clear error if success
        console.log('API Response');

      })
    
.catch((err) => {
      console.log(err);
      if (err.response && err.response.status === 429) {
        setErrorMsg(err.response.data.message); // show rate limit error
      } else {
        setErrorMsg('Something went wrong. Try again later.');
      }
    });  }

  useEffect(() => {
    
    const fetchHistory=async () => {
      
      try {
        
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/my-urls`, {
          withCredentials: true
        })

        seturlHistory(response.data.urls.reverse());

      } catch (error) {
        console.log('History fetch failed:', error.message);
      }

    }

    fetchHistory();

  }, [])

  
  return (
    <div style={{ backgroundColor: '#0d0016', width: '100%', height: 'auto',paddingBottom:'160px' }} id='main'>
      
          
          <div className="container">
              <div className="row">
                  <div className="col-12" style={{marginTop:'70px'}} id='links'>
                      
                      <h1
  style={{
    fontSize: '60px',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #144EE3, #EB568E)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  Shorten Your Loooong Links :)
</h1>

          
          <p style={{marginTop:'30px',color:'#C9CED6'}}>Linkely is an  efficient and easy to use URL shortening service  that streamlines your <br /> online experience.</p>
 
            
              <form onSubmit={handleSubmit}
        style={{
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
          height:'76px'
        }}
      >
        {/* Icon */}
        <div style={{ padding: "0 15px", color: "#888" }}>
          <FaLink />
        </div>

        {/* Input */}
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

        {/* Button */}
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
            width:'178px'
          }}
        >
          Shorten Now!
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
  https://nexurl/{shortUrl}
</a>

  </div>
)}

            <h4 style={{fontSize:'15px',marginTop:'30px',color:'#8e978e',fontWeight:'600'}}>{ errorMsg}</h4>


          </div>
          {urlHistory.length > 0 && (
  <div style={{ marginTop: '60px', color: 'white' }}>
    <h3 style={{ textAlign: 'start', fontWeight: '700' }}>History</h3>
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
        {[...urlHistory]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 👈 Sort descending
          .slice(0, 5) // 👈 Get latest 5
          .map((url, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#1a1a1a' : '#131313' }}>
              <td style={{ padding: '12px', borderBottom: '1px solid #333', textAlign: 'start' }}>
                <a href={`${process.env.REACT_APP_API_BASE_URL}/${url.shortUrl}`} target="_blank" rel="noreferrer" style={{ color: '#C9CED6', textDecoration: 'none', fontSize: '13px' }}>
                  https://nexurl/{url.shortUrl}
                </a>
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src={`https://www.google.com/s2/favicons?sz=64&domain_url=${url.originalUrl}`} alt="icon" width="16" height="16" />
                  <a href={url.originalUrl} target="_blank" rel="noreferrer" style={{ color: '#C9CED6', textDecoration: 'none', fontSize: '13px' }}>
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
  </div>
)}


              </div>
          </div>
          
    </div>
  )
}
