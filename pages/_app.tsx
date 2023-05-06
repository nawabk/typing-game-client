import SocketInitializer from "@/components/common/SocketInitializer";
import ContextProvider from "@/context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <SocketInitializer />
      <Component {...pageProps} />
    </ContextProvider>
  );
}
