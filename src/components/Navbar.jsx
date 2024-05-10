import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import abi from "../constants/abi.json";
import contractAddress from "../constants/address.json";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Navbar() {

    var supplyContractAddress;

    const router = useRouter();

    const [isAdmin, setIsAdmin] = useState(false);
    const [dashOpen, setDashOpen] = useState(false);

    const { chainId, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis, deactivateWeb3 } = useMoralis();
    var { runContractFunction: runContractFF } = useWeb3Contract();
    var chainIdInt = parseInt(chainId);
    if (chainIdInt in contractAddress) {
        supplyContractAddress = contractAddress[chainIdInt][contractAddress[chainIdInt].length - 1];

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

    return (
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
                    {/* <div className="relative">
                <button onClick={() => { setDashOpen(dashOpen => !dashOpen) }}>Dashboard</button>
                {dashOpen ?
                  <div
                    className="absolute w-max right-[5%] top-[100%] bg-slate-100 border-2 rounded border-dashed border-slate-400 py-2 px-3">
                    <div
                      className="text-normal border-2 border-dashed p-2 border-slate-500 hover:bg-slate-600 hover:text-white hover:border-white"
                    >Connected: {account.slice(0, 6)}...</div>
                    <p>Hello world</p>
                    <p>Hello world</p>
                  </div>
                  : <></>
                }

              </div> */}
                    <div className="flex justify-center items-center gap-2 relative">

                        <div
                            className="text-normal border-2 rounded border-dashed p-1 border-slate-500 hover:bg-slate-600 hover:text-white hover:border-white"
                        >Connected: {account.slice(0, 6)}...</div>
                        <button className="rounded p-1 hover:bg-slate-200" onClick={() => { router.push("/admin/dashboard") }}>Dashboard</button>
                    </div>
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
    )
}