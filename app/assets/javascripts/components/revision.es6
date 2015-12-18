Component.Revision = class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            revision: new Revision(api, props.revision),
            branch: this.props.branch,
            repository: this.props.repository
        }
    }

    componentDidMount() {
        this.state.revision.fetch().then((revision) => {
            this.setState({revision: revision})
        });
    }

    rescanRevision() {
        Rest.post(this.state.branch.revisions_url, {sha: this.state.revision.sha});
    }

    deleteRevision() {
        this.state.revision.destroy().then(()=> {
            //window.location = this.state.branch.html_url;
            let message = `Revision ${this.state.revision.short_sha} was deleted successfully!`;
            NotificationManager.success("Deleted!", message).afterGoto(this.state.branch.html_url)
        });
    }

    render() {
        return (
            <div className="shadow-box revision-box">
                <h1 className="box-title">
                    <div className="flex-center">
                        <div className='flex-fill'>
                            <a href={this.state.repository.html_url}>
                                {this.state.repository.full_name}&nbsp;
                            </a>
                        </div>
                        <div className="btn-group revision-controls">
                            <a className="btn btn-default" href="#"
                               onClick={this.rescanRevision.bind(this)}>
                                <i className="fa fa-binoculars"/> Rescan
                            </a>
                            <a className="btn btn-danger" href="#"
                               onClick={this.deleteRevision.bind(this)}>
                                <i className="fa fa-trash"/> Delete
                            </a>
                        </div>
                    </div>
                    <div className="revision-message">
                        {this.state.revision.message}
                    </div>


                </h1>
                <RevisionFileList files={this.state.revision.files}/>
            </div>
        )
    }
};
