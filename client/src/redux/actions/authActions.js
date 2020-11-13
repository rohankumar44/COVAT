import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types";

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

export const get_Errors = (errors) => {
    return {
        type: GET_ERRORS,
        payload: errors
    };
};

export const registerUser = (userData, history) => dispatch => {
    axios
        .post("/api/users/register", userData)
        .then(res => {
            if(userData.shopkeeper == "yes") {
                history.push({
                    pathname: '/userlocation',
                    search: '?user='+res.data._id,
                    state: { detail: res.data._id }
                });
            }else {
                history.push("/login")
            }
        }) 
        .catch(err =>
            dispatch(get_Errors(err.response.data))
        );
};

export const loginUser = userData => dispatch => {
    dispatch(setUserLoading());
    axios
        .post("/api/users/login", userData)
        .then(res => {
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch(get_Errors(err.response.data))
        );
};

export const logoutUser = () => dispatch => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
};