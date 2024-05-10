import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import abi from "../constants/abi.json";
import contractAddress from "../constants/address.json";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { NcheckIfOwner } from "@/lib/features/blocksupp/blockSlice";
import { fetchF1 } from "@/lib/actions/fetchOwner";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  var supplyContractAddress;

  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);

  // const dispatch = useAppDispatch();
  // const selector = useAppSelector(state => state.data);

  // const { chainId, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis, deactivateWeb3 } = useMoralis();
  // var { runContractFunction: runContractFF } = useWeb3Contract();
  // var chainIdInt = parseInt(chainId);
  // if (chainIdInt in contractAddress) {
  //   supplyContractAddress = contractAddress[chainIdInt][0];
  // }
  // else {
  //   supplyContractAddress = null;
  // }



  // async function runCheckIfOwner() {
  //   console.log("yuuu");
  //   var resultData = await runContractFF({
  //     params:
  //     {
  //       abi: abi,
  //       contractAddress: supplyContractAddress,
  //       functionName: "checkIfOwner",
  //       params: {},
  //     }
  //   })
  //   resultData = resultData.toString();
  //   console.log(resultData);
  //   if (resultData == "true") {
  //     setIsAdmin(true);
  //   }
  //   else {
  //     setIsAdmin(false);
  //   }
  // }

  // useEffect(() => {

  //   async function checkWeb3EnabledAndAction() {
  //     if (isWeb3Enabled) {
  //       // const resultNC = await runCheckIfOwner();
  //       // console.log(resultNC);
  //       // runCheckIfOwner();
  //       return;
  //     }
  //     if (window.localStorage.getItem('isWeb3Enabled') == "true") {
  //       // enableWeb3();
  //     }
  //   }
  //   checkWeb3EnabledAndAction();

  // }, [isWeb3Enabled]);

  // useEffect(() => {

  //   Moralis.onAccountChanged((account) => {
  //     // console.log(`Account changed!!!!!!!!`);
  //     if (account == null) {
  //       window.localStorage.removeItem('isWeb3Enabled')
  //       deactivateWeb3();
  //     }
  //   })

  // }, [supplyContractAddress])

  // console.log(account);


  return (
    <>
      <div className="font-mono bg-slate-100 w-full h-full min-h-screen">
        <Navbar />
        {/* <div className=" w-full h-full">
          <p className="text">Hello</p>
          <p>{isAdmin ? "Admin Sir" : "User Sir"}</p>
        </div> */}

      </div>
    </>
  );
}
