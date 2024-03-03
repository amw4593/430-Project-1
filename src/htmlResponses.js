const fs = require('fs');

// References the client and css files
const index = fs.readFileSync(`${__dirname}/../client/client.html`);

// Tells the webpage how to use the files for the client
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

module.exports = {
  getIndex,
};
