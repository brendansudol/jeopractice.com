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
        var questions = this.state.questions,
            x = this.state.x,
            y = this.state.y;

        if (direction == 'up') y -= 1;
        if (direction == 'down') y += 1;
        if (direction == 'left') x -= 1;

        // special case (if navigating to final jep)
        if (direction == 'right') {
            x += 1;
            if (x == questions.length - 1) y = 0;
        }

        return {x: x, y: y};
    },

    render: function() {
        var questions = this.state.questions,
            pos = [this.state.x, this.state.y];

        if (!questions.length) return null;

        var q = questions[pos[0]][pos[1]];

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
            <div 
                className={"mb2 h1 bold yellow " + (this.state.showAnswer ? "" : "display-none")}
            >
                {q.answer}
            </div>
            <div className="fixed clearfix bottom-0 left-0 right-0 z1 p1">
                <div className="left md-show">
                    <div className="btn caps h6 p1">{q.round}</div>
                </div>
                <Nav pos={pos}
                     onClick={this.navClick}
                     toggleAnswer={this.toggleAnswer} 
                />
            </div>
        </div>
        );
    }
});


module.exports = App;
