import { faArrowCircleLeft, faArrowLeft, faCheckCircle, faRefresh, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import abi from "../../constants/abi.json";
import contractAddress from "../../constants/address.json";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Navbar from "@/components/Navbar";
import { colorsBG } from "@/constants/colors";


export default function adminDash() {

    var supplyContractAddress;
    const router = useRouter();
    const [regState, setRegState] = useState({ name: '', description: '', image_url: '', loading: false, status: '' });
    const [regHState, setRegHState] = useState({ fruit: '', place: '', time: '', healthPerc: '' });
    // const [isAdmin, setIsAdmin] = useState(false);
    const [isAddFruit, setIsAddFruit] = useState(false);
    const [isAddFruitHistory, setIsAddFruitHistory] = useState(false);
    const [selected, setSelected] = useState()

    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const [products, setProducts] = useState({
        status: 'loading',
        data: []
    })

    const { chainId, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis, deactivateWeb3 } = useMoralis();

    var chainIdInt = parseInt(chainId);

    if (chainIdInt in contractAddress) {
        supplyContractAddress = contractAddress[chainIdInt][contractAddress[chainIdInt].length - 1];
    }
    else {
        supplyContractAddress = null;
    }


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
            else {

            }
        } catch (error) {
            // window.alert('yo')
            // pass
            // router.push('/')
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
            router.push('/')
        }

        // fetchCountAdmins = Number(fetchCountAdmins.toString());
    }

    async function viewAllProducts() {
        try {
            setProducts({ ...products, status: 'loading' });
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
                setProducts({ ...products, count: 0 })
                return;
            }
            var supdd = [];
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


                options = {
                    abi: abi,
                    contractAddress: supplyContractAddress,
                    functionName: "getProductHistoryCount",
                    params: {
                        _productId: fetchProduct.productId
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
                                _productId: fetchProduct.productId
                            },
                        }
                        let fetchProductInfo = await Moralis.executeFunction(options);
                        productInfo.push(fetchProductInfo);
                        // console.log(`Product History--> Product Id: ${fetchProduct.productId} -->${fetchProductInfo}`);
                    }
                    // pdata.history = productInfo;
                }


                // console.log(account);
                var supplierAddress = String(fetchProduct.supplierAddress).toLowerCase()
                var accountAddress = String(account).toLowerCase();
                // console.log(
                //     supplierAddress, typeof supplierAddress,
                //     accountAddress, typeof accountAddress
                // );
                if (supplierAddress == accountAddress) {
                    let fp = { ...fetchProduct };
                    fp.history = productInfo;
                    supdd.push({ ...fp });
                    // console.log(String(fetchProduct.supplierAddress).toLowerCase(), String(account).toLowerCase());
                }

            }
            // console.log(supdd);

            setProducts({
                ...products,
                status: 'success',
                data: supdd,
                count: supdd.length
            })
        } catch (error) {
            // console.log(error);
            setProducts({ ...products, status: 'error' });
        }

    }

    useEffect(() => {
        if (isWeb3Enabled) {
            if (products && (products.status == "success" || products.status == "error")) {
                // window.alert(account)

            }
            else {
                checkIfAdmin();
                viewAllProducts();
            }

            return;
        }
        if (!isWeb3Enabled && window.localStorage.getItem('isWeb3Enabled') == "true") {
            // async function enableWeb3Moralis() {
            //     // await Moralis.enableWeb3();
            //     // setTimeout(() => { console.log("..."); }, 10000)
            // }
            // enableWeb3Moralis();
            enableWeb3();
        }
        // console.log(account);
    }, [isWeb3Enabled, account]);

    async function addNewFruit() {
        if (!account || !regState.name
            // || !regState.description
        ) {
            window.alert("Please fill in all fields");
            return;
        }
        setRegState({ ...regState, loading: true });
        try {
            // console.log(compPData);
            const options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "addProduct",
                params: {
                    _description: regState.description,
                    _senderAddress: account,
                    _name: regState.name,
                    _image_url: "null"
                },
            }
            let dataPostNewAdmin = await Moralis.executeFunction(options)
                .then((res) => {
                    setRegState({ ...regState, loading: false, status: 'success' });
                })
        } catch (error) {
            console.log(error);
        }

    }

    const currentDateTime = () => {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        return `${date} ${time}`;
    };


    async function addNewHistory() {
        if (!account || !regHState.place || !regHState.healthPerc || !selected || !selected.productId
            // || !regState.description
        ) {
            window.alert("Please fill in all fields");
            return;
        }

        setRegHState({ ...regHState, loading: true });
        try {
            // console.log(compPData);
            const options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "addProductTInfo",
                params: {
                    // _description: regState.description,
                    _senderAddress: account,
                    _healthPerc: Number(regHState.healthPerc),
                    _place: regHState.place,
                    _time: currentDateTime(),
                    _productId: Number(selected.productId)
                    // _image_url: regState.image_url
                },
            }
            // console.log(options);
            // return;
            let dataPostNewAdmin = await Moralis.executeFunction(options)
                .then((res) => {
                    setRegHState({ ...regHState, loading: false, status: 'success' });
                })
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <Navbar
                isAdmin={isAdmin}
                isOwner={isOwner}
                account={account}
                isWeb3EnableLoading={isWeb3EnableLoading}
                compDash={true}
                setIsAddFruit={setIsAddFruit}
                setIsAddFruitHistory={setIsAddFruitHistory}
                options={["View Data", "Add Fruit", "Add Fruit History"]}
            />
            <button className="fixed rounded-full top-4 left-4 text-lg bg-slate-300 text-black px-2 z-10"
                onClick={() => { router.push('/') }}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            {/* {account */}
            {account ?
                < div className="text-white w-screen h-screen pt-4"
                    style={{ minHeight: "calc(100vh - 4.5rem)" }}
                >

                    <div className="flex justify-center items-center h-full gap-4"

                    >
                        {!isAddFruit && !isAddFruitHistory ?
                            <>

                                <div className="mt-10 w-full p-4 h-full">
                                    <div className="w-full flex justify-between">
                                        <p className="font-bold" style={{ color: colorsBG.neonSecondary }} >Products</p>
                                        <button className="bg-slate-700 px-2 py-1 rounded-md hover:bg-slate-900"
                                            onClick={viewAllProducts}
                                            disabled={products.status == "loading" ? true : false}
                                        >
                                            <span className="text-sm"><FontAwesomeIcon icon={faRefresh} /></span>
                                            <span className="ml-2">Refresh</span>
                                        </button>
                                    </div>

                                    {products.status == "success" && products.count && products.data.length ?
                                        <>
                                            <table className="table-auto border-collapse border-2 border-slate-800">
                                                <thead>
                                                    <tr>
                                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Product Id</th>
                                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Name</th>
                                                        {/* <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Company</th>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Admin</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products.count && products.data.map((elAd, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.productId.toString()}</td>
                                                                <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.name}</td>
                                                                {/* <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd?.populate?.company_name}</td>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd?.populate?.name}</td> */}
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            {products.count && products.data.length > 0 ?
                                                <div className="mt-10">
                                                    <p className="font-bold" style={{ color: colorsBG.neonSecondary }}>Products History</p>
                                                    <ul className="list-disc">
                                                        {products.data.map((product, index) => {
                                                            return (
                                                                <li className="list-disc my-6 ml-8">
                                                                    <p><span className="text-red-300">{product.name}</span></p>
                                                                    <div className="mt-2 ml-2">
                                                                        {product.history && product.history.map((phis, i2) => {
                                                                            return (
                                                                                <div key={i2} className="w-fit">
                                                                                    <p>Time: {phis.time}</p>
                                                                                    <p>Place: {phis.place}</p>
                                                                                    <p>Health Percentage: {Number(phis.healthPerc)}%</p>
                                                                                    {i2 != product.history.length - 1 ?
                                                                                        <div className="h-0 w-full bg-slate-300 border-t-2 border-dashed my-2"></div>
                                                                                        : <></>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </li>
                                                            )
                                                        })}

                                                    </ul>


                                                </div >
                                                : <></>
                                            }
                                        </>
                                        :
                                        <>
                                            {
                                                products.status == "loading" ?
                                                    < p className="animate-pulse" > Loading...</p>
                                                    : <p>No Data</p>
                                            }
                                        </>
                                    }
                                </div>

                            </>
                            :
                            <></>
                        }
                        {isAddFruit ?


                            <div className="rounded-md border-2 border-dashed border-slate-400 p-2 text-center relative"
                                style={{ width: "clamp(20rem,60vw,40rem)" }}
                            >
                                {regState.status == "success" ?
                                    <>
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-7xl my-6" />
                                        <p className="mb-6">The fruit has been added succesfully. Updates may take longer than usual.</p>

                                    </>
                                    :
                                    <>
                                        <button className="absolute top-2 right-2 rounded-full px-2 py-1 bg-slate-400" onClick={() => { setIsAddFruit(false) }}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                        <p className="mt-4 mb-12 text-2xl">Add Fruit</p>
                                        <div className="px-4">
                                            <div className="text-left w-full mb-4">
                                                <p>Account</p>
                                                <input placeholder="account" className="bg-slate-600 text-white rounded w-full px-2 py-1" value={account} disabled={true} />
                                            </div>
                                            <div className="text-left w-full mb-4">
                                                <p>Name</p>
                                                <input
                                                    disabled={regState.loading ? true : false}
                                                    placeholder="name" className="bg-slate-600 text-white rounded w-full px-2 py-1" value={regState.name} onChange={(e) => { setRegState({ ...regState, name: e.target.value }) }} />
                                            </div>
                                            <div className="text-left w-full mb-4">
                                                <p>Description</p>
                                                <input
                                                    disabled={regState.loading ? true : false}
                                                    placeholder="company name" className="bg-slate-600 text-white rounded w-full px-2 py-1" value={regState.description} onChange={(e) => { setRegState({ ...regState, description: e.target.value }) }} />
                                            </div>
                                            <div className="text-left w-full mb-4">
                                                <p>Image url</p>
                                                <input
                                                    disabled={regState.loading ? true : false}
                                                    placeholder="company name" className="bg-slate-600 text-white rounded w-full px-2 py-1" value={regState.image_url} onChange={(e) => { setRegState({ ...regState, image_url: e.target.value }) }} />
                                            </div>
                                            <button className={`bg-slate-800 text-white px-4 py-2 rounded hover:enabled:bg-slate-700 mb-6 w-full`}
                                                disabled={regState.loading || (!account || !regState.name
                                                    // || !regState.description
                                                ) ? true : false}
                                                onClick={addNewFruit}
                                            >{regState.loading ? "Loading..." : "Submit"}</button>
                                        </div>
                                    </>

                                }
                            </div>
                            :
                            <>

                            </>

                        }
                        {isAddFruitHistory ?
                            <div className="rounded-md border-2 border-dashed border-slate-400 p-2 text-center relative"
                                style={{ width: "clamp(20rem,60vw,40rem)" }}
                            >
                                {regHState.status == "success" ?
                                    <>
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-7xl my-6" />
                                        <p className="mb-6">The fruit history has been added succesfully. Updates may take longer than usual.</p>

                                    </>
                                    :
                                    <>
                                        <button className="absolute top-2 right-2 rounded-full px-2 py-1 bg-slate-400" onClick={() => { setIsAddFruitHistory(false) }}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                        <p className="mt-4 mb-12 text-2xl">Add Fruit History</p>
                                        <div className="px-4">
                                            <div className="text-left w-full mb-4">
                                                <p>Account</p>
                                                <input placeholder="account" className="bg-slate-600 text-white rounded w-full px-2 py-1" value={account} disabled={true} />
                                            </div>
                                            {products.status == "success" ?
                                                <>
                                                    {products.data.length > 0 ?
                                                        <Listbox value={selected} onChange={setSelected}>
                                                            <p className="text-left">Fruit</p>
                                                            {/* <Label className="block text-sm font-medium leading-6 text-slate-400">Assigned to</Label> */}
                                                            <div className="relative">
                                                                <ListboxButton className="relative w-full cursor-default rounded-md bg-slate-600 py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm sm:text-sm sm:leading-6">
                                                                    <span className="flex items-center">
                                                                        {/* <img alt="" src={selected.avatar} className="h-5 w-5 flex-shrink-0 rounded-full" /> */}
                                                                        {selected ?
                                                                            <>
                                                                                <span className="block truncate text-white">{selected.name}</span>
                                                                                {/* <span className="text-slate-200 ml-4">by {selected?.populate?.admin?.name}</span> */}
                                                                            </> :
                                                                            <span className="block truncate text-slate-400">Select Fruit</span>
                                                                        }

                                                                    </span>
                                                                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                                                        <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-100" />
                                                                    </span>
                                                                </ListboxButton>

                                                                <ListboxOptions
                                                                    transition
                                                                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-slate-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                                                                >
                                                                    {products.data.length && products.data.map((product, index) => (
                                                                        <ListboxOption
                                                                            key={index}
                                                                            value={product}
                                                                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white hover:bg-slate-900"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                {/* <img alt="" src={person.avatar} className="h-5 w-5 flex-shrink-0 rounded-full" /> */}
                                                                                <span className="text-white block truncate group-data-[selected]:font-semibold">
                                                                                    {product?.name}
                                                                                </span>
                                                                                {/* <span className="text-slate-200 ml-4">by {product?.populate?.admin?.name}</span> */}
                                                                            </div>

                                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                                                                <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                                                            </span>
                                                                        </ListboxOption>
                                                                    ))}
                                                                </ListboxOptions>
                                                            </div>
                                                        </Listbox>
                                                        :
                                                        <p>No fruits found</p>
                                                    }
                                                </>

                                                :
                                                <>
                                                    {products.status == "loading" ?
                                                        <p className="animate-pulse">Loading fruits...</p> :
                                                        <>
                                                            {products.status == "error" ?
                                                                <p>Error occurred in fetching fruits!</p> :
                                                                <></>
                                                            }
                                                        </>

                                                    }
                                                </>

                                            }
                                            <div className="text-left w-full mb-4 mt-4">
                                                <p>Place</p>
                                                <input
                                                    disabled={regHState.loading ? true : false}
                                                    placeholder="place" className="bg-slate-600 text-white rounded w-full px-2 py-1" value={regHState.place} onChange={(e) => { setRegHState({ ...regHState, place: e.target.value }) }} />
                                            </div>
                                            <div className="text-left w-full mb-4">
                                                <p>Health Percentage</p>
                                                <input
                                                    type="number"
                                                    disabled={regHState.loading ? true : false}
                                                    placeholder="health percentage" className="bg-slate-600 text-white rounded w-full px-2 py-1" value={regHState.healthPerc} onChange={(e) => { if (e.target.value == "" || e.target.value <= 100) setRegHState({ ...regHState, healthPerc: e.target.value }) }} />
                                            </div>
                                            <button className={`bg-slate-800 text-white px-4 py-2 rounded hover:enabled:bg-slate-700 mb-6 w-full`}
                                                disabled={regHState.loading || (!account || !regHState.place || !regHState.healthPerc || !selected
                                                    // || !regState.description
                                                ) ? true : false}
                                                onClick={addNewHistory}
                                            >{regHState.loading ? "Loading..." : "Submit"}</button>
                                        </div>
                                    </>

                                }
                            </div>
                            :
                            <>

                            </>
                        }
                    </div>

                </div >

                :
                <p>Loading...</p>
            }
            {/* : <></>} */}

        </>
    )
}