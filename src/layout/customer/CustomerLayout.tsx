import CustomHeader from './Header'
import Footer from './Footer'
import {Outlet} from 'react-router-dom'
import Cover from './Cover'
const CustomerLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <CustomHeader />
      <Cover />
      <main className='flex-grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default CustomerLayout
