import { AppProvider } from '../context/AppContext'
import Layout from '../components/Layout'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import '../styles/globals.css'

export default function App({ Component, pageProps, router }) {
  return (
    <AppProvider>
      <Layout>
        <AnimatePresence mode="wait">
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AppProvider>
  )
}
