var Link = React.createClass({
    validTag: function (tag) {
        return !(tag === 'A' || tag === 'INPUT')
    },
    handleMouseDown: function (e) {
        var node = $(e.target);
        if (this.validTag(e.target.tagName) && node.closest('a, .link')[0] === this.refs.link) {
            e.preventDefault();
        }
    },
    handleMouseUp: function (e) {
        var node = $(e.target);
        if (this.validTag(e.target.tagName) && node.closest('a, .link')[0] === this.refs.link) {
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
