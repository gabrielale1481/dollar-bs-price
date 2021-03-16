const http = require("http");
const cron = require("node-cron");
const next = require("next").default;
const webSockets = require("socket.io");

const SERVER_PORT = process.env.PORT ?? 3000;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handler = app.getRequestHandler();

app.prepare().then(function(){

    const server = http.createServer(handler);
    const sockets = webSockets(server);

    cron.schedule("0 9,13 * * 1-5", require("./task")(sockets));

    server.listen(SERVER_PORT, function(err){

        if( err ) throw err;

        console.log("Server running on port", SERVER_PORT)

    })

}).catch(() => {

    console.log("Error getting up the server")
    process.exit(0);

})