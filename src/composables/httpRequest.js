import AlertComp from '../components/AlertComp.vue';
import { createApp, h } from 'vue';

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
            const app = createApp({
                render() {
                    return h(AlertComp, { response: responseData });
                }
            });

            const tempDiv = document.createElement('div');
            document.body.appendChild(tempDiv);
            app.mount(tempDiv);

            const alertHtml = tempDiv.innerHTML;
            document.body.removeChild(tempDiv);
            document.getElementById('alert-container').innerHTML += alertHtml;

        }
    } catch (error) {
        console.error('Error:', error);
    }
}
