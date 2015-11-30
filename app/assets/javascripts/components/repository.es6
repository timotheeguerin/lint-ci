//=require ./branch-dropdown

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

    onBranchSelected(branch) {
        window.location = branch.html_url;
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
                            src={branch.badge_url}/></a>
                        <a className='badge' href={repository.badges_url}><img
                            src={branch.offense_badge_url}/></a>
                    </div>

                    <a href='#' onClick={this.refresh.bind(this)}>
                        <i className={classes}/>
                    </a>
                </div>

                <div className="box-banner">
                    <Component.BranchDropdown repository={repository} branch={branch}
                                              branches={repository.branches}
                                              showSyncBranchBtn={true}
                                              onBranchSelected={this.onBranchSelected.bind(this)}/>
                </div>

                <div>
                    <RevisionList branch={branch} revisions={branch.revisions}/>
                </div>
            </div>
        )
    }
};
