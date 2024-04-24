import { useAlertStore } from "../stores/alertStore";

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
        const alertStore = useAlertStore();
        if (responseData.message || responseData.error) {
            const alertWithId = { response: responseData, id: Date.now() };
            alertStore.addAlert(alertWithId);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



