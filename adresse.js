class Adresse {
	constructor(dao) {
		this.dao = dao;
	}

	createTable() {
		const sql = `
    CREATE TABLE IF NOT EXISTS adresse (
	ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	Strasse TEXT NOT NULL,
	PLZ TEXT NOT NULL,
	Ort TEXT NOT NULL)`;
		return this.dao.run(sql);
	}

	create(strasse, plz, ort) {
		return this.dao.run(
			"INSERT INTO adresse (strasse, plz, ort) VALUES (?,?,?)",
			[strasse, plz, ort]
		);
	}

	update(adresse) {
		const { id, strasse, plz, ort } = adresse;
		return this.dao.run(
			`UPDATE adresse in 
	   SET strasse = ?,
	   plz = ?,
	   ort = ?
	   WHERE id = ?`,
			[id, strasse, plz, ort]
		);
	}

	delete(id) {
		return this.dao.run(`DELETE FROM adresse WHERE id = ?`, [id]);
	}

	getById(id) {
		return this.dao.get(`SELECT * FROM adresse WHERE id = ?`, [id]);
	}

	getAll() {
		return this.dao.all(`SELECT * FROM adresse`);
	}
}

module.exports = Adresse;
