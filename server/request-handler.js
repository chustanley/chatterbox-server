/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
//Request is what the 'server' recieves
//response is what we should 'respond' with


var MessageData = require('./MessageData.js');
var message_id = 0;
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

var headers = defaultCorsHeaders;
headers['Content-Type'] = 'application/json';

var requestHandler = function(request, response) {
  // Request and Response come from node's http module. (which is the Basic-Server.js file)
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.


  console.log('Serving request type ' + request.method + ' for url ' + request.url); //assuming this is the incoming request

  var statusCode;

  if (request.url === '/classes/messages' && request.method === 'GET') { // IF CLIENT WANTS TO RECIEVE DATA
    statusCode = 200;

    response.writeHead(statusCode, headers); //send back the status code, send to client side, information needs to be right inorder for the data to get sent properly or if not / at all.

    response.end(JSON.stringify(MessageData.MessageData.data)); //last step we do - whatever we put into it is data that gets sent over to the user / client

  } else if (request.url === '/classes/messages' && request.method === 'POST') { // IF CLIENT WANTS TO ADD DATA
    statusCode = 201;
    // // See the note below about CORS headers.
    //var headers = defaultCorsHeaders;
    var data = '';

    request.on('data', (chunk) => {
      data += chunk; // this turns the 'encrypted chunk into a readible object that is now a string inside of data.

      data = JSON.parse(data);
      data.message_id = message_id++;
      data.createdAt = new Date();

      MessageData.MessageData.data.unshift(data);
      //maybe add data = ''
    });

    // .writeHead() writes to the request line and headers of the response,
    // which includes the status and all headers.
    response.writeHead(statusCode, headers); // assuming this is the outgoing response.

    // Make sure to always call response.end() - Node may not send
    // anything back to the client until you do. The string you pass to
    // response.end() will be the body of the response - i.e. what shows
    // up in the browser.
    //
    // Calling .end "flushes" the response's internal buffer, forcing
    // node to actually send all the data over to the client.


    //MAYBE ONLY SEND BACK DATA THAT ONE MESSAGE???
    response.end(JSON.stringify(MessageData.MessageData.data));
  } else if (request.url === '/classes/messages' && request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end();
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;