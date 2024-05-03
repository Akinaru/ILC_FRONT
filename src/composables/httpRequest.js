import axios from 'axios';
import { addAlert } from "./addAlert";

export async function request(method, sendAlert, object, url, data = null) {
    try {
        const axiosConfig = {
            method: method,
            url: url,
            data: data ? data : null
        };

        const response = await axios(axiosConfig);
        const responseData = response.data;
        object.value = responseData;

        if ((responseData.message || responseData.error) && sendAlert) {
            addAlert(false, responseData);
        }
    } catch (error) {
        console.error('Error:', error);
        object.value = error;
        if (sendAlert){
            addAlert(true, error);
        }
    }
}
