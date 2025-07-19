import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ForgetPw() {

  const [resetPass, setResetPass] = useState({ npass: '', cnpass: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

  const handleChange = (e) => {
    setResetPass({ ...resetPass, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resetPass.npass !== resetPass.cnpass) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/reset-pass`, {
        newPass: resetPass.npass
      }, { withCredentials: true });

        setMessage(response.data.message || "✅ Password reset successful");
        navigate('/login');

    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Something went wrong");
    }
  };

  return (
    <div style={{
      backgroundColor: '#000214',
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      <h2 style={{
        background: 'linear-gradient(90deg, #144EE3, #EB568E)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2.5rem',
        marginBottom: '20px',
        fontWeight: '700'
      }}>
        Reset Password
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          backgroundColor: '#0a0a2a',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
          minWidth: '300px'
        }}
      >

        <label style={{ color: '#fff',textAlign:'start' }}>New Password:
          <input
            type="password"
            name="npass"
            value={resetPass.npass}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none'
            }}
          />
        </label>

        <label style={{ color: '#fff',textAlign:'start' }}>Confirm Password:
          <input
            type="password"
            name="cnpass"
            value={resetPass.cnpass}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '5px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none'
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#144EE3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.3s ease'
          }}
          onMouseOver={e => e.target.style.backgroundColor = '#0f3bb3'}
          onMouseOut={e => e.target.style.backgroundColor = '#144EE3'}
        >
          Submit
        </button>

        <p style={{
          color: message.includes('✅') ? '#00ff88' :
                 message.includes('❌') ? '#ff4c4c' : '#ccc',
          marginTop: '5px',
          fontSize: '14px'
        }}>{message}</p>

      </form>
    </div>
  );
}
