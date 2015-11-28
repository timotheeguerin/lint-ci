component.Repository = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            repository: new Repository(api, props.repository),
            branch: new Branch(api, props.branch)
        }
    }

    componentDidMount() {
        this.state.repository.fetch().then((repository) => {
            this.setState({repository: repository})
        });
    }

    refresh(e) {
        e.preventDefault();
        Rest.post(this.state.branch.scan_url).done((repository) => {
            this.setState({repository: repository})
        });
    }

    renderName() {
        var repository = this.state.repository;
        return (
            <span>
                <a href={repository.owner.html_url}>{repository.owner.username}</a>
                     /<a href={repository.html_url}>{repository.name}</a>
                </span>
        )
    }

    render() {
        var repository = this.state.repository;
        var branch = this.state.branch;
        var classes = classNames({
            'fa fa-refresh': true,
            'fa-spin': repository.refreshing
        });
        return (
            <div className="shadow-box">
                <div className="box-title flex-center">
                    <div className='repository-title flex-fill'>
                        {this.renderName()}
                        <a className='badge' href={repository.badges_url}><img
                            src={repository.badge_url}/></a>
                        <a className='badge' href={repository.badges_url}><img
                            src={repository.offense_badge_url}/></a>
                    </div>

                    <a href='#' onClick={this.refresh.bind(this)}>
                        <i className={classes}/>
                    </a>
                </div>

                <div className="box-banner">
                    <component.BranchDropdown repository={this.state.repository} branch={branch}
                                              branches={repository.branches}/>
                </div>

                <div>
                    <RevisionList branch={branch} revisions={branch.revisions}/>
                </div>
            </div>
        )
    }
};

component.BranchDropdown = class extends React.Component {
    constructor(props) {
        super(props);
        this.computeBranches(this.props.branches);
        this.state = {
            branch: this.props.branch,
            branches: []
        };
        this.registerWebEvents();
    }

    computeBranches(branches) {
        Load.association(branches, Branch, this.setItems.bind(this))
    }

    setItems(items) {
        this.setState({branches: items})
    }

    onSelected(option) {
        for (let branch of this.state.branches) {
            if (branch.id === option.value) {
                console.log("going to ", branch.html_url);
                window.location = branch.html_url;
                return;
            }
        }
    }

    registerWebEvents() {
        this.channel = websocket.subscribe_private(this.props.repository.channels.sync_branches);
        this.channel.bind('completed', () => {
            this.props.branches.resetFetchAllPromise();
            this.computeBranches(this.props.branches);
            this.setState({refreshing: false, success: true});
            setTimeout(() => {
                this.setState({success: false})
            }, RepositoriesSettings.successDuration);
            NotificationManager.success('Completed', 'Your repository were synced successfully');
        });
    }

    onSyncBranch(e) {
        e.preventDefault();
        Rest.post(this.props.repository.sync_branches_url).done(() => {
            this.setState({refreshing: true, success: false})
        });
    }

    iconClasses() {
        if (this.state.success) {
            return 'fa fa-check'
        } else {
            return classNames({
                'fa fa-refresh': true,
                'fa-spin': this.state.refreshing
            });
        }
    }

    renderSyncBranchBtn() {
        return (
            <a href='#' className='btn btn-default' onClick={this.onSyncBranch.bind(this)}>
                <i className={this.iconClasses()}/> Sync Branches
            </a>
        )
    }

    render() {
        let options = [];
        for (let branch of this.state.branches) {
            options.push({value: branch.id, label: branch.name})
        }

        return (
            <div className="branch-dropdown">
                <div className="sync-branches">
                    {this.renderSyncBranchBtn()}
                </div>
                <div className="dropdown">
                    <Select name="form-field-name"
                            clearable={false}
                            value={this.state.branch.id} options={options}
                            onChange={this.onSelected.bind(this)}/>
                </div>
            </div>
        )
    }
};
