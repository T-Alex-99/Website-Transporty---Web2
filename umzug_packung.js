class Umzug_packung {
	constructor(dao) {
		this.dao = dao;
	}

	createTable() {
		const sql = `
    CREATE TABLE IF NOT EXISTS umzug_packung (
 	ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	UmzugID INTEGER NOT NULL,
	PackungenID INTEGER NOT NULL,
	Menge INTEGER NOT NULL,
    PersonID INTEGER NOT NULL,
	CONSTRAINT fk_UP1 FOREIGN KEY (UmzugID) REFERENCES Umzug(ID),
    CONSTRAINT fk_UP2 FOREIGN KEY (PackungenID) REFERENCES Packungen(ID),
    CONSTRAINT fk_UP3 FOREIGN KEY (PersonID) REFERENCES Person(ID))`;

		return this.dao.run(sql);
	}

	create(umzugid, packungid, menge, personId) {
		return this.dao.run(
			"INSERT INTO umzug_packung (umzugid, packungenid, menge, personid) VALUES (?,?,?,?)",
			[umzugid, packungid, menge, personId]
		);
	}

	update(umzug_packung) {
		const { id, umzugid, packungid, menge, personId } = umzug_packung;
		return this.dao.run(
			`UPDATE umzug_packung 
            SET umzugid = ?,
            packungenid = ?,
            menge = ?,
            personId = ?
            WHERE id = ?`,
			[umzugid, packungid, menge, personId, id]
		);
	}

	delete(id) {
		return this.dao.run(`DELETE FROM umzug_packung WHERE id = ?`, [id]);
	}

	getById(id) {
		return this.dao.all(
			`SELECT umzug_packung.* , person.*, adresse.*, umzug.*, packungen.*   FROM umzug_packung 
            JOIN umzug
            ON umzug.id = umzug_packung.umzugid
            JOIN packungen
            ON packungen.id = umzug_packung.packungenid
            JOIN person
            ON person.id = umzug_packung.personId
            JOIN adresse
            ON adresse.id = person.AdresseID WHERE person.id = ?`,
			[id]
		);
	}

	getAll() {
		return this.dao.all(`SELECT person.*, adresse.*,
            (SELECT b1.Menge FROM umzug_packung b1
                WHERE b1.personId = person.id 
                ORDER BY b1.packungenid LIMIT 0,1
            ) AS S,
            (SELECT b1.Menge FROM umzug_packung b1
                WHERE b1.personId = person.id 
                ORDER BY b1.packungenid LIMIT 1,1
            ) AS M,
            (SELECT b1.Menge FROM umzug_packung b1
                WHERE b1.personId = person.id 
                ORDER BY b1.packungenid LIMIT 2,1
            ) AS L,
            (SELECT umzug.Umzugsdatum FROM umzug_packung b1
                JOIN umzug
                ON umzug.id = b1.umzugid AND b1.personId = person.id
                ORDER BY b1.packungenid LIMIT 0,1
            ) AS Umzugsdatum,
            (SELECT umzug.Entfernung FROM umzug_packung b1
                JOIN umzug
                ON umzug.id = b1.umzugid AND b1.personId = person.id
                ORDER BY b1.packungenid LIMIT 0,1
            ) AS Entfernung
            
            FROM person
            JOIN adresse
            ON adresse.id = person.AdresseID
            ORDER BY person.id  
         `);
	}
}

module.exports = Umzug_packung;
