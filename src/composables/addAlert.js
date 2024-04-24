import { useAlertStore } from "../stores/alertStore";

export async function addAlert(message) {
        const alertStore = useAlertStore();
        const alertWithId = { response: message, id: Date.now() };
        alertStore.addAlert(alertWithId);
}



