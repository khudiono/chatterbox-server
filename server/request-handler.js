/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var messages = {
  results: []
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var objectIds = 1;
var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var statusCode = 200;
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'plain/text';

  request.url = request.url.slice(0,17);

  if (request.url !== '/classes/messages') {
    response.writeHead(404, headers);
    response.end();
  }

  if (request.method === 'GET' && request.url === '/classes/messages') {
    headers['Content-Type'] = 'application/json';
    response.writeHead(200, headers);
    response.end(JSON.stringify(messages));
  }

  if (request.method === 'POST' && request.url === '/classes/messages') {
    request.on('data', (message) => {
      var messagePosted = JSON.parse(message);
      var date = new Date().toISOString();
      messagePosted.objectId = objectIds.toString();
      messagePosted.createdAt = date;
      objectIds++;
      var reply = JSON.stringify(messagePosted);
      messages.results.push(messagePosted);
      headers['Content-Type'] = 'application/json';
      response.writeHead(201, headers);
      response.end(reply);
    });
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  }
};

//Exporting Request Handler
exports.requestHandler = requestHandler;

