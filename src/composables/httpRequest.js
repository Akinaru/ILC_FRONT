import AlertComp from '../components/AlertComp.vue';
import { createApp, h } from 'vue';

const alerts = [];

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
            alerts.push(responseData);
            console.log(alerts)
            renderAlerts();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderAlerts() {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        // Efface le contenu précédent du conteneur
        alertContainer.innerHTML = '';
        // Crée une instance d'application Vue pour les alertes
        const alertApp = createApp({
            render() {
                // Utilise un fragment pour éviter d'ajouter une div supplémentaire
                return h('div', {}, alerts.map(responseData => {
                    return h(AlertComp, { response: responseData });
                }));
            }
        });
        // Monte les alertes directement dans le conteneur cible
        alertApp.mount(alertContainer);
    } else {
        console.error("Alert container not found!");
    }
}

