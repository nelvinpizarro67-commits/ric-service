const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("--- Inicializando y normalizando la Base de Datos ---");

  // Activar soporte de llaves foráneas
  db.run(`PRAGMA foreign_keys = ON;`);

  // Tablas principales con nombres de columnas limpios
  db.run(`CREATE TABLE IF NOT EXISTS cliente (
        id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
        Nombre TEXT NOT NULL,
        Paterno TEXT NOT NULL,
        Materno TEXT,
        Celular TEXT,
        Fecha TEXT,
        Correo TEXT
    );`);

  db.run(`CREATE TABLE IF NOT EXISTS vehiculo (
        id_vehiculo INTEGER PRIMARY KEY AUTOINCREMENT,
        Placa TEXT UNIQUE NOT NULL,
        Modelo TEXT,
        Fecha TEXT,
        Marca TEXT,
        Color TEXT,
        id_cliente INTEGER,
        FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
    );`);

  db.run(`CREATE TABLE IF NOT EXISTS ordent (
        id_ordent INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT,
        estado TEXT DEFAULT 'Pendiente',
        id_vehiculo INTEGER,
        FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo)
    );`);

  db.run(`CREATE TABLE IF NOT EXISTS diagnostico (
        id_diagnostico INTEGER PRIMARY KEY AUTOINCREMENT,
        causa_probable TEXT,
        id_ordent INTEGER,
        FOREIGN KEY (id_ordent) REFERENCES ordent(id_ordent)
    );`);

  db.run(`CREATE TABLE IF NOT EXISTS reparacion (
        id_reparacion INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_reparacion TEXT,
        Costo REAL,
        monto_contrato REAL,
        id_diagnostico INTEGER,
        FOREIGN KEY (id_diagnostico) REFERENCES diagnostico(id_diagnostico)
    );`);

  console.log("✅ Base de datos configurada correctamente.");
});

db.close();
