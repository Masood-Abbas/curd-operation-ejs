const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const uuid = require("uuid");
const port = 4000;
const app = express();

let data = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submitform", (req, res) => {
  const { email, password } = req.body;
  const formData = {
    id: uuid.v4(),
    email: email,
    password: password,
  };
  data.push(formData);
  res.redirect("/");
});

app.get("/show", (req, res) => {
  res.render("show", { data: data });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const item = data.find((curElem) => curElem.id == id);
  if (item) {
    res.render("edit", { item: item });
  } else {
    res.send("Item not found");
  }
});

app.post("/update/:id", (req, res) => {
  const id = req.params.id;
  const { email, password } = req.body;
  const index = data.findIndex((entry) => entry.id == id);
  if (index !== -1) {
    data[index] = { id: id, email: email, password: password };
    res.redirect("/show");
  } else {
    res.send("Item not found");
  }
});
// delete
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const index = data.findIndex((entry) => entry.id == id);
  if (index !== -1) {
    data.splice(index, 1);
    res.redirect("/show");
  } else {
    res.send("Item not found");
  }
});

app.listen(port, () => {
  console.log(`server is running at this port ${port}`);
});
