class Umzug {
	constructor(dao) {
		this.dao = dao;
	}

	createTable() {
		const sql = `
    CREATE TABLE IF NOT EXISTS umzug (
	ID Integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	Umzugsdatum TEXT NOT NULL,
	Entfernung NUMERIC NOT NULL)`;
		return this.dao.run(sql);
	}

	create(umzugsdatum, entfernung) {
		return this.dao.run(
			"INSERT INTO umzug (umzugsdatum, entfernung) VALUES (?,?)",
			[umzugsdatum, entfernung]
		);
	}

	update(umzug) {
		const { id, umzugsdatum, entfernung } = umzug;
		return this.dao.run(
			`UPDATE umzug 
            SET umzugsdatum = ?,
            entfernung = ?
            WHERE id = ?`,
			[umzugsdatum, entfernung, id]
		);
	}

	delete(id) {
		return this.dao.run(`DELETE FROM umzug WHERE id = ?`, [id]);
	}

	getById(id) {
		return this.dao.get(`SELECT * FROM umzug WHERE id = ?`, [id]);
	}

	getAll() {
		return this.dao.all(`SELECT * FROM umzug`);
	}
}

module.exports = Umzug;
