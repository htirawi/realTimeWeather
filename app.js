const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

//we have wired up the ExpressJS server to Socket.IO.
const io = socketIo(server);

const getApiAndEmit = async socket => {
	try {
		const res = await axios.get(
      // "https://api.darksky.net/forecast/YOUR_API_KEY/31.9454,35.9284"
      // "https://api.darksky.net/forecast/YOUR_API_KEY/31.9454,35.9284?units=si"
    ); // Getting the data from DarkSky
		socket.emit("FromAPI", res.data.currently.temperature);
	} catch (error) {
		console.error(`Error: ${error.code}`);
	}
};


io.on("connection",socket => {
	console.log("New Client Connected"),setInterval(
		() => getApiAndEmit(socket),10000
		);
	socket.on("Disconnect", () => console.log("Client Diconnected"));
});


server.listen(port, () => console.log(`Listening on port ${port}`));
