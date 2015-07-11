var RevisionList = React.createClass({
    getInitialState: function () {
        return {
            repository: new Repository(api, this.props.repository),
            revisions: [],
            loading: true
        }
    },
    componentDidMount: function () {
        this.state.repository.revisions.fetch().then(function (revisions) {
            this.setState({revisions: revisions, loading: false})
        }.bind(this));
        this.registerWebEvents();
    },
    registerWebEvents: function () {
        this.channel = websocket.subscribe_private('revisions/change');
        this.channel.bind('create', (data) => {
            this.addRevision(data);
        });

        this.channel.bind('update', (data) => {
            this.updateRevision(data);
        });


        this.channel.bind('destroy', (data) => {
            this.removeRevision(data);
        });

    },
    addRevision(id) {
        this.state.repository.revisions.find(id).then((revision) => {
            let revisions = [revision].concat(this.state.revisions);
            this.setState({revisions: revisions})
        })
    },
    updateRevision(id) {
        this.state.repository.revisions.find(id).then((revision) => {
            let revisions = this.state.revisions;
            for (let i = 0; i < revisions.length; i++) {
                if (this.state.revisions[i].id == id) {
                    var newRevisions = revisions.slice(0, i - 1).concat([revision]).concat(revisions.slice(i + 1, revisions.length));
                    this.setState({revisions: newRevisions});
                    return;
                }
            }
        })
    },
    removeRevision(id) {
        let revisions = this.state.revisions;
        for (let i = 0; i < revisions.length; i++) {
            if (this.state.revisions[i].id == id) {
                var newRevisions = revisions.slice(0, i - 1).concat(revisions.slice(i + 1, revisions.length));
                this.setState({revisions: newRevisions});
                return;
            }
        }
    },
    renderOffenseCount: function (revision) {
        if (revision.status != 'scanned') {
            return <i className='fa fa-refresh fa-spin' title='Refreshing...'></i>

        }
        else if (revision.offense_count == 0) {
            return <i className='fa fa-check' title='No offenses'></i>
        } else {
            return revision.offense_count;
        }
    },
    render: function () {
        var revisions = this.state.revisions.map(function (revision) {
            let short_sha = '';
            if (revision.sha) {
                short_sha = revision.sha.substring(0, 8);
            }
            return (
                <a className='item' href={revision.html_url} key={revision.id}>
                    <div className={'offense-status ' + revision.style_status}>
                        {this.renderOffenseCount(revision)}
                    </div>
                    <div className='details'>
                        <div>{revision.message}</div>
                        <LinterPreview linters={revision.linters}/>
                    </div>
                    <div className='extra'>
                        <i className="fa fa-github"></i> {short_sha}
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
