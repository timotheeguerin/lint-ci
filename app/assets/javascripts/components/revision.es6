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

    render() {
        return (
            <div className=" shadow-box">
                <h1 className="box-title">
                    <a href={this.state.repository.html_url}>
                        {this.state.repository.full_name}&nbsp;
                    </a>
                    {this.state.revision.message}
                </h1>
                <RevisionFileList files={this.state.revision.files}/>
            </div>
        )
    }
};
