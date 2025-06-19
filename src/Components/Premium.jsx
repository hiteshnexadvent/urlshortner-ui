import React from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';

export default function Premium() {
  return (
    <div style={{ backgroundColor: '#000214', width: '100%', height: 'auto', paddingBottom: '50px', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <Header />

      <h1 style={{ textAlign: 'center', fontSize: '48px', marginTop: '40px', marginBottom: '60px', color: '#fff',fontWeight:'700' }}>Business Plans</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>

        {/* Basic Plan */}
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '20px', padding: '30px', width: '280px', textAlign: 'center', boxShadow: '0 0 15px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#4da6ff', fontSize: '28px' }}>Basic</h2>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '15px 0' }}>$0 / mo</p>
          <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '20px' }}>
            <li>✓ 5 URLs / day</li>
            <li>✓ URL Expiry in 30 days</li>
            <li>✓ No Login Required</li>
          </ul>
          <Link to='/'><button style={{ padding: '10px 20px', backgroundColor: '#4da6ff', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Start Free</button></Link>
        </div>

        {/* Advance Plan */}
        <div style={{ backgroundColor: '#1e1b35', borderRadius: '20px', padding: '30px', width: '280px', textAlign: 'center', boxShadow: '0 0 15px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#9b59b6', fontSize: '28px' }}>Advance</h2>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '15px 0' }}>$9 / mo</p>
          <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '20px' }}>
            <li>✓ Unlimited URLs</li>
            <li>✓ Analytics & Clicks</li>
            <li>✓ Custom Short Links</li>
          </ul>
          <button style={{ padding: '10px 20px', backgroundColor: '#9b59b6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Choose Plan</button>
        </div>

        {/* Premium Plan */}
        <div style={{ backgroundColor: '#2b1d0e', borderRadius: '20px', padding: '30px', width: '280px', textAlign: 'center', boxShadow: '0 0 15px rgba(0,0,0,0.5)' }}>
          <h2 style={{ color: '#f39c12', fontSize: '28px' }}>Premium</h2>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '15px 0' }}>$19 / mo</p>
          <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '20px' }}>
            <li>✓ Everything in Advance</li>
            <li>✓ API Access</li>
            <li>✓ Team Accounts</li>
          </ul>
          <button style={{ padding: '10px 20px', backgroundColor: '#f39c12', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Choose Plan</button>
        </div>

      </div>

          {/* ------------------ comparison */}

          <div className="container">
              <div className="row mt-5">
                  <h1 style={{fontWeight:'700'}}>Detailed Feature Comparison</h1>
                  <div className="col-12 mt-3">
                      
                      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          <tr>
            <th style={thStyle} colSpan={5}>Link Managment</th>
            {/* <th style={thStyle}>User 1</th>
            <th style={thStyle}>User 2</th>
            <th style={thStyle}>User 3</th> */}
          </tr>
          <tr>
            <td style={tdStyle}>Short Links</td>
            <td style={tdStyle}>5/mo</td>
            <td style={tdStyle}>50/mo</td>
            <td style={tdStyle}>100/mo</td>
            <td style={tdStyle}>Custom</td>
          </tr>
          <tr style={{backgroundColor:'#1a1a2e'}}>
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
          <tr style={{backgroundColor:'#1a1a2e'}}>
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
          <tr style={{backgroundColor:'#1a1a2e'}}>
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
            <tr style={{backgroundColor:'#1a1a2e'}}>
            <td style={tdStyle}>Mobile </td>
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