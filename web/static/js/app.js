/*
 * styles
 */

require('../sass/app.scss');


/*
 * js
 */

var React = require('react');
var App = require('./components/App.js');


React.render(
    <App />, 
    document.getElementById('main')
);