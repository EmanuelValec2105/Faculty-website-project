const fs = require('fs');

class Modul {
    static kopirajJSONuCSV(jsonFilePath, csvFilePath) {
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        const csvData = jsonData.map(item => {
            return `${item.id}#${item.naziv}#${item.period}#${item.kategorija}#${item.porijeklo}#${item.opis}`;
        }).join('\n');
        fs.writeFileSync(csvFilePath, csvData);
    }

    static prebaciCSVuJSON(csvLine) {
        const [id, naziv, period, kategorija, porijeklo, opis] = csvLine.split('#');
        return { id, naziv, period, kategorija, porijeklo, opis };
    }

    static prebaciJSONuCSV(item) {
        return `${item.id}#${item.naziv}#${item.period}#${item.kategorija}#${item.porijeklo}#${item.opis}`;
    }
}

module.exports = Modul;
