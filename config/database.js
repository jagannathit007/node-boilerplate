let mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
mongoose.connection
  .on("open", function () {
    console.log(`🍻 Cheers! Database connected.`);
  })
  .on("error", function (error) {
    console.log(`🚨 Connection Error: ${error}`);
  });
