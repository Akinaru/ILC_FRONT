import Papa from 'papaparse';

export function convertCSVToJson(result, csvFile){
    Papa.parse(csvFile, {
        header: true,
        complete: (results) => {
          result.value = results.data;
        },
        error: (error) => {
          console.error('Erreur lors de la conversion de CSV en JSON :', error);
        }
    });
}

export function checkCSVFile(file){
    if (file && file.type === 'text/csv') {
        return true;
    }
    else{
        return false;
    }

}