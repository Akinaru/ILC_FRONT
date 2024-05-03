import { useAlertStore } from "../stores/alertStore";

export async function addAlert(error, message) {
        const alertStore = useAlertStore();
        const alertWithId = { response: message, id: Date.now(), iserror: error };
        alertStore.addAlert(alertWithId);
}



