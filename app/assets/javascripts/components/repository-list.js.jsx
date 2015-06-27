class RepositoryList extends React.Component {
    constructor(props) {
        this.state = {
            loading: true,
            repositories: this.computeRepositories(props.repositories)
        }
    }

    computeRepositories(repositories) {
        if (repositories instanceof RelationshipProxy) {
            repositories.fetch().then(this.receiveRepositories.bind(this));
            return [];
        } else if (repositories instanceof Promise) {
            repositories.then(this.receiveRepositories.bind(this));
            return [];
        } else {
            return repositories.map((x) => {
                if (x instanceof Repository) {
                    return x;
                } else {
                    return new Repository(x);
                }
            });
        }
    }

    receiveRepositories(repositories) {
        this.setState({repositories: repositories, loading: false})
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.repositories != this.state.repositories) {
            this.setState({
                repositories: this.computeRepositories(nextProps.repositories),
                loading: false
            })
        }
    }

    render() {
        var repositories = this.state.repositories.map(function (repository) {
            return (
                <RepositoryListItem repository={repository} readonly={this.props.readonly}
                                    key={repository.id}/>
            )
        }.bind(this));
        if (repositories.length == 0) {
            repositories = (
                <div className='flex-center no-repository'>
                    <div className='fa fa-database'></div>
                    <div>No repository</div>
                </div>
            )
        }
        return (
            <div className='list repository-list'>
                <Loader loading={this.state.loading} size={4} message="Loading repositories...">
                    {repositories}
                </Loader>
            </div>
        )
    }
}

class RepositoryListItem extends React.Component {
    constructor(props) {
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
                <div className={'offense-status ' + repository.status}>
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

        return (checked

        )
    }
}

RepositoryListItem.defaultProps = {readonly: true}

function renderOffenseCount(count) {
    if (count === 'unavailable') {
        return <i className='fa fa-chain-broken' title='Unavailable'></i>
    } else if (count == 0) {
        return <i className='fa fa-check' title='No offenses'></i>
    } else {
        return count;
    }
}
