console.log('The bot is starting');

// getSearch();

export function getSearch() {
    var Twit = require('twit');
    var config = require('./config');

    var T = new Twit(config);

    T.get('/users/search', { q: 'Atmosphere IoT' }, function (err, data, response) {
        console.log(data)

    })
}

