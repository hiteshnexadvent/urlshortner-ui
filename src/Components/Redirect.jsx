import React, { useEffect, useState } from 'react';
import "./Style.css";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

export default function Redirect() {
  const { shortUrl } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUrl = async () => {
      try {
          const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/url/check/${shortUrl}`, {
          withCredentials:true
      });
        if (res.data.protected) {
          setIsProtected(true);
        } else {
          window.location.replace(res.data.originalUrl);
        }
      } catch (err) {
        setError('Invalid or expired link');
      } finally {
        setIsLoading(false);
      }
    };

    checkUrl();
  }, [shortUrl]);

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/verify-url/${shortUrl}`, { password }, {
          withCredentials:true
      });

      window.location.href = res.data.originalUrl;
    } catch (err) {
      setError('Incorrect password');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
      <>
          
          <div style={{height:'100vh',paddingBottom:'100px',backgroundColor:'#0d0016'}}>

          <Header></Header>
          
      {isProtected ? (
  <div style={{ padding: '40px', textAlign: 'center' }} id='redirect'>
    <h2 style={{
      fontSize: '60px',
      fontWeight: '800',
      background: 'linear-gradient(90deg, #144EE3, #EB568E)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '30px'
    }}>
      This link is protected
    </h2>

    <form onSubmit={handleVerifyPassword} style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          padding: '15px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          outline: 'none',
          width: '280px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          transition: 'border-color 0.3s ease'
        }}
        onFocus={(e) => e.target.style.borderColor = '#144EE3'}
        onBlur={(e) => e.target.style.borderColor = '#ccc'}
      />

      <button
        type="submit"
        style={{
          padding: '15px 25px',
          fontSize: '16px',
          borderRadius: '8px',
          border: 'none',
          background: '#144EE3',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(20, 78, 227, 0.3)',
          transition: 'background 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.background = '#0f3fc9'}
        onMouseLeave={(e) => e.target.style.background = '#144EE3'}
      >
        Unlock Link
      </button>
    </form>
  </div>
) : null}
        
              </div>
    </>
  );
}
