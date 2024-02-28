const http = require('http');
const url = require('url');
const querystring = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

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

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true);

  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
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
