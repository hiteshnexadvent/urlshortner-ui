import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp() {

  const [step, setStep] = useState(1);
  const [formData, setformData] = useState({ email: '', otp: '' });
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);


  const navigate = useNavigate();

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setResendLoading(true); // show "Sending..."
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/send-mail`, {
        email: formData.email,
      }, { withCredentials: true });

      setMessage(`${response.data.message}. OTP will expire in 5 minutes.`);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
      setResendLoading(false); // revert back
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/verify-otp`, {
        otp: formData.otp,
      }, { withCredentials: true });

      if (res.data.success) {
        setMessage('✅ OTP Verified! Redirecting to reset password...');
        navigate('/forget');
      } else {
        setMessage('❌ OTP Invalid');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleResend = async (e) => {
    
    e.preventDefault();
    setResendLoading(true); // show "Sending..."

    try {
      
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/resend-otp`, {
        email:formData.email
      }, { withCredentials: true })

      setMessage(response.data.message || "OTP resent to your email");

    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Failed to resend OTP");  
    }
    setResendLoading(false); // revert back

  }

  return (
    <div style={{
      backgroundColor: '#000214',
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'start'
    }}>

      <h2 style={{
        background: 'linear-gradient(90deg, #144EE3, #EB568E)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2.5rem',
        marginBottom: '20px',
        fontWeight: '700'
      }}>
        {step === 1 ? 'Forgot Password' : 'Verify OTP'}
      </h2>

      <form
        onSubmit={step === 1 ? handleSendEmail : handleVerifyOtp}
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

        {step === 1 && (
          <label style={{ color: '#fff' }}>Email:
            <input
              type="email"
              name="email"
              value={formData.email}
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
        )}

        {step === 2 && (
          <label style={{ color: '#fff' }}>Enter OTP:
            <input
              type="tel"
              name="otp"
              value={formData.otp}
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
        )}

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
          {step === 1 ? 'Send OTP' : 'Verify'}
        </button>

        <p style={{
          color: message.includes('✅') ? '#00ff88' :
                 message.includes('❌') ? '#ff4c4c' : '#ccc',
          marginTop: '5px',
          fontSize: '14px'
        }}>{message}</p>
       <button
  type="button"
  onClick={handleResend}
  disabled={resendLoading}
  style={{
    textDecoration: 'none',
    color: '#b4b1b0a7',
    background: 'none',
    border: 'none',
    cursor: resendLoading ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    opacity: resendLoading ? 0.6 : 1
  }}
>
  {resendLoading ? 'Sending...' : 'Resend OTP'}
</button>

        
      </form>
    </div>
  );
}
