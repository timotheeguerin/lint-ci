class UserComponent extends ReactComponent {
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
                        <a href={repository.badges_url}><img src={repository.badge_url}/></a>
                        <a href={repository.badges_url}><img
                            src={repository.offense_badge_url}/></a>
                    </div>

                    <a href='#' onClick={this.refresh.bind(this)}>
                        <i className={classes}/>
                    </a>
                </div>

                <div>
                    <RevisionList repository={repository}/>
                </div>
            </div>
        )
    }
}


component.User = UserComponent;
