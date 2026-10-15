const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos del frontend
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------
// OBTENER REGISTROS DE UNA TABLA (GET)
// ------------------------------------------
app.get("/api/:tabla", (req, res) => {
  const tabla = req.params.tabla;
  const tablasPermitidas = [
    "cliente",
    "vehiculo",
    "diagnostico",
    "reparacion",
    "ordent",
    "mecanico",
    "templeado",
    "historial",
  ];

  if (!tablasPermitidas.includes(tabla)) {
    return res.status(400).json({ error: "Tabla no válida" });
  }

  db.all(`SELECT * FROM ${tabla}`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ------------------------------------------
// GUARDAR REGISTROS (POST)
// ------------------------------------------

// Guardar Cliente
app.post("/api/cliente", (req, res) => {
  const { nombre, paterno, materno, celular, fecha, correo } = req.body;
  const sql = `INSERT INTO cliente (Nombre, Paterno, Materno, Celular, Fecha, Correo) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(
    sql,
    [nombre, paterno, materno, celular, fecha, correo],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: "Cliente guardado correctamente" });
    },
  );
});

// Guardar Vehículo
app.post("/api/vehiculo", (req, res) => {
  const { placa, modelo, fecha, marca, color, id_cliente } = req.body;
  const sql = `INSERT INTO vehiculo (Placa, Modelo, Fecha, Marca, Color, id_cliente) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [placa, modelo, fecha, marca, color, id_cliente], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: "Vehículo guardado correctamente" });
  });
});

// Guardar Orden de Trabajo
app.post("/api/ordent", (req, res) => {
  const { fecha, estado, id_vehiculo } = req.body;
  const sql = `INSERT INTO ordent (fecha, estado, id_vehiculo) VALUES (?, ?, ?)`;
  db.run(sql, [fecha, estado || "Recibido", id_vehiculo], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: "Orden registrada correctamente" });
  });
});

// ------------------------------------------
// ELIMINAR REGISTROS (DELETE)
// ------------------------------------------
app.delete("/api/:tabla/:columnaId/:id", (req, res) => {
  const { tabla, columnaId, id } = req.params;
  const tablasPermitidas = [
    "cliente",
    "vehiculo",
    "diagnostico",
    "reparacion",
    "ordent",
    "mecanico",
  ];

  if (!tablasPermitidas.includes(tabla)) {
    return res.status(400).json({ error: "Tabla no permitida" });
  }

  const sql = `DELETE FROM ${tabla} WHERE ${columnaId} = ?`;
  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Registro eliminado", borrados: this.changes });
  });
});

// Iniciar Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
