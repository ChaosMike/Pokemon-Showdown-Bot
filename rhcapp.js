// Setup module, for running in RedHatCloud.

/* Start a http server */
var cloudenv = require('cloud-env');
var bindaddress = cloudenv.get('IP', '127.0.0.1');
var port = cloudenv.get('PORT', 8000);

function getUptimeString() {
	time = process.uptime();

	var seconds = ~~(time % 60);
	var times = [];
	if (seconds) times.push(seconds + (seconds === 1 ? ' second': ' seconds'));
	if (time >= 60) {
		time = ~~((time - seconds) / 60);
		var minutes = time % 60;
		if (minutes) times.unshift(minutes + (minutes === 1 ? ' minute' : ' minutes'));
		if (time >= 60) {
			time = ~~((time - minutes) / 60);
			hours = time % 24;
			if (hours) times.unshift(hours + (hours === 1 ? ' hour' : ' hours'));
			if (time >= 24) {
				days = ~~((time - hours) / 24);
				if (days) times.unshift(days + (days === 1 ? ' day' : ' days'));
			}
		}
	}
	if (!times.length) return '0 seconds';
	return times.join(', ');
}

require('http').createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	var msg = 'Pokelegends Bot. by codelegend. ' +
	          'Visit us : <a href = "http://lightningstorm.psim.us">Lightning Server</a><br/>' +
			  'Uptime: ' + (getUptimeString());
	res.end(msg);
}).listen(port, bindaddress);

var fs = require('fs');
var ddir = process.env.OPENSHIFT_DATA_DIR;

try {
	fs.writeFileSync('config.js', fs.readFileSync(ddir + 'config.js'));
	fs.writeFileSync('settings.json', fs.readFileSync(ddir + 'settings.json'));
	
	fs.watchFile('settings.json', function (curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		fs.readFile('settings.json', function (err, data) {
			if (err) {
				console.log('Error in reading file : ' + err);
				return;
			}
			fs.writeFile(ddir + 'settings.json', data, function (err) {
				if (err) {
					console.log('Error in writing file : ' + err);
					return;
				}
			});
		});
	});
} catch (e) {
	console.log("Error in setup : " + e);
}

require('./main.js');
