import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import StoreProvider from "./StoreProvider";

export default function App({ Component, pageProps }) {
  return (
    // <StoreProvider>
    <MoralisProvider initializeOnMount={false}>
      <Component {...pageProps} />
    </MoralisProvider>
    // </StoreProvider>
  );
}
