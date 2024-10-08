export function decomposeDN(login, dn) {
    const info = {};
    const parts = dn.split(',');

    try {
        // Vérification si le DN a des parties valides
        if (parts.length === 0) {
            throw new Error('No parts found in the DN.');
        }

        info.login = login;

        // Extracting full name from the first CN
        const cn = parts[0].split('=')[1];
        info.fullname = cn ? cn : 'Unknown Full Name'; // Handle undefined CN

        // Extracting the status (Etudiants or Personnels) from the OU
        const ou = parts[2]?.split('=')[1];
        if (!ou) {
            throw new Error('Status not found in the DN.');
        }
        info.status = ou;

        // Extracting the first OU
        const fonctionOU = parts[1]?.split('=')[1];
        if (!fonctionOU) {
            throw new Error('Function OU not found in the DN.');
        }

        // Depending on the status, decompose the fonction differently
        if (info.status === 'Etudiants') {
            const [formation, filiaire, specification] = fonctionOU.split('-');
            info.fonction = { formation: formation, filiaire: filiaire, specification: specification };
        } else if (info.status === 'Personnels') {
            const [type, specification, specification2] = fonctionOU.split('-');
            info.fonction = { type: type, specification: specification + '-' + specification2 };
        } else {
            // Default case, just store the OU value
            info.fonction = fonctionOU;
        }
    } catch (error) {
        console.error('Error during DN decomposition:', error);
        throw error; // Rethrow the error for further handling if needed
    }

    return info;
}
