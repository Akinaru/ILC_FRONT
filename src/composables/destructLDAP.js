export function decomposeDN(dn) {
    const info = {};
    const parts = dn.split(',');

    // Extracting full name from the first CN
    const cn = parts[0].split('=')[1];
    info.full_name = cn;

    // Extracting the status (Etudiants or Personnels) from the OU
    const ou = parts[2].split('=')[1];
    info.status = ou;

    // Extracting the first OU
    const fonctionOU = parts[1].split('=')[1];

    // Depending on the status, decompose the fonction differently
    if (info.status === 'Etudiants') {
        const [formation, filiaire, specification] = fonctionOU.split('-');
        info.fonction = { formation: formation, filiaire: filiaire, specification: specification };
    } else if (info.status === 'Personnels') {
        const [type, specification, specification2] = fonctionOU.split('-');
        info.fonction = { type: type, specification: specification+'-'+specification2 };
    } else {
        // Default case, just store the OU value
        info.fonction = fonctionOU;
    }

    return info;
}