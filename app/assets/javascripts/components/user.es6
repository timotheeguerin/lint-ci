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
                                    repositories={user.repos.where({enabled: true})}/>
                </div>
            </div>
        )
    }
}

component.User = UserComponent;
