import React, { useEffect, useState } from 'react';
import axios from "axios";
import Header from './Header';
import { Link } from 'react-router-dom';

export default function Premium() {
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchplan = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-user-plan`, { withCredentials: true });
        setUserPlan(response.data.plan);
      } catch (err) {
        console.error("Error fetching plan:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchplan();
  }, []);

  const handleChoosePlan = async (plan) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/choose-plan`, {
        plan
      }, { withCredentials: true });

      if (response.status === 200) {
        alert(response.data.message);
        setUserPlan(plan); 
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Server Error";
      if ([400, 401, 404, 409].includes(status)) {
        alert(message);
      } else {
        alert('Server Error');
      }
    }
  }

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#000214', width: '100%', height: 'auto', paddingBottom: '50px', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <Header />
      <h1 style={{ textAlign: 'center', fontSize: '48px', marginTop: '40px', marginBottom: '20px', color: '#fff', fontWeight: '700' }}>Link Shorten Plans</h1>

      <h3 style={{ textAlign: 'center', marginBottom: '40px' }}>
        Your current plan: <span style={{ color: 'lightgreen' }}>{userPlan}</span>
      </h3>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
        {userPlan === 'Basic' && (
          <>
            {/* Basic Plan Card */}
            <div style={cardStyle('#1a1a2e')}>
              <h2 style={{ color: '#4da6ff', fontSize: '28px' }}>Basic</h2>
              <p style={priceStyle}>$0 / mo</p>
              <ul style={ulStyle}>
                <li>✓ 5 URLs / day</li>
                <li>✓ URL Expiry in 30 days</li>
                <li>✓ No Login Required</li>
              </ul>
              <Link to='/'><button style={buttonStyle('#4da6ff')}>Start Free</button></Link>
            </div>

            {/* Advance Plan Card */}
            <div style={cardStyle('#1e1b35')}>
              <h2 style={{ color: '#9b59b6', fontSize: '28px' }}>Advance</h2>
              <p style={priceStyle}>$9 / mo</p>
              <ul style={ulStyle}>
                <li>✓ Unlimited URLs</li>
                <li>✓ Analytics & Clicks</li>
                <li>✓ Custom Short Links</li>
              </ul>
              <button style={buttonStyle('#9b59b6')} onClick={() => handleChoosePlan("Advance")}>Choose Plan</button>
            </div>

            {/* Premium Plan Card */}
            <div style={cardStyle('#2b1d0e')}>
              <h2 style={{ color: '#f39c12', fontSize: '28px' }}>Premium</h2>
              <p style={priceStyle}>$19 / mo</p>
              <ul style={ulStyle}>
                <li>✓ Everything in Advance</li>
                <li>✓ API Access</li>
                <li>✓ Team Accounts</li>
              </ul>
              <button style={buttonStyle('#f39c12')} onClick={() => handleChoosePlan("Premium")}>Choose Plan</button>
            </div>
          </>
        )}

        {userPlan === 'Advance' && (
          <div style={cardStyle('#2b1d0e')}>
            <h2 style={{ color: '#f39c12', fontSize: '28px' }}>Premium</h2>
            <p style={priceStyle}>$19 / mo</p>
            <ul style={ulStyle}>
              <li>✓ Everything in Advance</li>
              <li>✓ API Access</li>
              <li>✓ Team Accounts</li>
            </ul>
            <button style={buttonStyle('#f39c12')} onClick={() => handleChoosePlan("Premium")}>Upgrade Plan</button>
          </div>
        )}

        {userPlan === 'Premium' && (
          <h2 style={{ color: 'gold', fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
            🎉 You are a Premium User
          </h2>
        )}
      </div>

      {/* ------------------ Comparison Table ------------------ */}
      <div className="container">
        <div className="row mt-5">
          <h1 style={{ fontWeight: '700' }}>Detailed Feature Comparison</h1>
          <div className="col-12 mt-3">
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <tbody>
                <tr>
                  <th style={thStyle} colSpan={5}>Link Management</th>
                </tr>
                <tr>
                  <td style={tdStyle}>Short Links</td>
                  <td style={tdStyle}>5/mo</td>
                  <td style={tdStyle}>50/mo</td>
                  <td style={tdStyle}>100/mo</td>
                  <td style={tdStyle}>Custom</td>
                </tr>
                <tr style={{ backgroundColor: '#1a1a2e' }}>
                  <td style={tdStyle}>Redirects</td>
                  <td style={tdStyle}>--</td>
                  <td style={tdStyle}>25/mo</td>
                  <td style={tdStyle}>110/mo</td>
                  <td style={tdStyle}>Custom</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Branded Links</td>
                  <td style={tdStyle}>--</td>
                  <td style={tdStyle}>✓</td>
                  <td style={tdStyle}>✓</td>
                  <td style={tdStyle}>✓</td>
                </tr>
                <tr style={{ backgroundColor: '#1a1a2e' }}>
                  <td style={tdStyle}>Auto Branded Links</td>
                  <td style={tdStyle}>--</td>
                  <td style={tdStyle}>--</td>
                  <td style={tdStyle}>--</td>
                  <td style={tdStyle}>Custom</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Custom Back Halves</td>
                  <td style={tdStyle}>3/mo</td>
                  <td style={tdStyle}>100/mo</td>
                  <td style={tdStyle}>500/mo</td>
                  <td style={tdStyle}>Custom</td>
                </tr>
                <tr style={{ backgroundColor: '#1a1a2e' }}>
                  <td style={tdStyle}>Link Clicks</td>
                  <td style={tdStyle}>Unlimited</td>
                  <td style={tdStyle}>Unlimited</td>
                  <td style={tdStyle}>Unlimited</td>
                  <td style={tdStyle}>Unlimited</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Mobile Deep Links</td>
                  <td style={tdStyle}>--</td>
                  <td style={tdStyle}>--</td>
                  <td style={tdStyle}>--</td>
                  <td style={tdStyle}>✓</td>
                </tr>
                <tr style={{ backgroundColor: '#1a1a2e' }}>
                  <td style={tdStyle}>Mobile</td>
                  <td style={tdStyle}>--</td>
                  <td style={tdStyle}>--</td>
                  <td style={tdStyle}>100/upload</td>
                  <td style={tdStyle}>3000/upload</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = (bg) => ({
  backgroundColor: bg,
  borderRadius: '20px',
  padding: '30px',
  width: '280px',
  textAlign: 'center',
  boxShadow: '0 0 15px rgba(0,0,0,0.5)'
});

const buttonStyle = (bg) => ({
  padding: '10px 20px',
  backgroundColor: bg,
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer'
});

const priceStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '15px 0'
};

const ulStyle = {
  listStyleType: 'none',
  padding: 0,
  marginBottom: '20px'
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  backgroundColor: '#1a1a2e',
  textAlign: 'left'
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left'
};
