const express = require("express");
const router = new express.Router();

router.get("/", async function (req, res, next) {
  try {
    const data = {
      message: "Hello from the backend server",
    };
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
