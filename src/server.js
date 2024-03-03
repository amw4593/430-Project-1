// Const's to run the applicaiton correctlu

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// Port to run it
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// parseBody will tell the body of the HTML page what to do when it recieves data
const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.log(err);
    response.statusCode = 500;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyObj = querystring.parse(bodyString);
    handler(request, response, bodyObj);
  });
};

// onRequest is a function designed to create switch hcases for each of the URLs
// and what they are required to post
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true);

  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/getCars':
      if (request.method === 'GET') {
        jsonHandler.getCars(request, response, parsedUrl.query);
      } else if (request.method === 'HEAD') {
        jsonHandler.getCarsMeta(request, response);
      }
      break;
    case '/notReal':
      if (request.method === 'GET') {
        jsonHandler.notFound(request, response);
      } else if (request.method === 'HEAD') {
        jsonHandler.notFoundMeta(request, response);
      }
      break;
    case '/addCar':
      if (request.method === 'POST') {
        parseBody(request, response, jsonHandler.addCar);
      } else {
        jsonHandler.notFound(request, response);
      }
      break;
    case '/addRating':
      if (request.method === 'POST') {
        parseBody(request, response, jsonHandler.addRating);
      } else {
        jsonHandler.notFound(request, response);
      }
      break;
    default:
      jsonHandler.notFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
