const users = {};

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

const getCars = (request, response) => {
  const responseJSON = {
    cars,
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

  let responseCode = 204;

  if (!cars[body.make]) {
    responseCode = 201;
    cars[body.make] = {};
  }

  cars[body.make][body.model] = {
    make: body.make,
    model: body.model,
    ratings: [],
  };

  if (responseCode === 201) {
    responseJSON.message = 'Car Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const addRating = (request, response, body) => {
  const responseJSON = {
    message: 'Make, model, rating, and description are all required.',
  };

  if (!body.make || !body.model || !body.rating || !body.description) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!cars[body.make]) {
    responseCode = 404;
    responseJSON.message = 'Car not found';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  if (!cars[body.make][body.model]) {
    responseCode = 404;
    responseJSON.message = 'Car not found';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  if (!cars[body.make][body.model].ratings) {
    cars[body.make][body.model].ratings = [];
  }

  cars[body.make][body.model].ratings.push({
    rating: body.rating,
    description: body.description,
  });

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
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
