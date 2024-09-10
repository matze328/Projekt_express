const { Router } = require("express");
const { SongRouter } = require("./song");

const AppRouter = Router();


AppRouter.use("/song", SongRouter);

module.exports = { AppRouter };
