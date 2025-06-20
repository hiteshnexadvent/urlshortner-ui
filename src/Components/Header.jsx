import React, { useContext, useEffect } from 'react'
import './Style.css'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from './UseContext'
import axios from 'axios';


export default function Header() {

    const { userId, setuserId } = useContext(UserContext);
    
    const navigate = useNavigate();
    
    const handleLogout = async(e) => {
        e.preventDefault();

        try {
            
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
                withCredentials: true
            });

          
    if (response.status === 200 && response.data.success) {
      alert(response.data.message); 
      setuserId(null); 
      navigate('/'); 
    } else {
      alert(response.data.message || 'Logout failed');
    }

        }
        catch (error) {
             if (error.response) {
      alert(error.response.data.message || 'Logout error occurred');
    } else {
      alert('Network/server error');
    }
        }
    
  }
  
  // ------------------------- useffect for check session

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/check-session`, {
          withCredentials: true
        });

        if (res.data.loggedIn) {
          setuserId(res.data.userId);
        } else {
          setuserId(null);
        }
      } catch (error) {
        console.log('Session check failed', error);
        setuserId(null);
      }
    };

    verifySession();
  }, [setuserId]);
  


  return (
      <div style={{ backgroundColor: '#0d0016', width: '100%', height: 'auto' }} id='main'>
          
          <div className="container">
        <div className="row">
          <div className="col-lg-3 col-12"></div>
          <div className="col-lg-3 col-12"></div>
          <div className="col-lg-6 col-12" style={{padding:'50px'}}  id='main-buttons'>

            {userId && userId.name ? (
                           <div className="dropdown" style={{ marginLeft: "50px" }}>
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ backgroundColor: 'transparent' }}
      >
        <span>Welcome {userId.name}</span>
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ backgroundColor: 'transparent', color: 'white' }}>
        <li>
          <Link className="dropdown-item" to="/premium"  style={{color:'white'}}>Premium Plans</Link>
        </li>
        <li>
          <button
                      className="dropdown-item"
                      style={{color:'white'}}
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
                      ) : (
                              <div>
                                  <Link to='/login'>
                <button style={{width:'120px',padding:'8px',borderRadius:'20px',color:'white',backgroundColor:'transparent',border:'2px solid #2d2f45'}}>Log In</button>
            </Link>
            <Link to='/register'>
                <button style={{width:'120px',padding:'8px',borderRadius:'20px',color:'white',backgroundColor:'#144EE3',border:'2px solid #2d2f45',marginLeft:'40px'}}>Register</button>
            </Link>
                              </div>
                      )
            
            }
            

          </div>
        </div>
     </div>

    </div>
  )
}


