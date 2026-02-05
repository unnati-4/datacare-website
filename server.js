const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

const CSV_FILE = "queries.csv";

// Create CSV file with headers if not exists
if (!fs.existsSync(CSV_FILE)) {
  fs.writeFileSync(
    CSV_FILE,
    "Name,Email,Message,Date\n"
  );
}

app.post("/submit-query", (req, res) => {
  const { name, email, message } = req.body;
  const date = new Date().toLocaleString();

  const row = `"${name}","${email}","${message.replace(/"/g, '""')}","${date}"\n`;

  fs.appendFile(CSV_FILE, row, (err) => {
    if (err) {
      return res.status(500).send("Error saving data");
    }
    res.send("Query submitted successfully");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
