// SignUp.tsx 
import React, { useState } from 'react'; 
import { useNavigate } from '@tanstack/react-router'; 
import { useAuth } from '../../contexts/FirebaseContext'; 
import { firestoreService } from '../../services/firestore'; 
import './SignUp.css'; 
 
const SignUp: React.FC = () => { 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [username, setUsername] = useState(''); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
   
  const { signup } = useAuth(); 
  const navigate = useNavigate(); 
 
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
 
    if (password !== confirmPassword) { 
      return setError('Passwords do not match'); 
    } 
 
    try { 
      setError(''); 
      setLoading(true); 
      const userCredential = await signup(email, password); 
       
      if (userCredential.user) { 
        await firestoreService.user.createUserProfile(userCredential.user.uid, { 
          email, 
          name: username, 
        }); 
      } 
 
      navigate({ to: '/dashboard' }); 
    } catch (err) { 
      setError('Failed to create an account'); 
      console.error(err); 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => { 
    e.preventDefault(); 
    navigate({ to: '/' }); 
  }; 
 
  return ( 
    <div className="signup-container"> 
      <div className="signup-card"> 
        <h2>Create Account</h2> 
        {error && <div className="error-message">{error}</div>} 
        <form onSubmit={handleSubmit} className="signup-form"> 
          <div className="form-group"> 
            <label htmlFor="username">Username</label> 
            <input 
              id="username" 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Enter your username" 
            /> 
          </div> 
           
          <div className="form-group"> 
            <label htmlFor="email">Email</label> 
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email" 
            /> 
          </div> 
 
          <div className="form-group"> 
            <label htmlFor="password">Password</label> 
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Create a password" 
            /> 
          </div> 
 
          <div className="form-group"> 
            <label htmlFor="confirm-password">Confirm Password</label> 
            <input 
              id="confirm-password" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="Confirm your password" 
            /> 
          </div> 
 
          <button  
            type="submit"  
            className="signup-button"  
            disabled={loading} 
          > 
            {loading ? 'Creating Account...' : 'Sign Up'} 
          </button> 
 
          <div className="login-link"> 
            Already have an account? <a href="/" onClick={handleLoginClick}>Login</a> 
          </div> 
        </form> 
      </div> 
    </div> 
  ); 
}; 
 
export default SignUp; 