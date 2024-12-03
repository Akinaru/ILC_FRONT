import axios from 'axios';
import { addAlert } from "./addAlert";

export async function request(method, sendAlert, object, url, data = null) {
    try {
        const token = localStorage.getItem('token');
        const axiosConfig = {
            method: method,
            url: url,
            data: data ? data : null,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
 
        const response = await axios(axiosConfig);
        const responseData = response.data;
        object.value = responseData;
        if(responseData.save && sendAlert){
            addAlert('save', responseData)
        }
        else if ((responseData.message || responseData.error) && sendAlert) {
            addAlert('message', responseData);
        }
 
    } catch (error) {
        object.value = error;
        if (sendAlert){
            addAlert('error', error.response);
        }
    }
 }