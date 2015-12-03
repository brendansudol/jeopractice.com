var $ = require('jquery');
var _ = require('lodash');
var React = require('react');


var Nav = React.createClass({
  arrows: [
    {
      arrow: "left",
      svg: "M20 1 L24 5 L14 16 L24 27 L20 31 L6 16 z"
    },
    {
      arrow: "down",
      svg: "M1 12 L16 26 L31 12 L27 8 L16 18 L5 8 z"
    },
    {
      arrow: "up",
      svg: "M1 20 L16 6 L31 20 L27 24 L16 14 L5 24 z"
    },
    {
      arrow: "right",
      svg: "M12 1 L26 16 L12 31 L8 27 L18 16 L8 5 z"
    },
  ],

  clickHandler: function(e) {
    var btn = e.target.getAttribute("data-id");
    this.props.onClick(btn);
  },

  render: function() {
    var self = this;

    return (
      <div className="jeop-nav-holder">
        <div id="grid-controls" className="absolute bottom-0 right-0 z1 p1 m1">
          {
            self.arrows.map(function(a) {
              return (
                <button 
                  key={a.arrow}
                  type="button" 
                  className="btn bg-darken-2 icon-button ml1"
                  data-id={a.arrow}
                  onClick={self.clickHandler}
                >
                  <svg className="icon" data-icon={a.arrow} viewBox="0 0 32 32" fill="#fff">
                    <path d={a.svg}></path>
                  </svg>
                </button>
              );
            })
          }
        </div>
      </div>
    );
  }
});


var App = React.createClass({
  getInitialState: function() {
    return {
      game: [],
      position: {x: 0, y: 0},
      showAnswer: false,
    };
  },

  componentDidMount: function() {
    document.body.onkeydown = this.handleKeyDown;

    var self = this;
    $.get('/data', function(data) {
      var game = _.values(data.game);
      self.setState({ game: game });
    });
  },

  handleKeyDown: function(e) {
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
    var game = this.state.game,
        pos = this.updatePosition(id);

    if (game[pos.x] == undefined || 
        game[pos.x][pos.y] == undefined
    ) { return; }

    this.setState({
      position: pos,
      showAnswer: false
    });
  },

  updatePosition: function(direction) {
    var pos = this.state.position,
        x = pos.x,
        y = pos.y;

    if (direction == 'up') y -= 1;
    if (direction == 'down') y += 1;
    if (direction == 'left') x -= 1;
    if (direction == 'right') x += 1;

    return {x: x, y: y};
  },

  render: function() {
    if (!this.state.game.length) return null;

    var pos = this.state.position,
        q = this.state.game[pos.x][pos.y];

    return (
      <div>
        <div className="clearfix mb3">
          <div className="left caps">{q.category}</div>
          <div className="right">${q.amount}</div>
        </div>
        <div 
          className="question mb2 h1 bold" 
          dangerouslySetInnerHTML={{__html: q.question}} 
        />
        <div className={"h2 answer " + (this.state.showAnswer ? "" : "display-none")}>
          A: {q.answer}
        </div>
        <div className="absolute bottom-0 left-0 z1 p1 m1">
          <button type="button" className="btn bg-darken-2" onClick={this.toggleAnswer}>
            Answer
          </button>
        </div>
        <Nav onClick={this.navClick} />
      </div>
    );
  }
});


module.exports = App;
