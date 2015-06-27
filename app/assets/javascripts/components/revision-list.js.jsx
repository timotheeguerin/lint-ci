var RevisionList = React.createClass({
    getInitialState: function () {
        return {
            repository: new Repository(api, this.props.repository),
            revisions: [],
            loading: true
        }
    },
    componentDidMount: function () {
        this.state.repository.revisions().fetch().then(function (revisions) {
            this.setState({revisions: revisions, loading: false})
        }.bind(this));
    },
    renderOffenseCount: function (count) {
        if (count == 0) {
            return <i className='fa fa-check' title='No offenses'></i>
        } else {
            return count;
        }
    },
    render: function () {
        var revisions = this.state.revisions.map(function (revision) {
            return (
                <a className='item' href={revision.html_url} key={revision.id}>
                    <div className={'offense-status ' + revision.status}>
                        {this.renderOffenseCount(revision.offense_count)}
                    </div>
                    <div className='details'>
                        <div>{revision.message}</div>
                        <LinterPreview linters={revision.linters}/>
                    </div>
                    <div className='extra'>
                        <i className="fa fa-github"></i> {revision.sha.substring(0, 8)}
                    </div>
                </a>
            )
        }.bind(this));

        return (
            <div className='list revision-list'>
                <Loader loading={this.state.loading} size={4} message="Loading revisions...">
                    {revisions}
                </Loader>
            </div>
        )
    }
});


class LinterPreview extends React.Component {
    percent(linter) {
        return Math.round(linter.offense_ratio * 100)
    }

    renderLinter(linter) {
        return (
            <div className='linter'>
                <span className='linter-name'>{linter.name} </span>
                <span className={'offense-status ' + linter.status}>
                    {linter.offense_count}
                </span>
            </div>
        )
    }

    render() {
        return (
            <div className='linter-preview'>
                {this.props.linters.slice(0, this.props.show).map((x) => this.renderLinter(x))}
            </div>
        )
    }
}

LinterPreview.defaultProps = {show: 2};
