class RevisionList extends List {
    constructor(props) {
        super(props);
        this.computeRevisions(props.revisions);
    }

    computeRevisions(revisions) {
        Load.association(revisions, Revision, this.setItems.bind(this))
    }

    componentDidMount() {
        this.registerWebEvents();
    }

    registerWebEvents() {
        if (!this.props.branch) {
            return;
        }
        this.channel = websocket.subscribe_private(this.props.branch.channels.revision_changes);
        this.channel.bind('create', (data) => {
            this.addRevision(data);
        });

        this.channel.bind('update', (data) => {
            this.updateRevision(data);
        });


        this.channel.bind('destroy', (data) => {
            this.removeRevision(data);
        });

    }

    addRevision(id) {
        this.props.branch.revisions.find(id).then((revision) => {
            let revisions = [revision].concat(this.state.items);
            this.setItems(revisions);
        })
    }

    updateRevision(id) {
        this.props.branch.revisions.find(id).then((revision) => {
            let revisions = this.state.items;
            for (let i = 0; i < revisions.length; i++) {
                if (this.state.items[i].id == id) {
                    var newRevisions = revisions.slice(0, i).concat([revision]).concat(revisions.slice(i + 1));
                    this.setItems(newRevisions);
                    return;
                }
            }
        })
    }

    removeRevision(id) {
        let revisions = this.state.items;
        for (let i = 0; i < revisions.length; i++) {
            if (this.state.items[i].id == id) {
                var newRevisions = revisions.slice(0, i).concat(revisions.slice(i + 1));
                this.setItems(newRevisions);
                return;
            }
        }
    }

    listClasses() {
        return 'revision-list';
    }

    renderItem(revision) {
        return (
            <RevisionListItem revision={revision} branch={this.props.branch}
                              key={revision.id}/>
        )
    }

    itemMatch(revision, query) {
        if (!revision.message) {
            return query === "";
        }
        return revision.message.indexOf(query) !== -1;
    }
}

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
            return <i className='fa fa-refresh fa-spin' title='Refreshing...'/>
        }
        else if (revision.offense_count == 0) {
            return <i className='fa fa-check' title='No offenses'/>
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
