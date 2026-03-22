import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ClientReviews = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    navigate(`/profile/${user?.username || 'johndoe'}?tab=reviews`, { replace: true });
  }, [navigate, user]);

  return null;
};

export default ClientReviews;
