var RepositoriesSettings = React.createClass({
    loadCommentsFromServer: function () {
        api.user().fetch().then((user) => {
            user.repos.fetchAll().then((repos) => {
                this.setState({repositories: repos})
            });
        })
    },
    getInitialState: function () {
        return {repositories: [], query: '', refreshing: false};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
    },
    onSync: function (e) {
        e.preventDefault();
        this.setState({refreshing: true});
        Rest.post('/api/v1/user/repos/sync').done(function (data) {
            this.setState({repositories: data, refreshing: false})
        }.bind(this));
    },
    filterRepos() {
        return this.state.repositories.filter((x) => {
            return x.name.indexOf(this.state.query) != -1
        })
    },
    onSearch: function (e) {
        this.setState({query: e.target.value})
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
                <div className='box-search'>
                    <input onChange={this.onSearch} value={this.state.query}
                           placeholder='Search..'/>
                </div>
                <RepositoryList repositories={this.filterRepos()} readonly={false}/>
            </div>
        );
    }
});

