// Constants
const cars = {};
const ratings = {};

// respondJSON writes all data added
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);

  try {
    if (status !== 204) {
      response.write(JSON.stringify(object));
    }
  } catch (err) {
    console.error('Error stringifying JSON:', err);
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

// getCars function will take data from ratings cars, and queryParams. Its the storage for all data
const getCars = (request, response, queryParams) => {
  const responseJSON = {
    cars,
    ratings,
    queryParams,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getCarsMeta = (request, response) => respondJSONMeta(request, response, 200);
// addCar is what wiull add a car to the storage
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

// addRating does the same as getCars, but requires all data parameters to be added
const addRating = (request, response, body) => {
  const responseJSON = {
    message: 'Make, model, rating, and description are all required.',
  };

  if (!body.rating || !body.description) {
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
// Function made for when a link is not found
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
