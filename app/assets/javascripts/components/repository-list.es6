class RepositoryList extends Component.Base.List {
    static defaultProps = {
        noRepoContent: 'No repository!'
    };

    constructor(props) {
        console.log("Using a repolist: ", props);
        super(props, Repository);
        this.loadItems(props.repositories)
    }

    itemMatch(repository, query) {
        return repository.name.indexOf(query) !== -1;
    }

    renderItem(item) {
        return (
            <RepositoryListItem repository={item} readonly={this.props.readonly} key={item.id}/>
        )
    }

    renderNoItem() {
        console.log("NO item in repolist");
        let message = this.state.query === '' ? this.props.noRepoContent : 'No repository matched query!';
        return (
            <div className='v-flex flex-center'>
                <div className='fa fa-database'></div>
                <div>{message}</div>
            </div>
        )
    }

    listClasses() {
        return "repository-list";
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.repositories != this.state.items) {
            this.loadItems(nextProps.repositories);
        }
    }
}

class RepositoryListItem extends React.Component {
    static defaultProps = {readonly: true};

    constructor(props) {
        super();
        this.state = {repository: props.repository}
    }

    toggleRepository() {
        var url;
        if (!this.state.repository.enabled) {
            url = this.state.repository.enable_url;
        } else {
            url = this.state.repository.disable_url;
        }

        $.post(url).done(function (data) {
            this.setState({
                repository: data
            })
        }.bind(this)).fail(function (xhr, status, err) {
            console.error("Failure");
            console.error(url, status, err.toString());
        });
    }


    render() {
        var repository = this.props.repository;

        return (
            <Link className='item flex-center' href={repository.html_url} key={repository.id}>
                <div className={'offense-status ' + repository.style_status}>
                    {renderOffenseCount(repository.offense_count)}
                </div>
                <div className='details'>
                    <h3>{this.props.repository.name}</h3>
                    <i>
                        <a href={this.props.repository.github_url} target="_blank">
                            <i className="fa fa-github"/> {this.props.repository.github_url}
                        </a>
                    </i>
                </div>

                <div className="extra">
                    <small>
                        <TimeFromNow date={this.props.repository.sync_at} format='{0}'/>
                    </small>
                    <div>
                        {this.renderEnableToggle()}
                    </div>
                </div>
            </Link>
        )
    }

    renderEnableToggle() {
        if (this.props.readonly) {
            return ''
        }
        var checked;
        if (this.state.repository.enabled) {
            checked =
                <input type="checkbox" defaultChecked onChange={this.toggleRepository.bind(this)}/>;
        } else {
            checked = <input type="checkbox" onChange={this.toggleRepository.bind(this)}/>;
        }

        return (checked)
    }
}


function renderOffenseCount(count) {
    if (count === 'unavailable') {
        return <i className='fa fa-chain-broken' title='Unavailable'/>
    } else if (count == 0) {
        return <i className='fa fa-check' title='No offenses'/>
    } else {
        return count;
    }
}
