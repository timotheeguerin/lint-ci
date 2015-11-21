/**
 * Reusable class for any type of list
 */
class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [],
            query: ""
        }
    }

    listClasses() {
        return "";
    }

    setItems(items) {
        this.setState({items: items, loading: false})
    }

    renderItem(item) {

    }

    itemMatch(item, query) {
        return true;
    }

    renderNoItems() {
        return (
            <div>
                <div className='fa fa-database'></div>
                <div>No data!</div>
            </div>
        )
    }

    filterItems(e) {
        this.setState({query: e.target.value})
    }

    render() {
        var items = this.state.items.filter((item) => {
            return this.itemMatch(item, this.state.query)
        }).map(this.renderItem.bind(this));
        if (items.length === 0) {
            items = (
                <div className='flex-center no-repository'>
                    {this.renderNoItems()}
                </div>
            )
        }
        return (
            <div className={'list '+ this.listClasses()}>
                <div className='box-search'>
                    <input type="text" onChange={this.filterItems.bind(this)}
                           placeholder="Search..."/>
                </div>
                <Loader loading={this.state.loading} size={4} message={this.props.loadingMessage}>
                    {items}
                </Loader>
            </div>
        )
    }
}

class RepositoryList extends List {
    constructor(props) {
        super(props);
        this.computeRepositories(props.repositories)
    }

    computeRepositories(repositories) {
        if (repositories instanceof RelationshipProxy) {
            repositories.fetch().then(this.setItems.bind(this));
        } else if (repositories instanceof Promise) {
            repositories.then(this.setItems.bind(this));
        } else {
            let repos = repositories.map((x) => {
                if (x instanceof Repository) {
                    return x;
                } else {
                    return new Repository(x);
                }
            });
            this.setItems(repos)
        }
    }

    itemMatch(repository, query) {
        return repository.name.indexOf(query) !== -1;
    }

    renderItem(item) {
        return (
            <RepositoryListItem repository={item} readonly={this.props.readonly} key={item.id}/>
        )
    }

    listClasses() {
        return "repository-list";
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.repositories != this.state.items) {
            this.computeRepositories(nextProps.repositories);
        }
    }
}

class RepositoryListItem extends React.Component {
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
                        <a href={this.props.repository.github_url}>
                            <i className="fa fa-github"></i> {this.props.repository.github_url}
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

RepositoryListItem.defaultProps = {readonly: true};

function renderOffenseCount(count) {
    if (count === 'unavailable') {
        return <i className='fa fa-chain-broken' title='Unavailable'></i>
    } else if (count == 0) {
        return <i className='fa fa-check' title='No offenses'></i>
    } else {
        return count;
    }
}
