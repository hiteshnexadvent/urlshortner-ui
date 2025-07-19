import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Signup() {

  const [formData, setformData] = useState({ name: '', email: '', mobile: '', pass: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
     setformData({ ...formData, [e.target.name]: e.target.value });
  }


  const handleSubmit=async (e) => {
    
    e.preventDefault();

    try {
      
      const response=await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register`, formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })

       if (response.status === 201) {
         toast.success(response.data.message, {
                   position: 'top-right',
                   autoClose: 2000,
                   hideProgressBar: false,
                   closeOnClick: true,
                   pauseOnHover: false,
                   draggable: true,
                   progress: undefined,
                 });
      navigate('/login');
    }

    }
 catch (err) {
  const status = err.response?.status;
  const message = err.response?.data?.message;

  if (status === 409) {
    toast.error('⚠️ User with this email already exists', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  } else if (status === 400 && message) {
    toast.error(`⚠️ ${message}`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  } else if (status === 500) {
    toast.error('❌ Server error occurred. Please try again later.', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  } else if (err.response) {
    toast.error(`⚠️ Unexpected error: ${status}`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  } else if (err.request) {
    toast.error('❗ No response from server. Check your internet connection.', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  } else {
    toast.error(`❗ Error: ${err.message}`, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  }
}




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
}}>

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
      minWidth: '320px',
      textAlign: 'start'
    }}
  >

    <h1
      style={{
        background: 'linear-gradient(90deg, #144EE3, #EB568E)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2.2rem',
        textAlign: 'center',
        marginBottom: '10px',
        fontWeight:'700'
      }}
    >
      Registration Form
    </h1>

    <label style={{ color: '#fff' }}>Name:
      <input 
        type="text" 
        name='name' 
        onChange={handleChange} 
        value={formData.name} 
        required
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '5px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          outline: 'none',
         
        }}
      />
    </label>

    <label style={{ color: '#fff' }}>Email:
      <input 
        type="email" 
        name='email' 
        onChange={handleChange} 
        value={formData.email} 
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

    <label style={{ color: '#fff' }}>Mobile:
      <input 
        type="tel" 
        name='mobile' 
        onChange={handleChange} 
        value={formData.mobile} 
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

    <label style={{ color: '#fff' }}>Password:
      <input 
        type="password" 
        name='pass' 
        onChange={handleChange} 
        value={formData.pass} 
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
      Register
    </button>

  </form>
</div>

  )
}
