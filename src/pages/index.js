import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import abi from "../constants/abi.json";
import contractAddress from "../constants/address.json";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  var supplyContractAddress;

  const [isAdmin, setIsAdmin] = useState(false);

  const { chainId, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis, deactivateWeb3 } = useMoralis();
  var { runContractFunction: runContractFF } = useWeb3Contract();
  var chainIdInt = parseInt(chainId);
  if (chainIdInt in contractAddress) {
    supplyContractAddress = contractAddress[chainIdInt][0];
  }
  else {
    supplyContractAddress = null;
  }



  async function runCheckIfOwner() {
    var resultData = await runContractFF({
      params:
      {
        abi: abi,
        contractAddress: supplyContractAddress,
        functionName: "checkIfOwner",
        params: {},
      }
    })
    resultData = resultData.toString();
    console.log(resultData);
    if (resultData == "true") {
      setIsAdmin(true);
    }
    else {
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      runCheckIfOwner();
      return;
    }
    if (window.localStorage.getItem('isWeb3Enabled') == "true") {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {

    Moralis.onAccountChanged((account) => {
      // console.log(`Account changed!!!!!!!!`);
      if (account == null) {
        window.localStorage.removeItem('isWeb3Enabled')
        deactivateWeb3();
      }
    })

  }, [supplyContractAddress])

  // console.log(account);


  return (
    <>
      <div className="font-mono bg-slate-100 w-full h-full min-h-screen">
        <div className="bg-orange-50 flex justify-between items-center w-full h-fit px-6 py-4 backdrop-blur">
          <p className="text-xl font-semibold">BlockSupp</p>
          <div className="flex items-center w-fit gap-4">
            <Link className="underline hover:scale-105" href={"/"}>Buy-Fruits</Link>
            <Link className="underline hover:scale-105" href={"/"}>Cart</Link>
          </div>

          {account ?
            <>
              {/* <div
                className="text-normal border-2 border-dashed p-2 border-black hover:bg-slate-700 hover:text-white hover:border-white"
              >Connected: {account.slice(0, 6)}...</div> */}
              <button>Dashboard</button>
            </>
            :
            <button
              onClick={async () => {
                await enableWeb3()
                if (typeof window !== 'undefined') {
                  window.localStorage.setItem('isWeb3Enabled', "true")
                }
              }}
              disabled={isWeb3EnableLoading}
              className="text-normal border-2 border-dashed p-2 border-black hover:bg-slate-700 hover:text-white hover:border-white"
            >Connect Wallet</button>
          }
        </div>
        <div className=" w-full h-full">
          <p className="text">Hello</p>
          <p>{isAdmin ? "Admin Sir" : "User Sir"}</p>
        </div>

      </div>
    </>
  );
}
