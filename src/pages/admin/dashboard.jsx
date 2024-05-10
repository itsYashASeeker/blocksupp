import { fetchF1 } from "@/lib/actions/fetchOwner";
import { useEffect, useState } from "react";
import abi from "../../constants/abi.json";
import contractAddress from "../../constants/address.json";
import { useRouter } from "next/router";
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from "react-moralis";
import { ethers } from 'ethers';
// import { DemoContainer } from '@mui/x-date-pickers/internals';
import { AdapterDayjs } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers';
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
        name: ""
    })

    const [productInfoData, setProductInfoData] = useState({
        productId: '',
        place: "",
        time: "",
        workerA: "",
        healthPercent: ""
    })

    if (chainIdInt in contractAddress) {
        supplyContractAddress = contractAddress[chainIdInt][contractAddress[chainIdInt].length - 1];
    }
    else {
        supplyContractAddress = null;
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
        var suppData = suppliers.data;
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
                functionName: "getProductHist",
                params: {
                    _productId: fetchProduct.productId
                },
            }
            let fetchProductInfo = await Moralis.executeFunction(options);

            console.log(fetchProductInfo);

            var spPopulate = suppData.filter((el) => { return el.supplierDD == fetchProduct.supplierAddress })

            if (spPopulate.length > 0) {
                spPopulate = spPopulate[0];
            }

            var supD = {
                ...fetchProduct,
                populate: spPopulate

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

    useEffect(() => {
        // console.log(suppliers);
        if (isWeb3Enabled)
            viewAllSuppliers();
    }, [admins])

    useEffect(() => {
        if (isWeb3Enabled)
            viewAllProducts();
    }, [suppliers])

    useEffect(() => {
        if (isWeb3Enabled) {
            viewAllAdmins();
            viewAllSuppliers();
            viewAllProducts();
            return;
        }
        if (window.localStorage.getItem('isWeb3Enabled') == "true") {
            async function enableWeb3Moralis() {
                // await Moralis.enableWeb3();
                // setTimeout(() => { console.log("..."); }, 10000)
            }
            enableWeb3Moralis();
            enableWeb3();
        }
        // console.log(account);
    }, [isWeb3Enabled]);

    // useEffect(() => {
    //     console.log(error, data);
    // }, [error, data])


    async function postNewAdmin() {
        try {
            // console.log(compPData);
            const options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "registerNewAdmin",
                params: {
                    _company_name: compPData.company,
                    _new_user: compPData.sa,
                    _name: compPData.name,

                },
            }
            let dataPostNewAdmin = await Moralis.executeFunction(options)
                .then((res) => {
                    console.log(res);
                    res.wait(1);
                    viewAllAdmins();
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
                    _time: productInfoData.time,
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

    return (
        <>
            {
                account ?
                    <div className="p-2">
                        < h1 > Admin Dashboard</h1 >

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
                            <button onClick={postNewAdmin}>Register</button>
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
                            <input type="time" placeholder="time"
                                value={productInfoData.time}
                                onChange={(e) => {
                                    setProductInfoData({
                                        ...productInfoData,
                                        time: e.target.value
                                    })
                                }}
                            />
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

                        {admins.count && admins.data.length ?
                            <div className="mt-10">
                                <p>Admins</p>
                                <table className="table-auto border-collapse border-2 border-slate-800">
                                    <thead>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Admin Id</th>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Address</th>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Name</th>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Company Name</th>
                                    </thead>
                                    <tbody>
                                        {admins.count && admins.data.map((elAd, index) => {
                                            return (
                                                <tr>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.adminId.toString()}</td>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.adminAdd}</td>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.name}</td>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.company_name}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            : <></>}

                        {suppliers.count && suppliers.data.length ?
                            <div className="mt-10">
                                <p>suppliers</p>
                                <table className="table-auto border-collapse border-2 border-slate-800">
                                    <thead>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Supplier Id</th>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Address</th>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Name</th>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Admin Address</th>
                                    </thead>
                                    <tbody>
                                        {suppliers.count && suppliers.data.map((elAd, index) => {
                                            return (
                                                <tr>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.supplierId.toString()}</td>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.supplierDD}</td>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.name}</td>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.adminAdd}</td>
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
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Product Id</th>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Name</th>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Company</th>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Admin</th>
                                        <th className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">Supplier</th>
                                    </thead>
                                    <tbody>
                                        {products.count && products.data.map((elAd, index) => {
                                            return (
                                                <tr>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.productId.toString()}</td>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd.name}</td>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd?.populate?.populate?.company_name}</td>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd?.populate?.populate?.name}</td>
                                                    <td className="table-auto border-collapse border-2 border-slate-800 px-2 py-1">{elAd?.populate?.name}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            : <></>}


                    </div >
                    : <></>
            }
        </>
    )
}