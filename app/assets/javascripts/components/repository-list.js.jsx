class RepositoryList extends React.Component {
    constructor(props) {
        var repos = [];
        console.log(props);
        if (props.repositories instanceof RelationshipProxy) {
            props.repositories.fetch().then((repositories) => {
                this.setState({repositories: repositories})
            })
        } else {
            repos = props.repositories.map((x) => new Repository(x))
        }
        this.state = {
            repositories: repos
        }
    }

    renderOffenseCount(count) {
        if (count === 'unavailable') {
            return <i className='fa fa-chain-broken' title='Unavailable'></i>
        } else if (count == 0) {
            return <i className='fa fa-check' title='No offenses'></i>
        } else {
            return count;
        }
    }


    render() {
        var repositories = this.state.repositories.map(function (repository) {
            return (
                <Link className='item flex-center' href={repository.html_url} key={repository.id}>
                    <div className={'offense ' + repository.status}>
                        {this.renderOffenseCount(repository.offense_count)}
                    </div>
                    <div className='flex-fill'>
                        {repository.name}
                    </div>
                    <div>
                        <a href={repository.github_url}>
                            <i className="fa fa-github"></i>
                        </a>
                    </div>
                </Link>
            )
        }.bind(this));
        return (
            <div className='list repository-list'>
                {repositories}
            </div>
        )
    }
}
