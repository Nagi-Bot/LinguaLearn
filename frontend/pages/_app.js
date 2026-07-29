import { AppProvider } from '../context/AppContext'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Layout from '../components/Layout'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import '../styles/globals.css'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

export default function App({ Component, pageProps, router }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
    </GoogleOAuthProvider>
  )
}
