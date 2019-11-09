const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const GoogleSpreadSheet = require("google-spreadsheet");
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

app.post("/", (req, res) => {
  const doc = new GoogleSpreadSheet(docId);
  doc.useServiceAccountAuth(credentials, err => {
    if (err) {
      console.log("Não foi possível abrir a planilha");
    } else {
      console.log("Planilha aberta");
      doc.getInfo((err, info) => {
        const worksheet = info.worksheets[worksheetIndex];
        worksheet.addRow(
          {
            name: req.body.name,
            email: req.body.email,
            issueType: req.body.issueType,
            howToReproduce: req.body.howToReproduce,
            expectedOutput: req.body.expectedOutput,
            receivedOutput: req.body.receivedOutput
          },
          err => {
            res.send("Bug reportado com sucesso!");
          }
        );
      });
    }
  });
});

app.listen(3000, err => {
  if (err) {
    console.log("Erro: ", err);
  } else {
    console.log("Listening on port 3000");
  }
});
