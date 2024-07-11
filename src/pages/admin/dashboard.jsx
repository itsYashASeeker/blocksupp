import { fetchF1 } from "@/lib/actions/fetchOwner";
import { useEffect, useState } from "react";
import abi from "../../constants/abi.json";
import contractAddress from "../../constants/address.json";
import { useRouter } from "next/router";
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from "react-moralis";
import { ethers } from 'ethers';
import Navbar from "@/components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { colorsBG } from "@/constants/colors";
// import { DemoContainer } from '@mui/x-date-pickers/internals';
// import { AdapterDayjs } from '@mui/x-date-pickers';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { TimePicker } from '@mui/x-date-pickers';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function AdminDashboard() {



    var supplyContractAddress;

    const router = useRouter();

    const { chainId, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, account, Moralis, deactivateWeb3 } = useMoralis();
    const [admins, setAdmins] = useState({
        count: 0,
        data: []
    })
    const [suppliers, setSuppliers] = useState({
        count: 0,
        data: []
    })
    const [products, setProducts] = useState({
        count: 0,
        data: []
    })
    const [isPaged, setIsPaged] = useState(false);


    var chainIdInt = parseInt(chainId);

    const [compPData, setCompPData] = useState({
        sa: "",
        name: "",
        company: ""
    });

    const [supplierPData, setSuppPData] = useState({
        sa: "",
        name: ""
    });

    const [productData, setProductData] = useState({
        name: "",
        description: ""
    })

    const [productInfoData, setProductInfoData] = useState({
        productId: '',
        place: "",
        time: "",
        workerA: "",
        healthPercent: ""
    })

    const [isOwner, setIsOwner] = useState(false);

    const [isAdd, setIsAdd] = useState(false);

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
                // window.alert(true);
                return;
                // window.alert("Owner")
            }
            else {
                router.push('/')
            }
        } catch (error) {
            // window.alert('yo')
            // pass
            router.push('/')
        }

        // fetchCountAdmins = Number(fetchCountAdmins.toString());
    }

    async function viewAllAdmins() {
        var options = {
            abi: abi,
            contractAddress: supplyContractAddress,
            functionName: "getAdminCount",
            params: {},
        }
        let fetchCountAdmins = await Moralis.executeFunction(options);
        fetchCountAdmins = Number(fetchCountAdmins.toString());
        if (fetchCountAdmins == 0) {
            setAdmins({ ...admins, count: 0 })
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
            data: supdd
        })
    }

    async function viewAllSuppliers() {
        var options = {
            abi: abi,
            contractAddress: supplyContractAddress,
            functionName: "getSupplierCount",
            params: {
                _index: 0
            },
        }
        let fetchCountSuppliers = await Moralis.executeFunction(options);
        fetchCountSuppliers = Number(fetchCountSuppliers.toString());
        if (fetchCountSuppliers == 0) {
            setSuppliers({ ...suppliers, count: 0 })
            return;
        }
        var supdd = [];
        var adminData = admins.data;

        // console.log(adminData);
        for (var i = 0; i < fetchCountSuppliers; i++) {
            options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "getSupplierByindex",
                params: {
                    _index: i
                },
            }
            let fetchSupplier = await Moralis.executeFunction(options);


            var suppPop = adminData.filter((el) => { return el.adminAdd == fetchSupplier.adminAdd })
            // console.log(suppPop);

            if (suppPop.length > 0) {
                suppPop = suppPop[0];
            }

            var supD = {
                ...fetchSupplier,
                populate: suppPop
            }

            supdd.push(supD);
        }

        setSuppliers({
            ...suppliers,
            count: fetchCountSuppliers,
            data: supdd
        })
    }

    async function viewAllProducts() {
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
            // else {
            //     pdata.history = [];
            // }


            // console.log(fetchProduct);
            var spPopulate = suppData.filter((el) => { return el.adminAdd == fetchProduct.supplierAddress })

            if (spPopulate.length > 0) {
                spPopulate = spPopulate[0];
            }

            var supD = {
                ...fetchProduct,
                populate: spPopulate,
                history: productInfo
            }



            supdd.push(supD);

        }
        // console.log(supdd);

        setProducts({
            ...products,
            count: fetchCountProduct,
            data: supdd
        })
    }

    // useEffect(() => {
    //     // console.log(suppliers);
    //     if (isWeb3Enabled)
    //         viewAllSuppliers();
    // }, [admins])

    useEffect(() => {
        if (isWeb3Enabled) {
            checkIfAdmin();
            if (isOwner) {
                if (admins && admins.data.length) {
                    viewAllProducts();
                }
                else {
                    viewAllAdmins();
                }
                return;
            }
        }
        if (!isWeb3Enabled && window.localStorage.getItem('isWeb3Enabled') == "true") {
            enableWeb3();
        }
    }, [isWeb3Enabled, admins, isOwner]);

    // useEffect(() => {
    //     console.log(error, data);
    // }, [error, data])

    async function postNewTempAdmin() {
        try {
            // console.log(compPData);
            const options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "registerTempNewAdmin",
                params: {
                    _company_name: compPData.company,
                    _new_user: compPData.sa,
                    _name: compPData.name,
                },
            }
            let dataPostNewAdmin = await Moralis.executeFunction(options)
                .then((res) => {
                    // console.log(res);
                    res.wait(1);
                    window.alert('Success');
                    // viewAllAdmins();
                })
        } catch (error) {
            window.alert("some error occurred")
            console.log(error);
        }

    }

    async function postNewAdmin(admin, index) {
        try {
            // console.log(compPData);
            const options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "registerNewAdmin",
                params: {
                    _company_name: admin.company_name,
                    _new_user: admin.adminAdd,
                    _name: admin.name,
                    _user_id: admin.adminId,
                    _index: index
                },
            }
            let dataPostNewAdmin = await Moralis.executeFunction(options)
                .then((res) => {
                    // console.log(res);
                    res.wait(1);
                    window.alert('Success');
                    // viewAllAdmins();
                })
        } catch (error) {
            console.log(error);
        }

    }

    async function postNewSupplier() {
        try {
            // var resultData = await runContractFF2({
            const options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "registerNewSupplier",
                params: {
                    senderAddress: supplierPData.sa,
                    _adminAddress: account,
                    _name: supplierPData.name,
                },
            }
            let dataPostNewAdmin = await Moralis.executeFunction(options)
                .then((res) => {
                    console.log(res);
                    res.wait(1);
                    viewAllSuppliers();
                })
        } catch (error) {
            console.log(error);
        }

    }

    async function addNewFruit() {
        try {
            // var resultData = await runContractFF2({
            const options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "addProduct",
                params: {
                    _senderAddress: account,
                    _name: productData.name,
                    _description: productData.description,
                    _image_url: "null"
                },
            }
            let dataAddNewProduct = await Moralis.executeFunction(options)
                .then((res) => {
                    console.log(res);
                    res.wait(1);
                    viewAllProducts();
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

    async function addNewFruitInfo() {
        try {
            // var resultData = await runContractFF2({
            const options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "addProductTInfo",
                params: {
                    _senderAddress: account,
                    _healthPerc: productInfoData.healthPercent,
                    _place: productInfoData.place,
                    _time: currentDateTime(),
                    _productId: productInfoData.productId
                },
            }
            let dataAddNewProduct = await Moralis.executeFunction(options)
                .then((res) => {
                    console.log(res);
                    res.wait(1);
                    viewAllProducts();
                })
        } catch (error) {
            console.log(error);
        }

    }

    function dummySetIsAddFruitHistory(option) {
        // pass
        return option;
    }

    return (
        <>
            <Navbar
                isAdmin={false}
                isOwner={isOwner}
                account={account}
                isWeb3EnableLoading={isWeb3EnableLoading}
                compDash={true}
                setIsAddFruit={setIsAdd}
                setIsAddFruitHistory={dummySetIsAddFruitHistory}
                options={["View Data", "Add Data"]}
            />
            <button className="fixed rounded-full top-4 left-4 text-lg bg-slate-300 text-black px-2 z-10"
                onClick={() => { router.push('/') }}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            {
                account && isOwner ?
                    <div className="p-2 text-white mt-12">
                        < h1 className="font-bold " style={{ color: colorsBG.neonSecondary }}> Admin Dashboard</h1 >
                        {isAdd ?
                            <>
                                <div className="mt-10">
                                    <p>Register a new Admin</p>
                                    <input placeholder="Admin's address" value={compPData?.sa} onChange={(e) => {
                                        setCompPData({
                                            ...compPData,
                                            sa: e.target.value
                                        })
                                    }} />
                                    <input placeholder="Admin's name" value={compPData?.name} onChange={(e) => {
                                        setCompPData({
                                            ...compPData,
                                            name: e.target.value
                                        })
                                    }} />
                                    <input placeholder="Company name" value={compPData?.company} onChange={(e) => {
                                        setCompPData({
                                            ...compPData,
                                            company: e.target.value
                                        })
                                    }} />
                                    <button onClick={postNewTempAdmin}>Register</button>
                                </div>

                                <div className="mt-10">
                                    <p>Register a new supplier</p>
                                    <input placeholder="Supplier's address" value={supplierPData?.sa} onChange={(e) => {
                                        setSuppPData({
                                            ...supplierPData,
                                            sa: e.target.value
                                        })
                                    }} />
                                    <input placeholder="Supplier's name" value={supplierPData?.name} onChange={(e) => {
                                        setSuppPData({
                                            ...supplierPData,
                                            name: e.target.value
                                        })
                                    }} />
                                    <button onClick={postNewSupplier}>Register</button>
                                </div>

                                <div className="mt-10">
                                    <p>Add a new fruit</p>
                                    <input placeholder="Name" value={productData?.name} onChange={(e) => {
                                        setProductData({
                                            ...productData,
                                            name: e.target.value
                                        })
                                    }} />
                                    <input placeholder="Description" value={productData?.description} onChange={(e) => {
                                        setProductData({
                                            ...productData,
                                            description: e.target.value
                                        })
                                    }} />
                                    <button onClick={addNewFruit}>Register</button>
                                </div>

                                <div className="mt-10">
                                    <p>Add Fruit Info</p>
                                    <input placeholder="product id" value={productInfoData?.productId} onChange={(e) => {
                                        setProductInfoData({
                                            ...productInfoData,
                                            productId: e.target.value
                                        })
                                    }} />
                                    <input placeholder="Health percentage" value={productInfoData?.healthPercent} onChange={(e) => {
                                        setProductInfoData({
                                            ...productInfoData,
                                            healthPercent: e.target.value
                                        })
                                    }} />
                                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                                    {/* <DemoContainer components={['TimePicker']}> */}
                                    {/* <TimePicker label="Basic time picker" /> */}
                                    <input placeholder="place" value={productInfoData.place} onChange={(e) => {
                                        setProductInfoData({
                                            ...productInfoData,
                                            place: e.target.value
                                        })
                                    }} />
                                    {/* </DemoContainer> */}
                                    {/* </LocalizationProvider> */}

                                    <button onClick={addNewFruitInfo}>Register</button>
                                </div>
                            </>
                            :
                            <>
                                {admins.count && admins.data.length ?
                                    <div className="mt-10">
                                        <p>Admins</p>
                                        <table className="table-auto border-collapse border-2 border-slate-800">
                                            <thead>
                                                <tr>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Admin Id</th>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Address</th>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Name</th>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Company Name</th>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Approved</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {admins.count && admins.data.map((elAd, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.adminId.toString()}</td>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.adminAdd}</td>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.name}</td>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.company_name}</td>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.approved == false ?
                                                                <button className="bg-slate-300 text-black rounded px-2 py-1 hover:bg-slate-100"
                                                                    onClick={() => { postNewAdmin(elAd, index) }}
                                                                >Approve</button>
                                                                : "true"}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    : <></>}

                                {products.count && products.data.length ?
                                    <div className="mt-10">
                                        <p>Products</p>
                                        <table className="table-auto border-collapse border-2 border-slate-800">
                                            <thead>
                                                <tr>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Product Id</th>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Name</th>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Description</th>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Company</th>
                                                    <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Admin</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.count && products.data.map((elAd, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.productId.toString()}</td>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.name}</td>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1 max-w-24">{elAd.description}</td>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd?.populate?.company_name}</td>
                                                            <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd?.populate?.name}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    : <></>}
                                {products.count && products.data.length > 0 ?
                                    <div className="mt-10">
                                        <p>Products History</p>
                                        <ul className="list-disc">
                                            {products.data.map((product, index) => {
                                                return (
                                                    <li className="list-disc my-6 ml-8">
                                                        <p><span className="text-red-300">{product.name}</span> - by {product?.populate?.company_name}</p>
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
                        }



                    </div >
                    :
                    <div className="w-screen h-screen flex justify-center items-center text-white text-lg">

                        <p className="animate-pulse">Loading...</p>
                    </div>

            }
        </>
    )
}