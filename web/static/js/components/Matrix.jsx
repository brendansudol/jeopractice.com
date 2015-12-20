var React = require('react');


var Matrix = React.createClass({
    getDefaultProps: function() {
        return {
            rows: 5,
            cols: 12
        };
    },

    clickHandler: function(cell, e) {
        var pos = {x: cell[0], y: cell[1]};
        this.props.updatePosition(pos);
    },

    render: function() {
        var pos = this.props.pos.join('-'),
            rows = _.range(this.props.rows),
            cols = _.range(this.props.cols),
            self = this;

        return (
        <div className={this.props.showing ? 'showing' : ''} id="matrix-cntnr">
            <table id="matrix">
            {rows.map(function(r) {
                return (
                    <tr key={r}>
                    {cols.map(function(c) {
                        var cell = c + '-' + r;
                        return (
                            <td 
                                key={c} 
                                className={cell === pos ? 'active' : ''}
                                onClick={self.clickHandler.bind(self, [c, r])}
                            />
                        );
                    })}
                    </tr>
                );
            })}
            </table>
        </div>
        );
    }
});


module.exports = Matrix
