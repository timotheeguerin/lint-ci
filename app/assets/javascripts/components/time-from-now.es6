var TimeFromNow = React.createClass({
    getDefaultProps: function () {
        return {
            format: '{0}'
        };
    },
    getInitialState: function () {
        return {
            date: this.getFromTime(this.props.date)
        }
    },
    updateTime: function (date) {
        if (isNull(date)) {
            date = this.props.date;
        }
        this.setState({
            date: this.getFromTime(date)
        })
    },
    getFromTime: function (date) {
        if (isNull(date)) {
            return null;
        } else {
            return moment.utc(date, "YYYY-MM-DD hh:mm:ss").fromNow()
        }
    },
    componentDidMount: function () {
        this.tick();
    },
    tick: function () {
        if (!isNull(this.ticker)) {
            clearInterval(this.ticker);
        }
        this.ticker = setInterval(this.updateTime, 60000);
    },
    componentWillUnmount: function () {
        if (!isNull(this.ticker)) {
            clearInterval(this.ticker);
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.date != this.props.date) {
            this.updateTime(nextProps.date);
            this.tick();
        }
    },
    render: function () {
        return (
            <span>{this.state.date == null ? null : this.props.format.format(this.state.date)}</span>
        );
    }
});
