var RepositoriesSettings = React.createClass({
    loadCommentsFromServer: function () {
        api.user().fetch().then((user) => {
            this.setState({repositories: user.repos})
        })

    },
    getInitialState: function () {
        return {repositories: []};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
    },
    onSync: function (e) {
        e.preventDefault();
        Rest.post('/api/v1/user/repos/sync').done(function (data) {
            this.setState({repositories: data})
        }.bind(this));
    },
    render: function () {
        return (
            <div className="repositories-settings">
                <div className="box-title flex-center">
                    <h2 className='flex-fill'>Repositories</h2>
                    <a href='#'>
                        <i className='fa fa-refresh' onClick={this.onSync}></i>
                        Sync
                    </a>
                </div>
                <RepositoryList repositories={this.state.repositories} readonly={false}/>
            </div>
        );
    }
});

