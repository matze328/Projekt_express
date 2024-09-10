const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { AppRouter } = require("./src/routes");



const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.json());

app.use(cors());


  
app.use("/v1", AppRouter);




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
