import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 mb-4">
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
             <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
            </svg>
            <p className="text-gray-400">© 2024 Blogs App. All rights reserved.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
            <ul>
              <li className="mb-2">
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white"
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  Home
                </Link>
              </li>
              <Link 
              to="/create-post" 
              className="text-gray-400 hover:text-white" 
              onClick={() => {
                    window.scrollTo(0, 0);
                  }}>
                    Write
              </Link>
              
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
            <p className="text-gray-400 mb-2">FPT Software Academy</p>
            <p className="text-gray-400 mb-2">High-tech Park, Tan Phu Ward, District 9, Ho Chi Minh City, Vietnam</p>
            <p className="text-gray-400 mb-2">Email: huyit2003@fptsoftware.com</p>
            <p className="text-gray-400">Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .733.592 1.324 1.325 1.324h21.351c.733 0 1.324-.591 1.324-1.324v-21.351c0-.733-.591-1.325-1.324-1.325zm-13.675 20.5h-3v-10h3v10zm-1.5-11.5c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.5h-3v-5.5c0-1.378-.028-3.152-1.922-3.152-1.922 0-2.217 1.5-2.217 3.052v5.6h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.562 2.841-1.562 3.037 0 3.6 2 3.6 4.6v5.595z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.723-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.719 0-4.92 2.201-4.92 4.917 0 .386.044.762.128 1.124-4.087-.205-7.713-2.164-10.141-5.144-.423.725-.666 1.562-.666 2.457 0 1.694.863 3.188 2.175 4.065-.802-.026-1.558-.246-2.218-.616v.062c0 2.366 1.684 4.342 3.918 4.788-.41.111-.843.171-1.287.171-.315 0-.621-.031-.921-.088.622 1.943 2.428 3.355 4.568 3.395-1.674 1.312-3.778 2.096-6.065 2.096-.394 0-.779-.023-1.161-.068 2.162 1.386 4.729 2.194 7.496 2.194 8.993 0 13.91-7.448 13.91-13.91 0-.212-.005-.423-.014-.633.955-.689 1.785-1.55 2.439-2.533z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c-5.488 0-9.837 4.449-9.837 9.837 0 4.354 2.82 8.065 6.73 9.387-.092-.8-.175-2.03.037-2.91.191-.8 1.229-5.1 1.229-5.1s-.313-.625-.313-1.548c0-1.448.84-2.53 1.885-2.53.89 0 1.32.668 1.32 1.47 0 .895-.571 2.234-.865 3.478-.246 1.04.52 1.89 1.54 1.89 1.848 0 3.27-1.95 3.27-4.76 0-2.49-1.79-4.23-4.35-4.23-2.96 0-4.69 2.22-4.69 4.52 0 .895.34 1.85.77 2.37.09.11.1.21.07.32-.08.35-.26 1.11-.3 1.26-.05.21-.17.26-.39.16-1.45-.67-2.36-2.77-2.36-4.46 0-3.63 2.64-6.97 7.61-6.97 3.98 0 7.08 2.84 7.08 6.63 0 3.95-2.49 7.13-5.95 7.13-1.16 0-2.25-.6-2.62-1.31l-.71 2.7c-.26 1.01-.97 2.27-1.45 3.04 1.09.34 2.24.52 3.43.52 5.488 0 9.837-4.449 9.837-9.837 0-5.388-4.449-9.837-9.837-9.837z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;