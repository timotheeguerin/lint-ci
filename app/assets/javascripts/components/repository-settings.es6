var RepositoriesSettings = React.createClass({
    loadCommentsFromServer: function () {
        this.state.user.repos.clone().fetchAll().then((repos) => {
            this.setState({repositories: repos})
        });
    },
    getInitialState: function () {
        return {repositories: [], query: '', refreshing: false};
    },
    componentDidMount: function () {
        api.user().fetch().then((user) => {
            this.setState({user: user});
            this.loadCommentsFromServer();
            this.registerWebEvents();
        });
    },
    registerWebEvents: function () {
        this.channel = websocket.subscribe_private(this.state.user.channels.sync_repo);
        this.channel.bind('completed', (data) => {
            this.loadCommentsFromServer();
            this.setState({refreshing: false})
        });
    },
    onSync: function (e) {
        e.preventDefault();
        Rest.post('/api/v1/user/repos/sync').done(function (data) {
            this.setState({refreshing: true})
        }.bind(this));
    },
    renderSyncBtn() {
        var classes = classNames({
            'fa fa-refresh': true,
            'fa-spin': this.state.refreshing
        });
        return (
            <a href='#' className='btn btn-default' onClick={this.onSync}>
                <i className={classes}></i> Sync
            </a>
        )
    },
    render: function () {
        return (
            <div className="repositories-settings">
                <div className="box-title flex-center">
                    <h2 className='flex-fill'>Repositories</h2>
                    {this.renderSyncBtn()}
                </div>
                <RepositoryList repositories={this.state.repositories} readonly={false}/>
            </div>
        );
    }
});

