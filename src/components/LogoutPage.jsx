import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LINK_API } from '../utils/config.json';
import { toast } from "react-toastify";

function LogoutPage({ setIsAuthenticated, setIsUsername, setIsRoles }) {
  const navigate = useNavigate();
  useEffect(() => {
    const storedToken = localStorage.getItem('loginState');
    const parseStorage = JSON.parse(storedToken);

    const headersLogout = new Headers();
    headersLogout.append('Authorization', `Bearer ${parseStorage._token}`);

    const optionsLogout = {
      method: 'POST',
      headers: headersLogout,
      redirect: 'follow'
    }

    try {
      fetch(`${LINK_API}api/logout`, optionsLogout)
        .then((response) => response.json())
        .then((result) => {
          if (result.message === 'Expired Token') {
            toast.error(result.message)
          } else {
            localStorage.removeItem('loginState');
            setIsAuthenticated(false)
            setIsRoles('staff')
            setIsUsername(0)
            navigate('/login');
          }
        })
        .catch((error) => {
          console.log(error)
          toast.error(error);
        })
    } catch (err) {
      toast.error('Terjadi kesalahan')
    }
  }, [setIsAuthenticated, navigate, setIsUsername, setIsRoles])
}

export default LogoutPage;