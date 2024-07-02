import { useAlertStore } from "../stores/alertStore";

export async function addAlert(status, message) {
        const alertStore = useAlertStore();
        const alertWithId = { response: message, id: Date.now(), status: status };
        alertStore.addAlert(alertWithId);
}



