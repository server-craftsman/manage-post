import CustomHeader from './Header'
import Footer from './Footer'
import {Outlet} from 'react-router-dom'
const CustomerLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <CustomHeader />
      <main className='flex-grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default CustomerLayout
