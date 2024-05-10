import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import abi from "../../../constants/abi.json";
import contractAddress from "../../../constants/address.json";
import { useWeb3Contract } from 'react-moralis';
import { FETCH_F_FAILED, FETCH_F_STARTED, FETCH_F_SUCCEEDED } from "../../constants/states";


const initialState = {
    user: [],
    status: 'idle',
    error: null
}

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_F_STARTED: {
            return {
                ...state,
                status: 'loading'
            }
        }
        case FETCH_F_SUCCEEDED: {
            return {
                ...state,
                status: 'succeeded',
                data: action.data
            }
        }
        case FETCH_F_FAILED: {
            return {
                ...state,
                status: 'failed',
                data: [],
                error: action.error
            }
        }
        default:
            return state
    }
}

// const blockSlice = createSlice({
//     name: "blocksupp",
//     initialState,

// })

