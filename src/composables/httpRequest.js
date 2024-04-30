import axios from 'axios';
import { addAlert } from "./addAlert";

export async function request(method, object, url, data = null) {
    try {
        const axiosConfig = {
            method: method,
            url: url,
            headers: {
                "Content-Type": "application/json"
            },
            data: data ? data : null
        };

        const response = await axios(axiosConfig);
        const responseData = response.data;
        object.value = responseData;

        if (responseData.message || responseData.error) {
            addAlert(responseData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
