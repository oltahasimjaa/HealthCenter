import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post('http://localhost:5001/logout', {}, { withCredentials: true });
        localStorage.removeItem('redirectAfterLogin');
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        navigate('/login');
      }
    };

    performLogout();
  }, [navigate]);

  return null; // nothing visual
};

export default Logout;
