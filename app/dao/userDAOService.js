const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "username", // update me
      password: "password" // update me
    },
    type: "default"
  },
  server: "your_server.database.windows.net", // update me
  options: {
    database: "your_database", //update me
    encrypt: true
  }
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    queryDatabase();
  }
});

