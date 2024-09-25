import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'customer') {
      navigate('/unauthorized'); // Redirect to an unauthorized page
    }
  }, [user, navigate]);

  if (!user) {
    return <p>Loading...</p>; // Or a loading spinner
  }

  return (
    <div>
      
    </div>
  );
};

export default Dashboard;
