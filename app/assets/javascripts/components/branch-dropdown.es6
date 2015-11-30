/**
 * React Component for selecting a branch
 */
Component.BranchDropdown = class extends React.Component {
    static propTypes = {
        repository: React.PropTypes.instanceOf(Repository), //Repository having the branches
        branches: React.PropTypes.any.isRequired, //List of branches/has many assoc
        branch: React.PropTypes.any.isRequired, //Current branch
        onBranchSelected: React.PropTypes.func.isRequired

    };

    static defaultProps = {
        showSyncBranchBtn: false
    };

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
                this.props.onBranchSelected(branch);
                this.setState({branch: branch});
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
        if (this.props.showSyncBranchBtn) {
            return (
                <div className="sync-branches">
                    <a href='#' className='btn btn-default' onClick={this.onSyncBranch.bind(this)}>
                        <i className={this.iconClasses()}/> Sync Branches
                    </a>
                </div>
            )
        } else {
            return '';
        }
    }

    render() {
        let options = [];
        for (let branch of this.state.branches) {
            options.push({value: branch.id, label: branch.name})
        }

        return (
            <div className="branch-dropdown">

                {this.renderSyncBranchBtn()}
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
