var React = require('react');

var Matrix = require('./Matrix.jsx');


var Nav = React.createClass({
    getDefaultProps: function() {
        return {
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
        };
    },

    getInitialState: function() {
        return {
            show_matrix: false
        };
    },

    clickHandler: function(btn, e) {
        this.props.onClick(btn);
    },

    answerClick: function(e) {
        this.props.toggleAnswer();
    },

    matrixClick: function(e) {
        var s = this.state.show_matrix;
        this.setState({ show_matrix: !s });
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
            <Matrix 
                pos={this.props.pos}
                updatePosition={this.props.updatePosition}
                showing={this.state.show_matrix}
            />
            <button type="button" className="btn bg-darken-2" onClick={this.answerClick}>
                Answer
            </button>
            {this.props.arrows.map(function(a) {
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
            <button type="button" className="btn bg-darken-2 icon-button ml1" onClick={this.matrixClick}>
                <svg className="icon" data-icon="grid" viewBox="0 0 32 32" fill="#fff">
                    <path d="M2 2 L10 2 L10 10 L2 10z M12 2 L20 2 L20 10 L12 10z M22 2 L30 2 
                             L30 10 L22 10z M2 12 L10 12 L10 20 L2 20z M12 12 L20 12 L20 20 L12 
                             20z M22 12 L30 12 L30 20 L22 20z M2 22 L10 22 L10 30 L2 30z M12 22 
                             L20 22 L20 30 L12 30z M22 22 L30 22 L30 30 L22 30z"></path>
                </svg>
            </button>
        </div>
        );
    }
});


module.exports = Nav
