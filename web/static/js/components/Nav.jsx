var React = require('react');


var Nav = React.createClass({
    arrows: [{
        arrow: "left",
        svg: "M20 1 L24 5 L14 16 L24 27 L20 31 L6 16 z"
    }, {
        arrow: "down",
        svg: "M1 12 L16 26 L31 12 L27 8 L16 18 L5 8 z"
    }, {
        arrow: "up",
        svg: "M1 20 L16 6 L31 20 L27 24 L16 14 L5 24 z"
    }, {
        arrow: "right",
        svg: "M12 1 L26 16 L12 31 L8 27 L18 16 L8 5 z"
    }, ],

    clickHandler: function(btn, e) {
        this.props.onClick(btn);
    },

    answerClick: function(e) {
        this.props.toggleAnswer();
    },

    movability: function(pos) {
        var x = pos[0],
            y = pos[1],
            move = {up: true, down: true, left: true, right: true};

        if (x === 0) move.left = false;
        if (x >= 12) move.right = false;
        if (y === 0) move.up = false;
        if (y >= 4 || (x === 12 && y === 0)) move.down = false;

        return move;
    },

    render: function() {
        var self = this,
            move = this.movability(this.props.pos);

        return (
        <div className="right">
            <button type="button" className="btn bg-darken-2" onClick={this.answerClick}>
                Answer
            </button>
                {self.arrows.map(function(a) {
                return (
                    <button 
                        key={a.arrow}
                        type="button" 
                        className="btn bg-darken-2 icon-button ml1"
                        onClick={self.clickHandler.bind(self, a.arrow)}
                        disabled={!move[a.arrow]}
                    >
                        <svg className="icon" data-icon={a.arrow} viewBox="0 0 32 32" fill="#fff">
                            <path d={a.svg}></path>
                        </svg>
                    </button>
                );
            })}
        </div>
        );
    }
});


module.exports = Nav

