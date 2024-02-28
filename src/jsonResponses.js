const cars = {};
const ratings = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);

  if (status !== 204) {
    response.write(JSON.stringify(object));
  }

  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

const getCars = (request, response, queryParams) => {
  const responseJSON = {
    cars,
    ratings,
    queryParams,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getCarsMeta = (request, response) => respondJSONMeta(request, response, 200);

const addCar = (request, response, body) => {
  const responseJSON = {
    message: 'Make and model are both required.',
  };

  if (!body.make || !body.model) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  cars[body.make] = cars[body.make] || {};
  cars[body.make][body.model] = {};

  responseJSON.message = 'Car added successfully';
  return respondJSON(request, response, 201, responseJSON);
};

const addRating = (request, response, body) => {
  const responseJSON = {
    message: 'Make, model, rating, and description are all required.',
  };

  if (!body.make || !body.model || !body.rating || !body.description) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  ratings[body.make] = ratings[body.make] || {};
  ratings[body.make][body.model] = ratings[body.make][body.model] || [];

  ratings[body.make][body.model].push({
    rating: body.rating,
    description: body.description,
  });

  responseJSON.message = 'Rating added successfully';
  return respondJSON(request, response, 201, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  getCars,
  getCarsMeta,
  addCar,
  addRating,
  notFound,
  notFoundMeta,
};
