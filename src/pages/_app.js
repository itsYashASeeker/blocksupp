import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import StoreProvider from "./StoreProvider";
import "@/assets/css/card.css";
import "@/assets/css/index.css";

export default function App({ Component, pageProps }) {
  return (
    // <StoreProvider>
    <MoralisProvider initializeOnMount={false}>
      <Component {...pageProps} />
    </MoralisProvider>
    // </StoreProvider>
  );
}
