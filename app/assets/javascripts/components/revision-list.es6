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
        this.channel = websocket.subscribe_private(this.state.repository.channels.revision_changes);
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
                    var newRevisions = revisions.slice(0, i).concat([revision]).concat(revisions.slice(i + 1));
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
                var newRevisions = revisions.slice(0, i).concat(revisions.slice(i + 1));
                this.setState({revisions: newRevisions});
                return;
            }
        }
    },
    render: function () {
        var revisions = this.state.revisions.map(function (revision) {
            return (
                <RevisionListItem revision={revision} repository={this.state.repository}
                                  key={revision.id}/>
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

class RevisionListItem extends React.Component {
    constructor() {
        super();
        this.state = {
            scanMessages: []
        }
    }

    get shortSha() {
        var revision = this.props.revision;
        if (revision.sha) {
            return revision.sha.substring(0, 8);
        } else {
            return ''
        }
    }

    isScanning() {
        return this.props.revision.status != 'scanned';
    }

    componentDidMount() {
        this.updateEvents(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateEvents(newProps);
    }

    componentWillUnMount() {
        this.clearEvents();
    }

    updateEvents(props) {
        if (this.isScanning()) {
            if (this.channel == null) {
                this.channel = websocket.subscribe_private(this.props.revision.channels.scan_update);
                this.channel.bind('update', (message) => {
                    this.setState({scanMessages: this.state.scanMessages.concat([message])});
                })
            }
        } else {
            this.clearEvents();
        }
    }

    clearEvents() {
        if (this.channel) {
            this.channel.unbind('update');
            this.channel = null;
        }
    }

    render() {
        var revision = this.props.revision;
        return (
            <a className='item' href={revision.html_url}>
                <div className={'offense-status ' + revision.style_status}>
                    {this.renderOffenseCount()}
                </div>
                <div className='details'>
                    {this.renderDetails()}
                </div>
                <div className='extra'>
                    <i className="fa fa-github"></i> {this.shortSha}
                </div>
            </a>
        )
    }

    renderDetails() {
        var revision = this.props.revision;
        if (this.isScanning()) {
            return (
                <div className='live-scan-messages'>
                    <div>{this.state.scanMessages[this.state.scanMessages.length - 1]}</div>
                </div>
            )
        } else {
            return (
                <div>
                    <div>{revision.message}</div>
                    <LinterPreview linters={revision.linters}/>
                </div>
            )
        }
    }

    renderOffenseCount() {
        var revision = this.props.revision;
        if (this.isScanning()) {
            return <i className='fa fa-refresh fa-spin' title='Refreshing...'></i>
        }
        else if (revision.offense_count == 0) {
            return <i className='fa fa-check' title='No offenses'></i>
        } else {
            return revision.offense_count;
        }
    }
}

class LinterPreview extends React.Component {
    percent(linter) {
        return Math.round(linter.offense_ratio * 100)
    }

    renderLinter(linter) {
        return (
            <div className='linter' key={linter.name}>
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