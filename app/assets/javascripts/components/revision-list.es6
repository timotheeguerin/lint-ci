class RevisionList extends Component.Base.List {
    constructor(props) {
        super(props, Revision);
        this.loadItems(props.revisions);
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
            <RevisionList.Item revision={revision} branch={this.props.branch} key={revision.id}/>
        )
    }

    itemMatch(revision, query) {
        if (!revision.message) {
            return query === "";
        }
        return revision.message.indexOf(query) !== -1;
    }
}

RevisionList.Item = class extends React.Component {
    constructor() {
        super();
    }

    get shortSha() {
        let revision = this.props.revision;
        return revision.sha ? revision.short_sha : '';
    }

    isScanning() {
        return this.props.revision.status != 'scanned';
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
                    <i className="fa fa-github"/> {this.shortSha}
                </div>
            </a>
        )
    }

    renderDetails() {
        var revision = this.props.revision;
        if (this.isScanning()) {
            return (
                <RevisionScanProgressTracker revision={this.props.revision}/>
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
};

class RevisionScanProgressTracker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }

    componentDidMount() {
        this.channel = websocket.subscribe_private(this.props.revision.channels.scan_update);
        this.channel.bind('update', (message) => {
            this.setState({scanMessages: this.state.messages.concat([message])});
        })
    }

    componentWillUnmount() {
        if (this.channel) {
            this.channel.unbind('update');
            this.channel = null;
        }
    }

    render() {
        return (
            <div className='live-scan-messages'>
                <div>{this.state.messages[this.state.messages.length - 1]}</div>
            </div>
        )
    }
}

class LinterPreview extends React.Component {
    static defaultProps = {show: 2};

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

