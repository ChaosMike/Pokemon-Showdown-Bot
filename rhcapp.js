// Setup module, for running in RedHatCloud.

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