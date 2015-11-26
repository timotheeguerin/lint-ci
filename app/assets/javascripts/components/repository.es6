class RepositoryComponent extends React.Component {
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
                    <BranchDropdown branch={branch} branches={repository.branches}/>
                </div>

                <div>
                    <RevisionList branch={branch} revisions={branch.revisions}/>
                </div>
            </div>
        )
    }
}

class BranchDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.computeBranches(this.props.branches);
        this.state = {
            branch: this.props.branch,
            branches: []
        }
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

    render() {
        let options = [];
        for (let branch of this.state.branches) {
            options.push({value: branch.id, label: branch.name})
        }

        return (
            <div className="branch-dropdown">
                <Select name="form-field-name"
                        clearable={false}
                        value={this.state.branch.id} options={options}
                        onChange={this.onSelected.bind(this)}/>
            </div>
        )
    }
}

component.Repository = RepositoryComponent;
