/** @jsx React.DOM */

var RepositoriesSettings = React.createClass({
    loadCommentsFromServer: function () {
        var url = '/api/v1/user/repos';
        Rest.get(url).success(function (data) {
            this.setState({repositories: data});
        }.bind(this)).fail(function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this));
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
        var repositoryNodes = this.state.repositories.map(function (repository) {
            return (
                <RepositorySetting repository={repository}>
                </RepositorySetting>
            );
        });
        return (
            <div className="repositories-settings">
                <div className="box-title flex-center">
                    <h2 className='flex-fill'>Repositories</h2>
                    <a href='#'>
                        <i className='fa fa-refresh' onClick={this.onSync}></i>
                        Sync
                    </a>
                </div>
                <ol className="list">
                    {repositoryNodes}
                </ol>
            </div>
        );
    }
});

var RepositorySetting = React.createClass({
    toggleRepository: function () {
        var url = this.state.repository.url;
        if (!this.state.repository.enabled) {
            url += '/enable';
        } else {
            url += '/disable';
        }

        $.post(url).done(function (data) {
            this.setState({
                repository: data
            })
        }.bind(this)).fail(function (xhr, status, err) {
            console.error("Failure");
            console.error(url, status, err.toString());
        });
    },
    getInitialState: function () {
        return {
            repository: this.props.repository
        }
    },
    onRefresh: function () {
        var url = this.state.repository.url + '/refresh';
        $.post(url).done(function (data) {
            this.setState({
                repository: data.data

            })
        }.bind(this));
    },
    render: function () {
        var checked;
        if (this.state.repository.enabled) {
            checked = <input type="checkbox" defaultChecked onChange={this.toggleRepository}/>;
        } else {
            checked = <input type="checkbox" onChange={this.toggleRepository}/>;
        }

        var refresh_button;
        if (this.state.repository.enabled) {
            refresh_button = (
                <i className='fa fa-refresh' onClick={this.onRefresh}></i>
            );
        }
        return (
            <Link className="item flex" href={'/repositories/' + this.state.repository.id}>
                <div className='refresh-button'>
                    {refresh_button}
                </div>
                <div className="title flex-fill">
                    <h3>{this.props.repository.name}</h3>
                    <i>
                        <a href={this.props.repository.github_url}>
                            {this.props.repository.github_url}
                        </a>
                    </i>
                </div>

                <div className="flex-right flex-center">
                    <small>
                        <TimeFromNow date={this.state.repository.last_sync_at} format='{0}'/>
                    </small>
                    <div>
                        {checked}
                    </div>
                </div>
            </Link>
        );
    }
});
