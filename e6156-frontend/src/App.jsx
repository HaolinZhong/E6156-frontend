import React from 'react';
import "./bootstrap.min.css";
import Header from './components/Header';
import Footer from './components/Footer';
import Homescreen from './screens/Homescreen';
import Productscreen from './screens/Productscreen';
import Cartscreen from './screens/Cartscreen';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/Registerscreen';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <main className='py-3'>
            <Routes>
              <Route path='/login' element={<LoginScreen />}/>
              <Route path='/register' element={<RegisterScreen />}/>
              <Route path='/' element={<Homescreen />} exact/>
              <Route path='/products/:id' element={<Productscreen />}/>
              <Route path='/cart/:id' element={<Cartscreen />}/>
              <Route path='/cart' element={<Cartscreen />}/>
            </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
