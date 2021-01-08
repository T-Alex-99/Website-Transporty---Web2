class Admin {
	constructor(dao) {
		this.dao = dao;
	}

	createTable() {
		const sql = `
    CREATE TABLE IF NOT EXISTS admin (
    ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	Benutzername TEXT NOT NULL,
	Passwort TEXT NOT NULL)`;
		return this.dao.run(sql);
	}

	create(benutzername, passwort) {
		return this.dao.run(
			"INSERT INTO admin (benutzername, passwort) VALUES (?,?)",
			[benutzername, passwort]
		);
	}

	update(admin) {
		const { id, benutzername, passwort } = admin;
		return this.dao.run(
			`UPDATE admin 
	   SET benutzername = ?,
	   passwort = ?
	   WHERE id = ?`,
			[id, benutzername, passwort]
		);
	}

	delete(id) {
		return this.dao.run(`DELETE FROM admin WHERE id = ?`, [id]);
	}

	getById(id) {
		return this.dao.get(`SELECT * FROM admin WHERE id = ?`, [id]);
	}

	getByEmail(email) {
		return this.dao.get(`SELECT * FROM admin WHERE Benutzername = ?`, [email]);
	}

	getAll() {
		return this.dao.all(`SELECT * FROM admin`);
	}
}

module.exports = Admin;
