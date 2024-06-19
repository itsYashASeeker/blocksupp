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
import { bgcolorHex } from "@/constants/colors";


const inter = Inter({ subsets: ["latin"] });

function UsableCard({ index, numc, tlength, scrollPosition, isScrolling }) {
  const [inCardNumHover, setInCardNumHover] = useState();
  // function giveBorders() {
  //   if (index < numc) {
  //     if (index == 0) {
  //       // console.log(index);
  //       return "border-r border-b";
  //     }
  //     else if (index == numc - 1) {
  //       return "border-l border-b";
  //     }
  //     else {
  //       return "border-r border-l border-b";
  //     }
  //   }
  //   else if ((tlength - numc) <= index) {
  //     if ((tlength - numc) == index) {
  //       return "border-r border-t";
  //     }
  //     else if (index == tlength - 1) {
  //       return "border-l border-t";
  //     }
  //     else {
  //       return "border-r border-l border-t";
  //     }
  //   }
  //   else {
  //     if (index % numc == 0) {
  //       return "border-r border-b border-t";
  //     }
  //     else if (index % numc == numc - 1) {
  //       return "border-l border-b border-t";
  //     }
  //     else {
  //       return "border";
  //     }
  //   }
  // }

  // useEffect(() => {
  //   // console.log(scrollPosition);
  //   if (scrollPosition == 0) {
  //     for (var i = 0; i < tlength; i++) {
  //       var cardId = `${i}-card-id`;
  //       var card = document.getElementById(cardId);
  //       if (card) {
  //         card.style.transform = `scale(1)`;
  //       }
  //     }
  //   }
  //   if (scrollPosition > 0) {
  //     for (var i = 0; i < tlength; i++) {
  //       var cardId = `${i}-card-id`;
  //       var card = document.getElementById(cardId);
  //       if (card) {
  //         var cardTop = card.getBoundingClientRect().top;
  //         // console.log(cardTop, window.innerHeight);
  //         if (cardTop < window.innerHeight) {
  //           if (cardTop > (window.innerHeight / 3) && cardTop < (window.innerHeight / 3) * 2) {
  //             card.style.transform = `scale(1)`;
  //           }
  //           else if (cardTop > window.innerHeight / 2) {
  //             card.style.transform = `scale(${1 - ((cardTop - window.innerHeight / 2) / window.innerHeight / 2)})`
  //           }
  //           else {
  //             card.style.transform = `scale(${1 - ((window.innerHeight / 2 - cardTop) / window.innerHeight / 2)})`

  //           }
  //         }
  //       }
  //     }

  //   }
  // }, [scrollPosition])


  return (
    <>
      <div id={`${index}-card-id`} className={`relative w-fit text-2xl mainCard  border-dashed border-current p-4
      ${isScrolling ? 'no-hover' : ''}
      `}
        onMouseLeave={() => setInCardNumHover(false)}

      >
        <div className="absolute top-1/2 left-1/2 bg-slate-600 rounded-xl  flex justify-center items-end mainCardNumber"
          style={{ transform: "translate(-50%, -50%)" }}
          onMouseEnter={() => { if (!isScrolling) setInCardNumHover(true) }}
        // onMouseLeave={() => setInCardNumHover(false)}
        >
          <div className={`absolute top-1/2 left-1/2 text-6xl w-full h-full flex justify-center items-center 
          `}
            style={{ transform: "translate(-50%, -60%)" }}
          >
            <span className="text-xs">Block</span><span className="text-slate-200">{index + 1}</span>
          </div>
          <p className="px-1 py-2 text-xs text-center">Hint text: "Hello worlduub"</p>
        </div>

        <div className={`inCard ${inCardNumHover ? "hoverCard" : ""} flex justify-center items-center bg-transparent backdrop-blur-xl	rounded-lg overflow-hidden flex-col h-content border-2 solid border-slate-400  w-full h-full`}
        >
          <div className=" text-left text-sm w-full p-1 bg-gray-700 p-2">
            <p>Added by <span className="p-1 rounded bg-slate-800">HQ</span></p>
          </div>
          <div className="flex justify-center items-center text-2xl h-full"><p>Apple B1</p></div>
          <div className="text-sm text-slate-200 p-1"><p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p></div>
        </div>
      </div>
      {index % numc < numc - 1 && tlength - index > 1 ?

        <div className="dividerCards"></div>
        : <></>
      }
    </>
  )
}

export default function Home() {
  var supplyContractAddress;

  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [numOfColumns, setNumOfColumns] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const [columnArray, setColumnArray] = useState([]);
  const [rowArray, setRowArray] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);



  // var numItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  var totalItems = 100;
  // var rowLength = Math.ceil(totalItems / numOfColumns);
  // var columnArray = Array.from({ length: numOfColumns }, (_, index) => index);
  // var rowArray = Array.from({ length: rowLength }, (_, index) => index);


  useEffect(() => {
    let scrollTimer;

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setIsScrolling(true);

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 200); // Adjust the delay as needed
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousewheel', handleScroll);
    window.addEventListener('touchmove', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousewheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (numOfColumns == 0) {
      return;
    }
    // console.log(numOfColumns);
    var rowLength = Math.ceil(totalItems / numOfColumns);
    setColumnArray(Array.from({ length: numOfColumns }, (_, index) => index));
    setRowArray(Array.from({ length: rowLength }, (_, index) => index));
  }, [numOfColumns]);

  useEffect(() => {
    // console.log(windowSize);
    if (windowSize.width == 0) {
      return;
    }
    if (windowSize.width > 1250) {
      setNumOfColumns(4);
    }
    else if (windowSize.width > 950) {
      setNumOfColumns(3)
    }
    else if (windowSize.width > 650) {
      setNumOfColumns(2);
    }
    else {
      setNumOfColumns(1);
    }
  }, [windowSize])

  useEffect(() => {
    // console.log(scrollPosition);
    var rowLength = rowArray.length;
    if (scrollPosition == 0) {
      for (var i = 0; i < rowLength; i++) {
        var rowId = `${i}-row-id`;
        var row = document.getElementById(rowId);
        if (row) {
          // row.style.width = `100%`;
          row.style.transform = `scale(1)`;
        }
      }
    }
    if (scrollPosition > 0) {
      for (var i = 0; i < rowLength; i++) {
        var rowId = `${i}-row-id`;
        var row = document.getElementById(rowId);
        if (row) {
          var rowTop = row.getBoundingClientRect().top;
          var windowHeight = window.innerHeight - window.innerHeight * 0.2;
          // console.log(cardTop, window.innerHeight);
          if (rowTop < windowHeight) {
            if (rowTop > (windowHeight / 3) && rowTop < (windowHeight / 3) * 2) {
              // row.style.width = `100%`;
            }
            else if (rowTop > windowHeight / 2) {
              row.style.transform = `scale(${1 - ((rowTop - windowHeight / 2) / windowHeight / 2) + 0.1})`
              // row.style.width = `${100 - ((rowTop - windowHeight / 2) / windowHeight / 2) * 100}%`
            }
            else {
              row.style.transform = `scale(${1 - ((windowHeight / 2 - rowTop) / windowHeight / 2) + 0.1})`
              // row.style.width = `${100 - ((windowHeight / 2 - rowTop) / windowHeight / 2) * 100}%`
            }
          }
        }
      }

    }
  }, [scrollPosition])

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
      <div className="relative font-mono w-full h-full"
        style={{ background: bgcolorHex(), paddingTop: "4.5rem" }}
      >
        <Navbar />
        {/* <div className=" w-full h-full">
          <p className="text">Hello</p>
          <p>{isAdmin ? "Admin Sir" : "User Sir"}</p>
        </div> */}
        <div className="w-full h-full flex justify-center items-center flex-col gap-4"

          style={{ minHeight: "calc(100vh - 4.5rem)", background: bgcolorHex() }}
        >
          <div className="w-content h-full text-white flex justify-center items-center flex-wrap">
            {rowArray && rowArray.map((index, d) => {
              return (
                <div id={`${index}-row-id`} className="w-content h-full text-white flex justify-center items-center ">
                  {columnArray.map((index2, d2) => {
                    return (
                      <>
                        {(index * numOfColumns + index2) < totalItems ?
                          <UsableCard index={index * numOfColumns + index2} numc={numOfColumns} tlength={totalItems} scrollPosition={scrollPosition}
                            isScrolling={isScrolling}
                          />
                          : <></>
                        }
                      </>

                    )
                  })}
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </>
  );
}
