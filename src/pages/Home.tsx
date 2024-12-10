import React, { useState } from 'react'; 
import LoginDialog from '../components/Auth/LoginDialog'; 
import './Home.css'; 
 
const Home: React.FC = () => { 
  const [isLoginOpen, setIsLoginOpen] = useState(false); 
 
  const handleStartTracking = () => { 
    setIsLoginOpen(true); 
  }; 
 
  return ( 
    <div className="home-container"> 
      <div className="background-video"> 
        <video autoPlay loop muted> 
          <source src="/LifeMetrics/background.mp4" type="video/mp4" /> 
          Your browser does not support the video tag. 
        </video> 
      </div> 
       
      <div className="home-content"> 
        <h1>Welcome to LifeMetrics</h1> 
        <p>Your Personal Health Status Tracker</p> 
        <button  
          className="start-tracking-button" 
          onClick={handleStartTracking} 
        > 
          Start Tracking! ❯ 
        </button> 
      </div> 
 
      <LoginDialog  
        isOpen={isLoginOpen}  
        onClose={() => setIsLoginOpen(false)}  
      /> 
    </div> 
  ); 
}; 
 
export default Home; 