import Navbar from './Navbar'
import Footer from './Footer'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register' || router.pathname === '/forgot-password'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow ${isAuthPage ? '' : 'pt-16'}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}
