import { request } from '../composables/httpRequest.js'
import config from '../config'

export const types = [
    { name: 'Département', color: 'badge-primary', condition: 'department' },
    { name: 'Accord', color: 'badge-neutral', condition: 'agreement' },
    { name: 'Article', color: 'badge-accent', condition: 'article' },
    { name: 'Access', color: 'badge-info', condition: 'access' },
    { name: 'Evenement', color: 'badge-error', condition: 'event' },
    { name: 'Admin', color: 'badge-secondary', condition: 'admin' },
    { name: 'Université', color: 'badge-success', condition: 'university' },
    { name: 'Isced', color: 'badge-link', condition: 'isced' },
    { name: 'Autre', color: 'badge-warning', condition: 'other' },
];

export function getType(act_type) {
    return types.find(type => type.condition === act_type);
}


export async function addAction(login, type, responseObj, description, ){
    const requestDataAction = {
        act_description: description,
        acc_id: login,
        act_type: type
    }
    await request('POST', false, responseObj, config.apiUrl+'api/action', requestDataAction);
}