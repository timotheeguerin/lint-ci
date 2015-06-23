class UserComponent extends React.Component {
    constructor(props) {
        this.state = {
            user: new User(api, props.user)
        }
    }

    componentDidMount() {
        this.state.user.fetch().then((user) => {
            this.setState({user: user})
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
                    <RepositoryList repositories={user.repos.where({enabled: true})}/>
                </div>
            </div>
        )
    }
}

component.User = UserComponent;
