var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
const passport = require('./strategies/sql.localstrategy');
const sessionConfig = require('./modules/session-middleware');



const jobsRoute = require('./routes/jobs.route');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('server/public'));

app.use('/jobs', jobsRoute);


// Start listening for requests on a specific port
app.listen(port, function () {
  console.log('listening on port', port);
});

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());