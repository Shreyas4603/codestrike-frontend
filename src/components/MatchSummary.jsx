import React, { useEffect } from "react";
import { getData } from "./utils/fetch-api-data";
import { useParams } from "react-router-dom";
import axios from "axios";

const MatchSummary = () => {
    const {matchID} = useParams()
    useEffect(()=>{
        const endpoint = `api/end/${matchID}`
        const response = axios.get(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`);
        console.log(response)
    },[])
  return (
    <>

    </>
  );
};

export default MatchSummary;
