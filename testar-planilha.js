const GoogleSpreadSheet = require("google-spreadsheet");
const credentials = require("./bugtracker.json");
const { promisify } = require("util");

const addRowToSheet = async () => {
  const doc = new GoogleSpreadSheet(
    "1_mFsEKnWLSbb4FjNAbhtv8pFKc4J8vdkNPJXLs9JIZI"
  );
  await promisify(doc.useServiceAccountAuth)(credentials);
  console.log("Planilha aberta");
  const info = await promisify(doc.getInfo)();
  const worksheet = info.worksheets[0];
  await promisify(worksheet.addRow)({ name: "Tulio", email: "test" });
};

addRowToSheet();

/*
const doc = new GoogleSpreadSheet(
  "1_mFsEKnWLSbb4FjNAbhtv8pFKc4J8vdkNPJXLs9JIZI"
);
doc.useServiceAccountAuth(credentials, err => {
  if (err) {
    console.log("Não foi possível abrir a planilha");
  } else {
    console.log("Planilha aberta");
    doc.getInfo((err, info) => {
      const worksheet = info.worksheets[0];
      worksheet.addRow({ name: "Tulio", email: "test" });
    });
  }
});
*/
