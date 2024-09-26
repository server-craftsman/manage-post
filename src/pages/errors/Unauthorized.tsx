import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-lg text-gray-700 mb-6">You are not authorized to access this page.</p>
        <Link to="/" onClick={logout} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
