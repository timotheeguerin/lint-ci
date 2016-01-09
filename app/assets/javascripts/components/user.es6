class UserComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: new User(api, props.user),
            loading: true
        }
    }

    componentDidMount() {
        this.state.user.fetch().then((user) => {
            this.setState({user: user, loading: false})
        });
    }

    renderNoRepoContent() {
        return (
            <div>
                <div>No repositories!</div>
                <div className="text-md flex-center">
                    <a href="/settings/repositories" className="btn btn-default h-center">Enable a
                        repository</a>
                </div>
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
