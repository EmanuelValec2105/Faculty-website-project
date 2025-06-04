const express = require('express');
const path = require('path');
const fs = require('fs');
const Modul = require('./js/server/modul');

const port = process.env.PORT || 4444;

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/css', express.static(path.join(__dirname, 'css')));
server.use('/jsk', express.static(path.join(__dirname, 'js')));
server.use('/slike', express.static(path.join(__dirname, 'resursi/slike')));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

server.get('/oau', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'oAutoru.html'));
});

server.get('/dok', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'dokumentacija.html'));
});

server.get('/eks', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'eksponati.html'));
});

server.get('/tab', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'tablica.html'));
});

server.get('/kon', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'kontakt.html'));
});

server.get('/izl', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'obrazacIzlozba.html'));
});

server.get('/vij', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'vijest.html'));
});

server.get('/audio', (req, res) => {
    res.sendFile(path.join(__dirname, 'resursi/audio.mp3'));
});

function setCookie(res, name, value, options = {}) {
    let cookie = `${name}=${value}`;
    if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
    res.setHeader('Set-Cookie', cookie);
}

function clearCookie(res, name) {
    res.setHeader('Set-Cookie', `${name}=; Max-Age=0`);
}

// Dinamička stranica popisa
server.get('/popis', (req, res) => {
    const csvFilePath = path.join(__dirname, 'resursi', 'izlozba.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const items = csvData.trim().split('\n').map(line => line.split('#'));

    let listItems = items.map(item => `
        <li>
            <a href="/brisi?id=${encodeURIComponent(item[1])}" class="delete-link">${item[1]}</a>
            - ID: ${item[0]}, Period: ${item[2]}, Kategorija: ${item[3]}, Porijeklo: ${item[4]}, Opis: ${item[5]}
        </li>`).join('');

    res.send(`
        <html>
            <body>
                <h1>Popis izložbenih primjeraka</h1>
                <form action="/popuni" method="post">
                    <button type="submit">Popuni</button>
                </form>
                <ul>${listItems}</ul>
                <script>
                    document.querySelectorAll('.delete-link').forEach(link => {
                        link.addEventListener('click', function(event) {
                            event.preventDefault();
                            if (confirm('Želite li obrisati ovaj element?')) {
                                window.location.href = this.href;
                            }
                        });
                    });
                </script>
            </body>
        </html>
    `);
});

server.post('/popuni', (req, res) => {
    const jsonFilePath = path.join(__dirname, 'resursi', 'izlozba.json');
    const csvFilePath = path.join(__dirname, 'resursi', 'izlozba.csv');
    Modul.kopirajJSONuCSV(jsonFilePath, csvFilePath);
    res.redirect('/popis');
});

server.get('/brisi', (req, res) => {
    const naziv = req.query.id;
    const csvFilePath = path.join(__dirname, 'resursi', 'izlozba.csv');
    let csvData = fs.readFileSync(csvFilePath, 'utf8');
    let items = csvData.trim().split('\n').map(line => line.split('#'));
    items = items.filter(item => item[1] !== naziv);

    csvData = items.map(item => item.join('#')).join('\n');
    fs.writeFileSync(csvFilePath, csvData);

    res.redirect('/popis');
});

server.get('/owt/izlozba', (req, res) => {
    const csvFilePath = path.join(__dirname, 'resursi', 'izlozba.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const items = csvData.trim().split('\n').map(line => Modul.prebaciCSVuJSON(line, 6));

    res.status(200).json(items);
});



server.post('/owt/izlozba', (req, res) => {
    const { id, naziv, period, kategorija, porijeklo, opis } = req.body;
    if (!id || !naziv || !period || !kategorija || !porijeklo || !opis) {
        return res.status(417).json({ greska: "nevaljani podaci" });
    }

    const newItem = { id, naziv, period, kategorija, porijeklo, opis };
    const csvLine = Modul.prebaciJSONuCSV(newItem, 6);
    const csvFilePath = path.join(__dirname, 'resursi', 'izlozba.csv');
    fs.appendFileSync(csvFilePath, `\n${csvLine}`);
    
    res.status(200).json({ message: "podaci dodani" });
});

server.put('/owt/izlozba', (req, res) => {
    res.status(501).json({ greska: "metoda nije implementirana" });
});

server.delete('/owt/izlozba', (req, res) => {
    res.status(501).json({ greska: "metoda nije implementirana" });
});

server.get('/owt/izlozba/:naziv', (req, res) => {
    const naziv = req.params.naziv;
    const csvFilePath = path.join(__dirname, 'resursi', 'izlozba.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const items = csvData.trim().split('\n').map(line => Modul.prebaciCSVuJSON(line, 6));

    const item = items.find(item => item.naziv === naziv);
    if (item) {
        res.status(200).json(item);
    } else {
        res.status(404).json({ greska: "nema resursa" });
    }
});

server.post('/owt/izlozba/:naziv', (req, res) => {
    res.status(405).json({ greska: "metoda nije dopuštena" });
});

server.put('/owt/izlozba/:naziv', (req, res) => {
    res.status(501).json({ greska: "metoda nije implementirana" });
});

server.delete('/owt/izlozba/:naziv', (req, res) => {
    const naziv = req.params.naziv;
    const csvFilePath = path.join(__dirname, 'resursi', 'izlozba.csv');
    let csvData = fs.readFileSync(csvFilePath, 'utf8');
    let items = csvData.trim().split('\n').map(line => Modul.prebaciCSVuJSON(line, 6));
    const initialLength = items.length;

    items = items.filter(item => item.naziv !== naziv);
    if (items.length === initialLength) {
        return res.status(417).json({ greska: "brisanje neuspješno provjerite naziv" });
    }

    csvData = items.map(item => Modul.prebaciJSONuCSV(item, 6)).join('\n');
    fs.writeFileSync(csvFilePath, csvData);

    res.status(200).json({ message: "podaci izbrisani" });
});

server.use((req, res) => {
    res.status(404).send('Stranica ne postoji! <a href="/">Povratak na početnu</a>');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server pokrenut na portu: ${port}`);
});
