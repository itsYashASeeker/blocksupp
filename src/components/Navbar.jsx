import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import abi from "../constants/abi.json";
import contractAddress from "../constants/address.json";
import { useRouter } from "next/router";
import { bgcolorHex } from "@/constants/colors";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import {
    ArrowPathIcon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
} from '@heroicons/react/24/outline'

const inter = Inter({ subsets: ["latin"] });



export default function Navbar({ account, isAdmin, isOwner, isWeb3EnableLoading, compDash, setIsAddFruit, setIsAddFruitHistory, options }) {

    // var supplyContractAddress;

    const router = useRouter();

    // const options = ["View Data", "Add Fruit", "Add Fruit History"];

    // const [isAdmin, setIsAdmin] = useState(false);
    // const [dashOpen, setDashOpen] = useState(false);

    const { chainId, enableWeb3, isWeb3Enabled, Moralis, deactivateWeb3 } = useMoralis();
    // var { runContractFunction: runContractFF } = useWeb3Contract();
    // var chainIdInt = parseInt(chainId);
    // if (chainIdInt in contractAddress) {
    //     supplyContractAddress = contractAddress[chainIdInt][contractAddress[chainIdInt].length - 1];

    // }
    // else {
    //     supplyContractAddress = null;
    // }



    // async function runCheckIfOwner() {
    //     var resultData = await runContractFF({
    //         params:
    //         {
    //             abi: abi,
    //             contractAddress: supplyContractAddress,
    //             functionName: "checkIfOwner",
    //             params: {},
    //         }
    //     })
    //     if (!resultData) {
    //         return;
    //     }
    //     resultData = resultData.toString();
    //     console.log(resultData);
    //     if (resultData == "true") {
    //         setIsAdmin(true);
    //     }
    //     else {
    //         setIsAdmin(false);
    //     }
    // }

    // useEffect(() => {
    //     var isWeb3EnabledLocalStorage = localStorage.getItem('isWeb3Enabled')
    //     if (isWeb3Enabled) {
    //         if (!isWeb3EnabledLocalStorage) {
    //             localStorage.setItem('isWeb3Enabled', true);
    //         }
    //         runCheckIfOwner();
    //         return;
    //     }
    //     if (window.localStorage.getItem('isWeb3Enabled') == "true") {
    //         try {
    //             enableWeb3();
    //         } catch (error) {
    //             window.alert("error")
    //         }

    //     }
    // }, [isWeb3Enabled]);

    // useEffect(() => {

    //     Moralis.onAccountChanged((account) => {
    //         // console.log(`Account changed!!!!!!!!`);
    //         if (account == null) {
    //             window.localStorage.removeItem('isWeb3Enabled')
    //             deactivateWeb3();
    //         }
    //     })

    // }, [supplyContractAddress])

    const showOption = (index) => {
        switch (index) {
            case 0:
                setIsAddFruitHistory(false);
                setIsAddFruit(false);
                break;
            case 1:
                setIsAddFruitHistory(false);
                setIsAddFruit(true);
                break;
            case 2:
                setIsAddFruitHistory(true);
                setIsAddFruit(false);
                break;

        }
        // if (options.length == 3) {
        //     switch (index) {
        //         case 0:
        //             setIsAddFruitHistory(false);
        //             setIsAddFruit(false);
        //             break;
        //         case 1:
        //             setIsAddFruitHistory(false);
        //             setIsAddFruit(true);
        //             break;
        //         case 2:
        //             setIsAddFruitHistory(true);
        //             setIsAddFruit(false);
        //             break;

        //     }
        // }
        // else if (options.length == 2) {
        //     switch (index) {
        //         case 0:
        //             setIsAddFruitHistory(false);
        //             setIsAddFruit(false);
        //             break;
        //         case 1:
        //             setIsAddFruitHistory(false);
        //             setIsAddFruit(true);
        //             break;
        //         case 2:
        //             setIsAddFruitHistory(true);
        //             setIsAddFruit(false);
        //             break;

        //     }
        // }

    }

    return (
        <>
            <div className="fixed top-1 flex justify-center items-center w-full z-10">

                <div className="overflow-hidden flex justify-between items-center w-fit h-fit backdrop-blur-3xl text-white shadow-sm shadow-slate-600 rounded-3xl
            border-2 border-solid border-slate-800 transition ease-out transition-2
            hover:shadow-slate-200
            "
                    // style={{ background: bgcolorHex() }}
                    style={{ background: "rgba(0,0,0,0.2)" }}

                >
                    <Link className="text-sm lg:text-lg md:text-base sm:text-sm md:px-4 md:py-2 px-2 py-1 font-semibold hover:bg-slate-950" href={"/"}>
                        BlockSupp
                    </Link>
                    <div className="w-0.5 h-6 bg-slate-700 rounded-full"></div>
                    {/* <div className="flex items-center w-fit text-sm lg:text-lg md:text-base sm:text-sm">
                    <Link className="md:px-4 md:py-2 px-2 py-1 hover:bg-stone-950 hover:underline" href={"/"}>Buy-Fruits</Link>
                    <Link className="md:px-4 md:py-2 px-2 py-1 hover:bg-stone-950 hover:underline" href={"/"}>Cart</Link>
                </div> */}
                    {/* <div className="w-0.5 h-8 bg-slate-700 rounded-full"></div> */}
                    {account ?
                        <>
                            <div className="flex justify-center items-center gap-2 relative ml-3">

                                <div
                                    className="text-sm border-2 rounded border-dashed p-1 border-slate-500 hover:border-white mr-2"
                                >Connected: {account.slice(0, 6)}...</div>
                                {compDash ?
                                    <></>
                                    : <>
                                        {isOwner ?
                                            <button className="text-normal px-4 py-2 hover:bg-white hover:text-black" onClick={() => { router.push("/admin/dashboard") }}>Dashboard</button>
                                            :
                                            <>
                                                {isAdmin ?

                                                    <button className="text-normal px-4 py-2 hover:bg-white hover:text-black" onClick={() => { router.push("/admin/dash") }}>Dashboard</button> :

                                                    <button className="text-normal px-4 py-2 hover:bg-white hover:text-black" onClick={() => { router.push("/apply/admin") }}>Dashboard</button>
                                                }
                                            </>
                                        }
                                    </>

                                }


                            </div>
                        </>
                        :
                        <button
                            onClick={async () => {
                                try {
                                    await enableWeb3()
                                    if (typeof window !== 'undefined') {
                                        window.localStorage.setItem('isWeb3Enabled', "true")
                                    }
                                } catch (error) {
                                    window.localStorage.removeItem('isWeb3Enabled')
                                }

                            }}
                            disabled={isWeb3EnableLoading}
                            className="text-sm md:text-base sm:text-sm md:px-4 md:py-2 px-2 py-1 hover:bg-slate-950"
                        >Connect Wallet</button>
                    }
                </div>
            </div>
            {compDash ?
                <div className="fixed right-2 top-2 z-10">
                    <Popover className="relative">
                        <PopoverButton className="inline-flex items-center gap-x-1  font-semibold leading-6 text-slate-100">
                            <span>Menu</span>
                            <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute right-0 z-10 mt-2 flex w-screen max-w-max px-1 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            <div className="max-w-md flex-auto overflow-hidden rounded-md bg-slate-700 text-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                <div className="p-2">
                                    {options.map((item, index) => (
                                        <div key={item.name} className="group relative flex gap-x-6 rounded-lg px-4 py-2 hover:bg-slate-900">
                                            <div>
                                                <button onClick={() => { showOption(index) }} className="font-semibold">
                                                    {item}
                                                    <span className="absolute inset-0" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverPanel>
                    </Popover>
                </div>
                : <></>}
        </>
    )
}