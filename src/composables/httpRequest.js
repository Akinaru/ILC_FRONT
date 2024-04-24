import { addAlert } from "./addAlert";

export async function request(method, object, url, data = null) {
    const requestOptions = {
        method: method,
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: data ? JSON.stringify(data) : null
    };

    try {
        const response = await fetch(url, requestOptions);
        const responseData = await response.json();
        object.value = responseData;
        if (responseData.message || responseData.error) {
            addAlert(responseData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



