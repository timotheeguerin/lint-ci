var RevisionFileList = React.createClass({
    getInitialState: function () {
        return {
            revision: new Revision(api, this.props.revision),
            files: [],
            loading: true
        }
    },
    componentDidMount: function () {
        this.state.revision.files.fetch().then(function (files) {
            this.setState({files: files, loading: false})
        }.bind(this));
    },
    renderOffenseCount: function (count) {
        if (count == 0) {
            return <i className='fa fa-check' title='No offenses'></i>
        } else {
            return count;
        }
    },
    render: function () {
        var files = this.state.files.map(function (file) {
            return (
                <a className='item flex-center' href={file.html_url} key={file.id}>
                    <div className={'file ' + file.status}>
                        {this.renderOffenseCount(file.offense_count)}
                    </div>
                    <div className='flex-fill'>
                        {file.path}
                    </div>
                </a>
            )
        }.bind(this));

        return (
            <div className='list revision-file-list'>
                <Loader loading={this.state.loading} size={4} message="Loading files...">

                    {files}
                </Loader>
            </div>
        )
    }
});
