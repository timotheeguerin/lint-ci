class UserComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current_user: api.user(),
            user: new User(api, props.user),
            loading: true
        }
    }

    componentDidMount() {
        let promises = [this.state.current_user.fetch(), this.state.user.fetch()];
        Promise.all(promises).then(([current_user, user]) => {
            this.setState({current_user: current_user, user: user, loading: false})
        });
    }

    renderNoRepoContent() {
        let link;
        if (this.state.current_user.id === this.state.user.id) {
            link = (
                <div className="text-md flex-center">
                    <a href="/settings/repositories" className="btn btn-default h-center">Enable a
                        repository</a>
                </div>
            )
        }
        return (
            <div>
                <div>No repositories!</div>
                {link}
            </div>
        )
    }

    render() {
        var user = this.state.user;
        return (
            <div className="shadow-box">
                <div className="box-title flex-center">
                    <div className='flex-fill'>
                        {user.username}
                    </div>
                </div>

                <div>
                    <RepositoryList loading={this.state.loading}
                                    repositories={user.repos.where({type: 'member', enabled: true})}
                                    noRepoContent={this.renderNoRepoContent()}/>
                </div>
            </div>
        )
    }
}

component.User = UserComponent;
