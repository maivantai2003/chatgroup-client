import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { SignalRProvider } from './context/SignalRContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <SignalRProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable 
        pauseOnHover
        theme="colored" 
         />
      <App />
      </SignalRProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
