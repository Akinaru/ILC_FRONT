export const types = [
    { name: 'Département', color: 'badge-primary', condition: 'department' },
    { name: 'Accord', color: 'badge-neutral', condition: 'agreement' },
    { name: 'Article', color: 'badge-accent', condition: 'article' },
    { name: 'Access', color: 'badge-info', condition: 'access' },
    { name: 'Evenement', color: 'badge-error', condition: 'event' },
    { name: 'Admin', color: 'badge-secondary', condition: 'admin' },
    { name: 'Autre', color: 'badge-warning', condition: 'other' },
];

export function getType(act_type) {
    return types.find(type => type.condition === act_type);
}
