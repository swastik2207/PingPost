import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider,QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient=new QueryClient()
export default function App({ Component, pageProps }: AppProps) {
 
  return (
    
    <QueryClientProvider client={queryClient}>
  <GoogleOAuthProvider clientId="27976026862-u9i2dpfekbjf3llv36j3jdv8ofk1llli.apps.googleusercontent.com"><Component {...pageProps}
  />
  <Toaster/>
  <ReactQueryDevtools/>
  </GoogleOAuthProvider>
  </QueryClientProvider>

  )
  }
