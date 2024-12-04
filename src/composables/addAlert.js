import { useAlertStore } from "../stores/alertStore";
import config from '../config';

export async function addAlert(status, message, time = undefined) {
    const alertStore = useAlertStore();
    const alertWithId = { 
        response: message, 
        id: Date.now(), 
        status: status,
        // Si time est undefined (pas spécifié), on utilise la valeur du config
        // Si time est null, c'est infini
        // Sinon on utilise la valeur spécifiée
        duration: time === undefined ? config.alertTimeBeforeRemove : time
    };
    alertStore.addAlert(alertWithId);
}
