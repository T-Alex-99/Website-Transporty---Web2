var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http");
var popup = require("alert");

// Importieren von externen Klassen
const AppDAO = require("./dao");
const AdminClass = require("./admin");
const PersonClass = require("./person");
const AdresseClass = require("./adresse");
const UmzugClass = require("./umzug");
const PackungenClass = require("./packungen");
const Umzug_PackungenClass = require("./umzug_packung");
const KontaktClass = require("./kontakt");

// Verbindung zu DB und APP DAO
const dao = new AppDAO("./database.db");
const admin = new AdminClass(dao);
const person = new PersonClass(dao);
const address = new AdresseClass(dao);
const umzug = new UmzugClass(dao);
const packungen = new PackungenClass(dao);
const umzug_packungen = new Umzug_PackungenClass(dao);
const kontakt = new KontaktClass(dao);

// Wenn Datenbank leer ist, erstelle neue
admin.createTable();
person.createTable();
address.createTable();
umzug.createTable();
packungen.createTable();
umzug_packungen.createTable();
kontakt.createTable();


// css bilder und andere Files zugänglich machen
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var server = http.createServer(app);
// ejs template setting
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/adminLogin", function (req, res) {
	res.sendFile(__dirname + "/" + "adminLogin.html");
});

// Erstellen von default Creds f�r Admin user falls keier vorhanden
app.post("/adminLogin", function (req, res) {
	var email = req.body.adminMail;
	var pass = req.body.adminPassword;
	admin
		.getByEmail(email)
		.then((admin) => {
			if (admin.Passwort == pass) {
				res.redirect("/backoffice");
			} else {
				res.sendFile(__dirname + "/" + "adminLogin.html");
			}
		})
		.catch((err) => {
			admin.create("admintest@test.de", "test123.");
			res.sendFile(__dirname + "/" + "adminLogin.html");
			console.log("Admin User erstellt " + "Adminusername: admintest@test.de | Passwort: test123.");
		});
});

// Testen der Email
function emailIsValid (email) {
	return /\S+@\S+\.\S+/.test(email)
	console.log("klappt");
  }

// Index Form erstell und und speicherung
app.post("/dataSubmit", function (req, res) {
	var data = req.body;

	//validieren der Daten bevor der �bergabe an die Form
		//Verhindert ein falsches Format der Email
		if (emailIsValid(data.email) == false){
			popup("Falsches Format für eine E-Mail");
			
			console.log("Falsche Email");
			res.sendFile(__dirname + "/" + "index.html");
		}

		//Verhindert ein Datum das weniger als 5 Tage in der Zukunft liegt
		if(Date.parse(data.date)-Date.parse(new Date())<5)
		{
		   	popup("Datum muss mindestens 4 Tage in der Zukunft liegen");
			console.log("Datum muss mindestens 4 Tage in der Zukunft liegen");
			res.sendFile(__dirname + "/" + "index.html");

		}

	address
		.create(data.address, data.plz, data.ort)
		.then((address) => {
			person
				.create(
					data.anrede,
					data.fName,
					data.lName,
					address.id,
					data.phone,
					data.email,
					data.heavyLoad
				)
				.then((person) => {
					umzug
						.create(data.date, data.distance)
						.then((um) => {
							packungen
								.create("S")
								.then((pack) => {
									umzug_packungen.create(um.id, pack.id, data.sPack, person.id);
								})
								.then(() => {
									packungen
										.create("M")
										.then((mpack) => {
											umzug_packungen.create(
												um.id,
												mpack.id,
												data.mPack,
												person.id
											);
										})
										.then(() => {
											packungen
												.create("L")
												.then((lpack) => {
													umzug_packungen.create(
														um.id,
														lpack.id,
														data.lPack,
														person.id
													);
												})
												.then(() => {
													res.sendFile(__dirname + "/" + "index.html");
												})
												.catch((err) => {
													console.log(err);
													res.sendFile(__dirname + "/" + "index.html");
												});
										})
										.catch((err) => {
											console.log(err);
											res.sendFile(__dirname + "/" + "index.html");
										});
								})
								.catch((err) => {
									console.log(err);
									res.sendFile(__dirname + "/" + "index.html");
								});
						})
						.catch((err) => {
							console.log(err);
							res.sendFile(__dirname + "/" + "index.html");
						});
				})
				.catch((err) => {
					console.log(err);
					res.sendFile(__dirname + "/" + "index.html");
				});
		})
		.catch((err) => {
			console.log(err);
			res.sendFile(__dirname + "/" + "index.html");
		});
});

// Verlinkungen 
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/" + "index.html");
});

app.get("/agb", function (req, res) {
	res.sendFile(__dirname + "/" + "agb.html");
});

app.get("/impressum", function (req, res) {
	res.sendFile(__dirname + "/" + "impressum.html");
});

// Admin backend Daten anzeigen
app.get("/backoffice", function (req, res) {
		umzug_packungen.getAll().then((rows) => {
			res.render("backoffice", { rows: rows });
		});
});

app.get("/dataSubmit", function (req, res) {
	umzug_packungen.getAll().then((rows) => {
		res.render("dataSubmit", { rows: rows });
	});
});

// Daten f�r update 
app.get("/bearbeiten/:id", function (req, res) {
	umzug_packungen.getById(req.params.id).then((rows) => {
		const row = {
			PersonId: rows[0].PersonId,
			ID: rows[0].ID,
			UmzugID: rows[0].UmzugID,
			AdressID: rows[0].AdresseID,
			Anrede: rows[0].Anrede,
			Vorname: rows[0].Vorname,
			Nachname: rows[0].Nachname,
			Telefonnummer: rows[0].Telefonnummer,
			Email: rows[0].Email,
			Umzugsdatum: rows[0].Umzugsdatum,
			Entfernung: rows[0].Entfernung,
			S: rows[0].Menge,
			SID: rows[0].ID,
			SPID: rows[0].PackungenID,
			M: rows[1].Menge,
			MID: rows[1].ID,
			MPID: rows[1].PackungenID,
			LPID: rows[2].PackungenID,
			LID: rows[2].ID,
			L: rows[2].Menge,
			Schwertransport: rows[0].Schwertransport,
		};
		res.render("bearbeiten", { row: row });
	});
});

// update action
app.post("/update", function (req, res) {
	var data = req.body;
	const updatePerson = {
		id: data.PersonID,
		anrede: data.Anrede,
		vorname: data.Vorname,
		nachname: data.Nachname,
		adresseid: data.AdressID,
		telefonnummer: data.Telefonnummer,
		email: data.Email,
		Schwertransport: data.Schwertransport,
	};
	const updateUmzug = {
		id: data.UmzugID,
		umzugsdatum: data.Umzugsdatum,
		entfernung: data.Entfernung,
	};
	const updateS = {
		id: data.SID,
		umzugid: data.UmzugID,
		packungid: data.SPID,
		menge: data.S,
		personId: data.PersonID,
	};
	const updateL = {
		id: data.LID,
		umzugid: data.UmzugID,
		packungid: data.LPID,
		menge: data.L,
		personId: data.PersonID,
	};
	const updateM = {
		id: data.MID,
		umzugid: data.UmzugID,
		packungid: data.MPID,
		menge: data.M,
		personId: data.PersonID,
	};
	person
		.update(updatePerson)
		.then(() => {
			umzug
				.update(updateUmzug)
				.then(() => {
					umzug_packungen.update(updateS).then(() => {
						umzug_packungen.update(updateM).then(() => {
							umzug_packungen.update(updateL).then(() => {
								res.redirect("/backoffice");
							});
						});
					});
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			console.log(err);
		});
});

// Daten f�r view page
app.get("/Kundenansicht/:id", function (req, res) {
	umzug_packungen.getById(req.params.id).then((rows) => {
		const row = {
			PersonId: rows[0].PersonId,
			Anrede: rows[0].Anrede,
			Vorname: rows[0].Vorname,
			Nachname: rows[0].Nachname,
			Telefonnummer: rows[0].Telefonnummer,
			Email: rows[0].Email,
			Umzugsdatum: rows[0].Umzugsdatum,
			Entfernung: rows[0].Entfernung,
			S: rows[0].Menge,
			M: rows[1].Menge,
			L: rows[2].Menge,
			Schwertransport: rows[0].Schwertransport,
		};
		res.render("Kundenansicht", { row: row });
	});
});

//delete action
app.get("/delete/:id", function (req, res) {
	umzug_packungen.getById(req.params.id).then((rows) => {
		umzug.delete(rows[0].UmzugID).then(() => {
			address.delete(rows[0].AdresseID).then(() => {
				rows.map((row) => {
					umzug_packungen.delete(row.ID);
					packungen.delete(row.PackungenID);
					person
						.delete(req.params.id)
						.then(() => {})
						.catch((err) => {
							console.log(err);
						});
				});
				res.redirect("/backoffice");
			});
		});
	});
});


// server run
var Server = server.listen(8081, function () {
	varhost = Server.address().address;
	var port = Server.address().port;
	console.log("server is running on port" + port);
});
