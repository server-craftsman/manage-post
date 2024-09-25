import { Link } from 'react-router-dom';
import SearchBar from '../../components/customer/Searchbar';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-2 sm:mb-0">
          <Link to="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-2 text-blue-600">
              <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
              <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
            </svg>
            <span className="font-bold text-2xl text-gray-800">Blogs App</span>
          </Link>
        </div>
        <SearchBar onSearch={() => {}} placeholder="Search blogs" />
        <nav className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2">
          <Link to="/" className="header-link mb-1 sm:mb-0">Home</Link>
          <div className="relative group mb-1 sm:mb-0">
            <button className="header-link flex items-center">
              Products
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg mt-1 rounded-md z-50">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Product 1</a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Product 2</a>
            </div>
          </div>
          <div className="relative group mb-1 sm:mb-0">
            <button className="header-link flex items-center">
              Resources
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg mt-1 rounded-md z-50">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Resource 1</a>
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Resource 2</a>
            </div>
          </div>
          <Link to="/dashboard" className="header-link mb-1 sm:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Write
          </Link>
        </nav>
        <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4 items-center">
          {user ? (
            <div className="relative flex items-center space-x-2 group transition-transform duration-300 hover:scale-105 z-50">
              <img src={typeof user.avatar === 'string' ? user.avatar : 'default-avatar.png'} alt="User" className="w-12 h-12 rounded-full border-2 border-blue-400 shadow-lg transition-shadow duration-300 hover:shadow-xl" />
              <span className="text-gray-800 font-semibold text-lg">{user.name}</span>
              <div className="absolute hidden group-hover:block bg-white shadow-lg mt-[9rem] rounded-md z-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <div className="flex flex-col px-3 py-2">
                  <Link to="/profile" className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.5c3.5 0 6.5-2.5 6.5-5.5S15.5 3.5 12 3.5 5.5 6.5 5.5 9.5s3 5.5 6.5 5.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.5c-4.5 0-8.5 2-8.5 5.5V21h17v-1.5c0-3.5-4-5.5-8.5-5.5z" />
                    </svg>
                    Profile
                  </Link>
                  <button onClick={logout} className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l4-4m-4 4l4 4m12-12v6m0 0H9" />
                    </svg>
                    Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="header-link mb-1 sm:mb-0">Log in</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;