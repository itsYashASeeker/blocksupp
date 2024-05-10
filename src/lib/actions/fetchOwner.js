import { useWeb3Contract } from "react-moralis";
import { FETCH_F_FAILED, FETCH_F_STARTED, FETCH_F_SUCCEEDED } from "../constants/states";



export const fetchF1Started = () => ({
    type: FETCH_F_STARTED
})

export const fetchF1Succeeded = (data) => ({
    type: FETCH_F_SUCCEEDED,
    data: data
})

export const fetchF1Failed = (error) => ({
    type: FETCH_F_FAILED,
    error
})

export const fetchF1 = () => {
    return async dispatch => {
        dispatch(fetchF1Started());
        var supplyContractAddress;
        var { runContractFunction: runContractFF } = useWeb3Contract();
        if (chainIdInt in contractAddress) {
            supplyContractAddress = contractAddress[chainIdInt][0];
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
            // console.log(resultData);
            // return resultData;
            dispatch(fetchF1Succeeded(resultData));
        }
        else {
            supplyContractAddress = null;
            // return "fail"
            dispatch(fetchF1Failed("fail"));
        }
    }
}