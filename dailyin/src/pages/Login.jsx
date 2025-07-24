import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import api from '../api/axios';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  try {
    console.log('Logging in with:', { username, password });
    const res = await api.post('/auth/token/', { username, password });
    console.log('Login response:', res);

    if (res.status === 200) {
      const { access, refresh } = res.data;
      console.log('Tokens received:', { access, refresh });

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      route('/transaction');
    } else {
      alert('Login failed: Unexpected response status ' + res.status);
    }
  } catch (err) {
    console.error('Login failed with error:', err.response || err.message);
    alert(`Login failed: ${err.response?.data?.detail || err.message}`);
  }
};


  return (
    <div className="container">
      <div className="card">
        <div className="image-side">
          <img
            src="https://www.doforms.com/wp-content/uploads/2024/10/barcode-inventory-management.jpg"
            alt="login form"
            className="image"
          />
        </div>

        <div className="form-side">
          <div className="logo">
            <span className="logo-text">Welcome!</span>
          </div>

          <h5 className="title">Login</h5>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onInput={(e) => setUsername(e.target.value)}
            className="input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            className="input"
          />

          <button className="btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
