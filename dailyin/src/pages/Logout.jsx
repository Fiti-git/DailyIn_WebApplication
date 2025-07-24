import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';

export default function Logout() {
  useEffect(() => {
    localStorage.removeItem('accessToken');
    route('/', true); // redirect to login with replace=true to avoid back navigation
  }, []);

  return null;
}
