import './App.css';
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Signup from './Components/Signup';
import Login from './Components/Login';
import { useEffect, useState } from 'react';
import UserContext from './Components/UseContext';
import Base from './Components/Base';
import Premium from './Components/Premium';


function App() {

  // ----------------- user login

  const [userId, setuserId] = useState(() => {
    const saveUser = localStorage.getItem('user');
    return saveUser ? JSON.parse(saveUser) : null;
  });

  useEffect(() => {
    if (userId) {
      localStorage.setItem('user', JSON.stringify(userId));
    } else {
      localStorage.removeItem('user');
    }
  }, [userId])
  

  return (

    <UserContext.Provider value={{userId,setuserId}}>

    <div className="App">
      
      <Router>
        <Routes>
          <Route path='/' element={<Base></Base>}></Route>
          <Route path='/register' element={<Signup></Signup>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/premium' element={<Premium></Premium>}></Route>
        </Routes>
    </Router>

      
      </div>
      
      </UserContext.Provider>
  );
}

export default App;
