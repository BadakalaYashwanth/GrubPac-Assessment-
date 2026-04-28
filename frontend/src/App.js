import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';

const PrivateRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home setIsAuthenticated={setIsAuthenticated} />} isAuthenticated={isAuthenticated} />} />
      </Routes>
    </div>
  );
}

export default App;