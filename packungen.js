class Packungen {
	constructor(dao) {
		this.dao = dao;
	}

	createTable() {
		const sql = `
    CREATE TABLE IF NOT EXISTS packungen (
 	ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	Bezeichnung TEXT NOT NULL)`;
		return this.dao.run(sql);
	}

	create(bezeichnung) {
		return this.dao.run("INSERT INTO packungen (bezeichnung) VALUES (?)", [
			bezeichnung,
		]);
	}

	update(packungen) {
		const { id, bezeichnung } = packungen;
		return this.dao.run(
			`UPDATE packungen in 
	   SET bezeichnung = ?
	   WHERE id = ?`,
			[id, bezeichnung]
		);
	}

	delete(id) {
		return this.dao.run(`DELETE FROM packungen WHERE id = ?`, [id]);
	}

	getById(id) {
		return this.dao.get(`SELECT * FROM packungen WHERE id = ?`, [id]);
	}

	getAll() {
		return this.dao.all(`SELECT * FROM packungen`);
	}
}

module.exports = Packungen;
