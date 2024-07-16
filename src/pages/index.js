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
import { colorsBG } from "@/constants/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import { bgcolorHex } from "@/constants/colors";

export const retId = (idname) => {
  return document.getElementById(idname);
}


const inter = Inter({ subsets: ["latin"] });

function UsableCard({ index, numc, tlength, scrollPosition, isScrolling, rowIndex, setModalOpen, data }) {
  const [inCardNumProp, setInCardNumProp] = useState({
    hover: false,
    clicked: false
  });

  return (
    <>
      <div id={`${index}-card-id`} className={`relative w-fit text-2xl mainCard  border-dashed border-current p-4
      ${isScrolling ? 'no-hover' : ''}
      `}
        onMouseLeave={() => { setInCardNumProp({ ...inCardNumProp, hover: false }); }}
        style={{ zIndex: 5 }}
      >
        <div className="absolute top-1/2 left-1/2 rounded-xl  flex justify-center items-end mainCardNumber"
          style={{ transform: "translate(-50%, -50%)", background: colorsBG.secondary, boxShadow: `0 0 0.4rem 0.01rem ${colorsBG.neonTertiary}` }}
          onMouseEnter={() => { if (!isScrolling) { setInCardNumProp({ ...inCardNumProp, hover: true }); } }}
        // onMouseLeave={() => setInCardNumHover(false)}
        >
          <div className={`absolute top-1/2 left-1/2 text-6xl w-full h-full flex justify-center items-center 
          `}
            style={{ transform: "translate(-50%, -60%)" }}
          >
            <span className="text-xs">Block</span><span className="text-slate-200">{index + 1}</span>
          </div>
          <p className="px-1 py-2 text-xs text-center">{data.name}</p>
        </div>

        <div id={`${index}-in-card`} className={`inCard ${inCardNumProp.hover ? "hoverCard" : ""} ${inCardNumProp.clicked ? "openCard" : ""} flex justify-center items-center bg-transparent backdrop-blur-xl	rounded-lg overflow-hidden flex-col h-content border-2 solid border-slate-400  w-full h-full
        cursor-pointer
        `}
          onClick={() => { setInCardNumProp({ ...inCardNumProp, clicked: true }); setModalOpen({ isOpen: false, data: data }); document.body.classList.add('no-scroll') }}
        >
          <div className=" text-left text-sm w-full p-1  p-2"
            style={{ background: colorsBG.neonTertiary }}
          >
            <p>Added by <span className="p-1 rounded bg-slate-800">{data.populate.admin.name}</span></p>
          </div>
          <div className="flex justify-center items-center text-3xl h-full text-bold"><p>{data.name}</p></div>
          <div className="text-sm text-slate-200 p-1 px-2"><p>
            {data.description.slice(0, 50) + "..."}
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

  const { chainId, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis, deactivateWeb3 } = useMoralis();

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

  const [isOwner, setIsOwner] = useState(false);

  const [modalOpen, setModalOpen] = useState({
    isOpen: false,
    data: {}
  });
  const [admins, setAdmins] = useState({
    count: 0,
    data: [],
    status: 'loading'
  })
  const [suppliers, setSuppliers] = useState({
    count: 0,
    data: []
  })
  const [products, setProducts] = useState({
    count: 0,
    data: [],
    status: 'loading'
  })
  const [isPaged, setIsPaged] = useState(false);
  var chainIdInt = parseInt(chainId);
  if (chainIdInt in contractAddress) {
    supplyContractAddress = contractAddress[chainIdInt][contractAddress[chainIdInt].length - 1];
  }
  else {
    supplyContractAddress = null;
  }


  // var numItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  var totalItems = 100;
  // var rowLength = Math.ceil(totalItems / numOfColumns);
  // var columnArray = Array.from({ length: numOfColumns }, (_, index) => index);
  // var rowArray = Array.from({ length: rowLength }, (_, index) => index);

  async function fetchPHistory() {
    let pdata = modalOpen.data;
    setModalOpen({ ...modalOpen, isOpen: true });
    let options = {
      abi: abi,
      contractAddress: supplyContractAddress,
      functionName: "getProductHistoryCount",
      params: {
        _productId: modalOpen.data.productId
      },
    }
    let fetchProductInfoCount = await Moralis.executeFunction(options);
    let productInfo = [];
    if (fetchProductInfoCount > 0) {
      for (var j = fetchProductInfoCount - 1; j >= 0; j--) {
        options = {
          abi: abi,
          contractAddress: supplyContractAddress,
          functionName: "getProductHistoryByIndex",
          params: {
            _index: j,
            _productId: modalOpen.data.productId
          },
        }
        let fetchProductInfo = await Moralis.executeFunction(options);
        productInfo.push(fetchProductInfo);
        // console.log(`Product History--> Product Id: ${fetchProduct.productId} -->${fetchProductInfo}`);
      }
      pdata.history = productInfo;
    }
    else {
      pdata.history = [];
    }
    setModalOpen({ isOpen: true, data: pdata });
  }

  useEffect(() => {
    if (isWeb3Enabled && !modalOpen.isOpen && modalOpen.data && modalOpen.data.productId) {


      fetchPHistory();

      // console.log(fetchProduct);
    }
  }, [isWeb3Enabled, modalOpen])

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

  // useEffect(() => {
  //   if (numOfColumns == 0) {
  //     return;
  //   }
  //   // console.log(numOfColumns);
  //   var rowLength = Math.ceil(totalItems / numOfColumns);
  //   setColumnArray(Array.from({ length: numOfColumns }, (_, index) => index));
  //   setRowArray(Array.from({ length: rowLength }, (_, index) => index));
  // }, [numOfColumns]);

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

  // useEffect(() => {
  //   // console.log(scrollPosition);
  //   var rowLength = rowArray.length;
  //   if (scrollPosition == 0) {
  //     for (var i = 0; i < rowLength; i++) {
  //       var rowId = `${i}-row-id`;
  //       var row = document.getElementById(rowId);
  //       if (row) {
  //         // row.style.width = `100%`;
  //         row.style.transform = `scale(1)`;
  //       }
  //     }
  //   }
  //   if (scrollPosition > 0) {
  //     for (var i = 0; i < rowLength; i++) {
  //       var rowId = `${i}-row-id`;
  //       var row = document.getElementById(rowId);
  //       if (row) {
  //         var rowTop = row.getBoundingClientRect().top;
  //         // rowTop += window.innerHeight / 3;
  //         var windowHeight = window.innerHeight - window.innerHeight * 0.2;
  //         // console.log(cardTop, window.innerHeight);
  //         // if (rowTop < windowHeight) {
  //         // rowTop += 50;
  //         // if (rowTop > (windowHeight / 3) && rowTop < (windowHeight / 3) * 2) {
  //         //   row.style.transform = `scale(1)`;
  //         //   // row.style.width = `100%`;
  //         // }
  //         if (rowTop > windowHeight / 2) {
  //           row.style.transform = `scale(${1 - ((rowTop - windowHeight / 2) / windowHeight / 2) + 0.05})`
  //           // row.style.width = `${100 - ((rowTop - windowHeight / 2) / windowHeight / 2) * 100}%`
  //         }
  //         else {
  //           row.style.transform = `scale(${1 - ((windowHeight / 2 - rowTop) / windowHeight / 2) + 0.05})`
  //           // row.style.width = `${100 - ((windowHeight / 2 - rowTop) / windowHeight / 2) * 100}%`
  //         }
  //         // }
  //       }
  //     }

  //   }
  // }, [scrollPosition])

  // const setZIndexMore = (index) => {
  //   document.getElementById(`${index}-row-id`).style.zIndex = 100;
  // }

  // const removeZIndexMore = (index) => {
  //   document.getElementById(`${index}-row-id`).style.zIndex = 5;
  // }

  async function checkIfAdmin() {

    var options = {
      abi: abi,
      contractAddress: supplyContractAddress,
      functionName: "checkIfOwner",
      params: {},
    }

    try {
      let fetchIfOwner = await Moralis.executeFunction(options);
      if (fetchIfOwner == true || fetchIfOwner == "true") {
        // window.alert('yo')
        setIsOwner(true);
        return;
        // window.alert("Owner")
      }
    } catch (error) {
      // window.alert('yo')
      // pass
    }
    try {
      options = {
        abi: abi,
        contractAddress: supplyContractAddress,
        functionName: "adminExists",
        params: { _senderAddress: account },
      }
      let fetchIfAdmin = await Moralis.executeFunction(options);
      // window.alert(fetchIfAdmin)
      if (fetchIfAdmin == true || fetchIfAdmin == "true") {
        // window.alert("Admin")
        setIsAdmin(true);

      }
      else {
        setIsAdmin(false);
      }
    } catch (error) {
      // window.alert("False");
      // console.log(error.data);
      // setIsAdmin(false);
    }

    // fetchCountAdmins = Number(fetchCountAdmins.toString());
  }

  async function viewAllAdmins() {
    try {

      var options = {
        abi: abi,
        contractAddress: supplyContractAddress,
        functionName: "getAdminCount",
        params: {},
      }
      let fetchCountAdmins = await Moralis.executeFunction(options);
      fetchCountAdmins = Number(fetchCountAdmins.toString());
      if (fetchCountAdmins == 0) {
        setAdmins({ ...admins, count: 0, status: 'success' })
        return;
      }
      var supdd = [];
      for (var i = 0; i < fetchCountAdmins; i++) {
        options = {
          abi: abi,
          contractAddress: supplyContractAddress,
          functionName: "getAdminByindex",
          params: {
            _index: i
          },
        }
        let fetchAdmin = await Moralis.executeFunction(options);
        supdd.push(fetchAdmin);
      }
      setAdmins({
        ...admins,
        count: fetchCountAdmins,
        data: supdd,
        status: 'success'
      })
    } catch (error) {
      console.log(error);
    }

  }

  async function viewAllProducts() {
    try {
      var options = {
        abi: abi,
        contractAddress: supplyContractAddress,
        functionName: "getProductCount",
        params: {
          _index: 0
        },
      }
      let fetchCountProduct = await Moralis.executeFunction(options);
      fetchCountProduct = Number(fetchCountProduct.toString());
      if (fetchCountProduct == 0) {
        setProducts({ ...products, count: 0, status: 'success' })
        return;
      }
      var supdd = [];
      var suppData = admins.data;

      for (var i = 0; i < fetchCountProduct; i++) {
        options = {
          abi: abi,
          contractAddress: supplyContractAddress,
          functionName: "getProductByindex",
          params: {
            _index: i
          },
        }
        let fetchProduct = await Moralis.executeFunction(options);
        var spPopulate = suppData.filter((el) => { return el.adminAdd == fetchProduct.supplierAddress })

        if (spPopulate.length > 0) {
          spPopulate = spPopulate[0];
        }

        var supD = {
          ...fetchProduct,
          populate: { admin: spPopulate }

        }

        supdd.push(supD);

      }

      var rowLength = Math.ceil(supdd.length / numOfColumns);
      setColumnArray(Array.from({ length: numOfColumns }, (_, index) => index));
      setRowArray(Array.from({ length: rowLength }, (_, index) => index));

      setProducts({
        ...products,
        count: fetchCountProduct,
        data: supdd,
        status: 'success'
      })
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    if (isWeb3Enabled) {
      checkIfAdmin();
    }
  }, [isWeb3Enabled, account])

  useEffect(() => {
    if (isWeb3Enabled) {
      if (admins && (admins.data.length || admins.status != "loading")) {
        // console.log(admins);
        if (products && (products.data.length || products.status != "loading")) {
          // window.alert(account)
        }
        else {
          viewAllProducts();
        }
      }
      else {
        viewAllAdmins();
      }
      return;
    }
    else if (window.localStorage.getItem('isWeb3Enabled') == "true"
      || window.localStorage.getItem('isWeb3Enabled')
    ) {
      enableWeb3();
      // deactivateWeb3();
    }
  }, [isWeb3Enabled, admins, products])


  return (
    <div className="">
      <div className="relative w-full h-full overflow-y-auto overflow-x-hidden"
        style={{ background: colorsBG.primary, paddingTop: "4.5rem" }}
      >
        <Navbar
          isAdmin={isAdmin}
          isOwner={isOwner}
          account={account}
          isWeb3EnableLoading={isWeb3EnableLoading}
          compDash={false}
        />
        {/* <div className=" w-full h-full">
          <p className="text">Hello</p>
          <p>{isAdmin ? "Admin Sir" : "User Sir"}</p>
        </div> */}
        <div className="w-full h-full flex justify-center items-center flex-col gap-4 overflow-y-auto overflow-x-hidden"

          style={{ minHeight: "calc(100vh - 4.5rem)" }}
        >
          {account ?

            <div className="w-full h-full text-white flex justify-center items-center flex-wrap overflow-y-auto overflow-x-hidden"
              style={{ zIndex: 5 }}
            >
              {products && products.status == "success"
                ?
                <>
                  {products.data.length > 0 ?
                    <>
                      {products && products.data.length && rowArray && rowArray.map((index, d) => {
                        return (
                          <div id={`${index}-row-id`} className="w-full h-full text-white flex justify-center items-center overflow-hidden"
                            style={{ maxWidth: "100vw", zIndex: 5 }}
                          >
                            {columnArray && columnArray.length > 0 && columnArray.map((index2, d2) => {
                              return (
                                <>
                                  {(index * numOfColumns + index2) < products.data.length ?
                                    <UsableCard index={index * numOfColumns + index2} numc={numOfColumns} tlength={products.data.length} scrollPosition={scrollPosition}
                                      isScrolling={isScrolling}
                                      // setZIndexMore={setZIndexMore}
                                      // removeZIndexMore={removeZIndexMore}
                                      data={products.data[index * numOfColumns + index2]}
                                      rowIndex={index}
                                      key={index * numOfColumns + index2}
                                      setModalOpen={setModalOpen}
                                    />
                                    : <></>
                                  }
                                </>

                              )
                            })}
                          </div>
                        )
                      })}
                    </>
                    :
                    <p className="text-red-300 font-bold text-lg">No Data</p>
                  }
                </>
                :
                <>
                  <p className="animate-pulse">Loading...</p>
                </>
              }

              {/* {products && products.data.length && products.data.map((product, index) => {
              return (
                <UsableCard
                  index={index * numOfColumns + index}
                  numc={numOfColumns} tlength={totalItems} scrollPosition={scrollPosition}
                  isScrolling={isScrolling}
                  // setZIndexMore={setZIndexMore}
                  // removeZIndexMore={removeZIndexMore}
                  rowIndex={index}
                  key={index * numOfColumns + index}
                  setModalOpen={setModalOpen}
                />
              )
            })} */}

            </div>


            :
            <p className="text-red-100 font-bold text-lg">Please connect your wallet</p>
          }
        </div>
      </div>
      {modalOpen.isOpen && modalOpen.data ?
        <div className="fixed top-0 left-0 h-screen w-screen bg-transparent backdrop-blur-md overflow-hidden z-10
          flex justify-center items-center
          "
        >
          <div className="top-0 right-0 absolute">
            <button className="relative bg-red-900 rounded-full text-white w-24 h-24 hover:bg-red-800"
              onClick={() => {
                setModalOpen(false); document.body.classList.remove('no-scroll')
              }}
              style={{
                transform: "translate(50%,-50%)"
              }}

            ><span
              className="absolute text-base"
              style={{ left: "30%", bottom: "30%", transform: "translate(-50%,50%)" }}
            ><FontAwesomeIcon icon={faXmark} /> </span></button>
          </div>
          <div className="h-fit w-fit rounded-md backdrop-blur-lg text-white overflow-auto flex justify-center items-center gap-4 flex-col"
            style={{ minWidth: "60vw", maxWidth: "90vw", width: "clamp(20rem,60vw,40rem)" }}
          >
            <p className="px-3 py-2 rounded-tl-lg rounded-tr-lg  w-full" style={{ background: colorsBG.neonTertiary }}>Added by <span className="p-1 bg-slate-800">{modalOpen.data.populate.admin.name}</span> from <span className="p-1 bg-white" style={{ color: colorsBG.neonTertiary }}>{modalOpen.data.populate.admin.company_name}</span></p>
            <div className="text-center rounded p-4 w-full h-fit backdrop-blur-3xl"
              style={{ background: "rgba(0,0,0,0.7)" }}
            >
              <p className="text-center text-3xl font-bold mb-2">{modalOpen?.data?.name}</p>
              <p>{modalOpen?.data?.description}</p>
            </div>

            <div className="rounded p-4 w-full h-full backdrop-blur-3xl rounded-bl-lg rounded-br-lg"
              // style={{ background: "rgba(0,106,104,0.4)" }}
              style={{ background: "rgba(0,0,0,0.7)" }}
            >
              {modalOpen.data.history ?
                <>
                  {modalOpen.data.history.length > 0 ?
                    <>
                      {modalOpen.data.history.map((history, index) => {
                        return (
                          <div className="w-full flex justify-start">
                            <div className="w-full flex justify-start gap-3 ">
                              {modalOpen.data.history.length > 1 ?
                                <div className="h-full w-fit flex flex-col justify-start items-center">
                                  <div className="flex rounded-full h-4 w-4 bg-slate-300"></div>
                                  {modalOpen.data.history.length == index + 1 ?
                                    <></>
                                    : <div className="flex bg-slate-500 h-full" style={{ width: "0.1rem" }}></div>
                                  }

                                </div>
                                : <></>
                              }

                              <div className="flex flex-col h-fit">
                                <p className="text-base">{history.time}</p>
                                <p className="mt-2"><span className="text-red-200">Place: </span>{history.place}</p>
                                <p><span className="text-red-200">Health Percentage: </span>{Number(history.healthPerc)}%</p>
                                <div className="mb-4"></div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </>
                    :
                    <>
                      <p>No data added!</p>
                    </>
                  }
                </>
                :
                <p className="animate-pulse">Loading...</p>
              }
              {/* Timeline Div */}
              {/* // <div className="w-full flex justify-start">
              //   <div className="w-full flex justify-start gap-3 ">
              //     <div className="h-full w-fit flex flex-col justify-start items-center">
              //       <div className="flex rounded-full h-3 w-3 bg-slate-300"></div>
              //       <div className="flex h-full bg-slate-500 " style={{ width: "0.1rem" }}></div>
              //     </div>
              //     <div className="flex flex-col h-fit">
              //       <p className="text-base">6th July, 2003. 12:00 PM</p>
              //       <p className="mt-2"><span className="text-red-200">Place: </span>Mumbai</p>
              //       <p><span className="text-red-200">Health Percentage: </span>89%</p>
              //       <div className="mb-2"></div>
              //     </div>
              //   </div>
              // </div> */}
            </div>

          </div>
        </div>
        : <></>}

    </div>
  );
}
