const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const GoogleSpreadSheet = require("google-spreadsheet");
const { promisify } = require("util");

const credentials = require("./bugtracker.json");

const app = express();

// configurações
const docId = "1_mFsEKnWLSbb4FjNAbhtv8pFKc4J8vdkNPJXLs9JIZI";
const worksheetIndex = 0;

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/", async (req, res) => {
  try {
    const doc = new GoogleSpreadSheet(docId);
    await promisify(doc.useServiceAccountAuth)(credentials);
    const info = await promisify(doc.getInfo)();
    const worksheet = info.worksheets[worksheetIndex];
    await promisify(worksheet.addRow)({
      name: req.body.name,
      email: req.body.email,
      issueType: req.body.issueType,
      source: req.body.source || "direct",
      howToReproduce: req.body.howToReproduce,
      expectedOutput: req.body.expectedOutput,
      receivedOutput: req.body.receivedOutput,
      userAgent: req.body.userAgent,
      userDate: req.body.userDate
    });
    res.render("sucesso");
  } catch (err) {
    res.send("Erro ao enviar formulário");
    console.log(err);
  }
});

app.listen(3000, err => {
  if (err) {
    console.log("Erro: ", err);
  } else {
    console.log("Listening on port 3000");
  }
});
