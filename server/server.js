var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var auth = require('./auth');

const jobsRoute = require('./routes/jobs.route');
const contactsRoute = require('./routes/contacts.route');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('server/public'));

app.use('/jobs', jobsRoute);
app.use('/auth', auth);
app.use('/contacts', contactsRoute);


// Start listening for requests on a specific port
app.listen(port, function () {
  console.log('listening on port', port);
});
