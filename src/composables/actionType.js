export const types = [
    { name: 'Département', color: 'badge-primary', condition: 'dept_id' },
    { name: 'Accord', color: 'badge-neutral', condition: 'agree_id' },
    { name: 'Article', color: 'badge-accent', condition: 'art_id' },
    { name: 'Access', color: 'badge-info', condition: 'access' },
    { name: 'Evenement', color: 'badge-error', condition: 'evt_id' }
];

export function checkCondition(condition, act) {
    return act[condition] !== null && act[condition] !== undefined;
}