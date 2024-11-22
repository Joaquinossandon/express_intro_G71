const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");

// cors permite que el servidor reciba peticiones de cualquier origen
app.use(cors());

// se indica que se va a recibir información en formato JSON
app.use(express.json());

// express.static permite que se puedan servir archivos estáticos
app.use("/public", express.static(path.join(__dirname, "./public")));

// crea ruta get para obtener todas las tareas en el archivo tasks.json
app.get("/tareas", (req, res) => {
    const filePlainText = fs.readFileSync("./resources/tasks.json", "utf-8");
    const fileJson = JSON.parse(filePlainText);

    res.json(fileJson);
});

// crea ruta post para agregar una tarea al archivo tasks.json
app.post("/tareas", (req, res) => {
    // se obtiene la tarea enviada en el cuerpo de la petición
    const tarea = req.body;

    // si no se envían los campos name y description, se envía un mensaje de error con el código 400
    if (!tarea.name || !tarea.description)
        return res.status(400).json({ msg: "Se necesitan todos los campos" });

    // se lee el archivo tasks.json
    const filePlainText = fs.readFileSync("./resources/tasks.json", "utf-8");
    // se convierte el archivo a un objeto JSON
    const listaTareas = JSON.parse(filePlainText); // es un arreglo

    // se agrega la tarea al arreglo de tareas
    listaTareas.push({
        id: listaTareas.length + 1,
        ...tarea,
        status: "pending",
    });

    // se convierte el arreglo de tareas a texto
    const listaTareasText = JSON.stringify(listaTareas, null, 2);
    // se escribe el texto en el archivo tasks.json
    fs.writeFileSync("./resources/tasks.json", listaTareasText, "utf-8");

    // se envía un mensaje de éxito con el código 201
    return res.status(201).json({
        msg: "Se agregó la tarea",
    });
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
