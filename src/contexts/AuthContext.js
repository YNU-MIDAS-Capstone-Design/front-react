import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }

  }, []);

  const fetchUser = async (tk) => {
    try {
      const res = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${tk}` },
      });
      setUser(res.data); // { nickname, role, ... }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginAuth = async(newToken) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
    await fetchUser(newToken);
  };

  const logoutAuth = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    window.location.reload();
  };

  const isAdmin = user?.nickname === "admin";

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, loginAuth, logoutAuth, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
