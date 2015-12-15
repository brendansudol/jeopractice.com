var $ = require('jquery');
var _ = require('lodash');
var qs = require('qs');
var React = require('react');

var Nav = require('./Nav.jsx');


var App = React.createClass({
    getInitialState: function() {
        return {
            id: null,
            questions: [],
            x: 0,
            y: 0,
            showAnswer: false,
        };
    },

    componentWillMount: function() {
        this.updateUrl = _.debounce(this.updateUrl, 200);
        document.body.onkeydown = this.keyPress;
    },

    componentDidMount: function() {
        var params = this.parseUrl();
        this.fetchGame(params);
    },

    updateUrl: function() {
        var params = qs.stringify({
            id: this.state.id,
            x: this.state.x,
            y: this.state.y,
        });

        console.log(params);

        window.history.pushState(this.state, '', '?' + params);
    },

    parseUrl: function() {
        var params = window.location.search.replace(/^\?|\/$/g, ''),
            params_obj = qs.parse(params),
            cleaned = {};

        _.forEach(params_obj, function(val, key) {
            var num = parseInt(val);
            if (_.isFinite(num) &&
                _.includes(['x', 'y', 'id'], key)) {
                cleaned[key] = num;
            }
        });

        return cleaned;
    },

    fetchGame: function(params) {
        if (!params) params = {};

        var id = params.id || $('#show-num').data('id'),
            url = '/data?id=' + id;

        var self = this;
        $.get(url, function(data) {
            self.setState(_.assign(params, {
                id: id,
                questions: data.questions
            }), self.updateUrl);
        });
    },

    keyPress: function(e) {
        var whitelist = {
            38: 'up',
            40: 'down',
            37: 'left',
            39: 'right',
            32: 'space',
        };

        var key = whitelist[e.keyCode];

        if (!key) return;
        if (key == 'space') return this.toggleAnswer();
        else return this.navClick(key);
    },

    toggleAnswer: function() {
        this.setState({
            showAnswer: !this.state.showAnswer
        });
    },

    navClick: function(id) {
        var questions = this.state.questions,
            pos = this.updatePosition(id);

        if (questions[pos.x] === undefined ||
            questions[pos.x][pos.y] === undefined
        ) {
            return;
        }

        this.setState({
            x: pos.x,
            y: pos.y,
            showAnswer: false
        }, this.updateUrl);
    },

    updatePosition: function(direction) {
        var x = this.state.x,
            y = this.state.y;

        if (direction == 'up') y -= 1;
        if (direction == 'down') y += 1;
        if (direction == 'left') x -= 1;
        if (direction == 'right') x += 1;

        return {x: x, y: y};
    },

    render: function() {
        var questions = this.state.questions;

        if (!questions.length) return null;

        var q = questions[this.state.x][this.state.y];

        return (
        <div>
            <div className="clearfix mb3 h3 caps">
                <div className="sm-col mb1">{q.category}</div>
                <div className="sm-col-right">{q.amount}</div>
            </div>
            <div 
                className="question mb2 h1 bold" 
                dangerouslySetInnerHTML={{__html: q.question}} 
            />
            <div className={"h1 bold yellow " + (this.state.showAnswer ? "" : "display-none")}>
                {q.answer}
            </div>
            <div className="absolute bottom-0 left-0 z1 p1 m1 md-show">
                <div className="caps h6 p1">{q.round}</div>
            </div>
            <Nav onClick={this.navClick} toggleAnswer={this.toggleAnswer} />
        </div>
        );
    }
});


module.exports = App;
