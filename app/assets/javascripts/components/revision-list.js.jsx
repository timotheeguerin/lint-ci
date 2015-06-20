var RevisionList = React.createClass({
    getInitialState: function () {
        return {
            repository: new Repository(api, this.props.repository),
            revisions: []
        }
    },
    componentDidMount: function () {
        this.state.repository.revisions().fetch().then(function (revisions) {
            this.setState({revisions: revisions})
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
                <a className='item flex-center' href={revision.html_url} key={revision.id}>
                    <div className={'offense ' + revision.status}>
                        {this.renderOffenseCount(revision.offense_count)}
                    </div>
                    <div className='flex-fill'>
                        {revision.message}
                    </div>
                    <div>
                        <i className="fa fa-github"></i> {revision.sha.substring(0, 8)}
                    </div>
                </a>
            )
        }.bind(this));

        return (
            <div className='list revision-list'>
                {revisions}
            </div>
        )
    }
});
