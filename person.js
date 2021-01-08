class Person {
	constructor(dao) {
		this.dao = dao;
	}

	createTable() {
		const sql = `
    CREATE TABLE IF NOT EXISTS person (
      	ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	Anrede INTEGER NOT NULL,
	Vorname TEXT NOT NULL,
	Nachname TEXT NOT NULL,
	AdresseID INTEGER NOT NULL,
	Telefonnummer TEXT NOT NULL,
	Email TEXT NOT NULL,
    Schwertransport TEXT NOT NULL,
	CONSTRAINT fk_Person1 FOREIGN KEY (AdresseID) REFERENCES Adresse(ID))`;
		return this.dao.run(sql);
	}

	create(
		anrede,
		vorname,
		nachname,
		adresseid,
		telefonnummer,
		email,
		Schwertransport
	) {
		return this.dao.run(
			"INSERT INTO person (anrede, vorname, nachname, adresseid, telefonnummer, email ,Schwertransport) VALUES (?,?,?,?,?,?,?)",
			[
				anrede,
				vorname,
				nachname,
				adresseid,
				telefonnummer,
				email,
				Schwertransport,
			]
		);
	}

	update(person) {
		const {
			id,
			anrede,
			vorname,
			nachname,
			adresseid,
			telefonnummer,
			email,
			Schwertransport,
		} = person;
		return this.dao.run(
			`UPDATE person 
            SET anrede = ?,
            vorname = ?,
            nachname = ?,
            adresseid = ?,
            telefonnummer = ?,
            email = ?,
            Schwertransport = ?
            WHERE id = ?`,
			[
				anrede,
				vorname,
				nachname,
				adresseid,
				telefonnummer,
				email,
				Schwertransport,
				id,
			]
		);
	}

	delete(id) {
		return this.dao.run(`DELETE FROM person WHERE id = ?`, [id]);
	}

	getById(id) {
		return this.dao.get(`SELECT * FROM person WHERE id = ?`, [id]);
	}

	getAll() {
		return this.dao.all(`SELECT * FROM person`);
	}
}

module.exports = Person;
