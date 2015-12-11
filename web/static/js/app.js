/*
 * styles
 */

require('../sass/app.scss');


/*
 * js
 */

var React = require('react');
var App = require('./components/App.jsx');

require('./vendor/tooltip');


React.render(
    <App />, 
    document.getElementById('main')
);
