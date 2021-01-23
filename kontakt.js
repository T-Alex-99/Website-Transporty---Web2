class Kontakt {
	constructor(dao) {
		this.dao = dao;
	}

	createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS kontakt(
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        Vorname TEXT NOT NULL,
        Nachname TEXT NOT NULL,
        Email TEXT NOT NULL,
        Betreff TEXT NOT NULL,
        Nachricht TEXT NOT NULL)`;
            return this.dao.run(sql);
    }

	create(
		vorname,
		nachname,
		email,
        betreff,
		nachricht
	) {
		return this.dao.run(
			"INSERT INTO kontakt (vorname, nachname, email, betreff ,nachricht) VALUES (?,?,?,?,?)",
			[
				vorname,
				nachname,
				email,
                betreff,
				nachricht,
			]
		);
	}


	delete(id) {
		return this.dao.run(`DELETE FROM kontakt WHERE id = ?`, [id]);
	}

	getById(id) {
		return this.dao.get(`SELECT * FROM kontakt WHERE id = ?`, [id]);
	}

	getAll() {
		return this.dao.all(`SELECT * FROM kontakt`);
	}
}

module.exports = Kontakt;
