class Loader extends React.Component {
    constructor(props) {

    }

    render() {
        if (this.props.loading) {
            return this.renderLoader()
        } else {
            return <div>{this.props.children}</div>;
        }
    }

    renderLoader() {
        var size_class = 'fa-' + this.props.size;
        var classes = 'fa fa-circle-o-notch fa-spin ';
        if (isDefined(this.props.size)) {
            //classes += size_class + 'x';
        }
        return (
            <div className='spinner' style={{'font-size': this.props.size + 'rem'}}>
                <i className={classes}></i>

                <div className='message'>
                    {this.props.message}
                </div>
            </div>
        )
    }
}

Loader.defaultProps = {loading: true, size: 2};
