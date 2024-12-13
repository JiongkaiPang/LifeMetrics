// SignUp.tsx
import React, { useReducer } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/FirebaseContext';
import { firestoreService } from '../../services/firestore';
import './SignUp.css';

// Define action types
type FormAction = 
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Define state interface
interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  error: string;
  loading: boolean;
}

// Initial state
const initialState: FormState = {
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  error: '',
  loading: false,
};

// Reducer function
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: action.payload };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: '' };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const SignUp: React.FC = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (state.password !== state.confirmPassword) {
      return dispatch({ type: 'SET_ERROR', payload: 'Passwords do not match' });
    }

    try {
      dispatch({ type: 'CLEAR_ERROR' });
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const userCredential = await signup(state.email, state.password);
      
      if (userCredential.user) {
        await firestoreService.user.createUserProfile(userCredential.user.uid, {
          email: state.email,
          name: state.username,
        });
      }

      navigate({ to: '/dashboard' });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create an account' });
      console.error(err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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
        {state.error && <div className="error-message">{state.error}</div>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={state.username}
              onChange={(e) => dispatch({ type: 'SET_USERNAME', payload: e.target.value })}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={state.email}
              onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={state.password}
              onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
              required
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={state.confirmPassword}
              onChange={(e) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button 
            type="submit" 
            className="signup-button" 
            disabled={state.loading}
          >
            {state.loading ? 'Creating Account...' : 'Sign Up'}
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