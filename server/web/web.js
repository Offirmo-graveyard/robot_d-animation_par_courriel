
var _ = require('underscore');
var node_path = require('path');


// http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
// http://nodejs.org/api/os.html#os_os_networkinterfaces
var local_ips = _.chain(require('os').networkInterfaces())
.flatten()
.filter(function(val){
	return (val.family === 'IPv4' && val.internal === false)
})
.pluck('address')
.value();

// http://expressjs.com/4x/api.html
var listening_port = 3000;
var express = require('express');
var express_logger = require('morgan');
var app = express();

app.use(express_logger());
app.use(express.static(node_path.join(__dirname, '../../client/public'), {'index': 'index.html'}));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.render('error', {
		message: err.message,
		error: {}
	});
});


_.forEach(local_ips, function(ip) {
	console.log('Listening on http://' + ip + ':' + listening_port);
});
console.log('(Ctrl+C to stop)');

app.listen(listening_port);
