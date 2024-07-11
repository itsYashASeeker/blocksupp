import { faArrowCircleLeft, faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import abi from "../../constants/abi.json";
import contractAddress from "../../constants/address.json";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export default function ApplyAdmin() {

    var supplyContractAddress;
    const router = useRouter();
    const [regState, setRegState] = useState({ name: '', company_name: '', loading: false, status: '' });
    // const [isAdmin, setIsAdmin] = useState(false);

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
            functionName: "adminExists",
            params: { _senderAddress: account },
        }
        try {
            let fetchIfAdmin = await Moralis.executeFunction(options);
            if (fetchIfAdmin == true || fetchIfAdmin == "true") {
                router.push('/')
            }
        }
        catch (error) {
            // pass
        }
        try {
            options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "checkIfCompAdmin",
                params: { senderAddress: account },
            }

            let fetchIfAdmin = await Moralis.executeFunction(options);
            // window.alert(fetchIfAdmin)
            if (fetchIfAdmin && (fetchIfAdmin == true || fetchIfAdmin == "true")) {
                setRegState({ ...regState, status: 'success' });
            }
        } catch (error) {
            // pass
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            checkIfAdmin();
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

    async function postNewAdmin() {
        if (!account || !regState.name || !regState.company_name) {
            window.alert("Please fill in all fields");
            return;
        }
        setRegState({ ...regState, loading: true });
        try {
            // console.log(compPData);
            const options = {
                abi: abi,
                contractAddress: supplyContractAddress,
                functionName: "registerTempNewAdmin",
                params: {
                    _company_name: regState.company_name,
                    _new_user: account,
                    _name: regState.name
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

    return (
        <>

            <button className="absolute rounded-full top-4 left-4 text-lg bg-slate-300 text-black px-2 "
                onClick={() => { router.push('/') }}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            {/* {account */}
            {account ?
                < div className="text-white w-screen h-screen">

                    <div className="flex justify-center items-center h-full"

                    >
                        <div className="rounded-md border-2 border-dashed border-slate-400 p-2 text-center"
                            style={{ width: "clamp(20rem,60vw,40rem)" }}
                        >
                            {regState.status == "success" ?
                                <>
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-7xl my-6" />
                                    <p className="mb-6">Your request has been succesfully submitted! Once approved by the Super Admin, your account will be updated to the role of Admin!</p>

                                </>
                                :
                                <>
                                    <p className="mt-4 mb-12 text-2xl">Apply to be an Admin</p>
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
                                            <p>Company name</p>
                                            <input
                                                disabled={regState.loading ? true : false}
                                                placeholder="company name" className="bg-slate-600 text-white rounded w-full px-2 py-1" value={regState.company_name} onChange={(e) => { setRegState({ ...regState, company_name: e.target.value }) }} />
                                        </div>
                                        <button className={`bg-slate-800 text-white px-4 py-2 rounded hover:enabled:bg-slate-700 mb-6 w-full`}
                                            disabled={regState.loading || (!account || !regState.name || !regState.company_name) ? true : false}
                                            onClick={postNewAdmin}
                                        >{regState.loading ? "Loading..." : "Submit"}</button>
                                    </div>
                                </>

                            }
                        </div>

                    </div>

                </div >

                :
                <p>Loading...</p>
            }
            {/* : <></>} */}

        </>
    )
}