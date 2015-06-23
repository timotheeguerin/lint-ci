var Link = React.createClass({
    handleMouseDown: function (e) {
        var node = $(e.target);
        if (e.target.tagName !== 'A' && node.closest('a, .link')[0] === this.refs.link.getDOMNode()) {
            e.preventDefault();
        }
    },
    handleMouseUp: function (e) {
        var node = $(e.target);
        if (e.target.tagName !== 'A' && node.closest('a, .link')[0] === this.refs.link.getDOMNode()) {
            if (e.button == 1) {
                var win = window.open(this.props.href, '_blank');
                win.focus();
            } else if (e.button == 0) {
                window.location = this.props.href;
            }
            e.preventDefault();
        }
    },
    render: function () {
        return (
            <div ref='link' onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}
                 className={'link ' + this.props.className }>
                {this.props.children}
            </div>
        )
    }
});
