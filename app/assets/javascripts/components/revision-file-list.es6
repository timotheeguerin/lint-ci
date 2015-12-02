class RevisionFileList extends Component.Base.LiveList {
    constructor(props) {
        super(props, RevisionFile);
        this.loadItems(this.props.files)
    }

    renderOffenseCount(count) {
        if (count == 0) {
            return <i className='fa fa-check' title='No offenses'/>
        } else {
            return count;
        }
    }

    listClasses() {
        return 'revision-file-list';
    }

    itemMatch(file, query) {
        return file.path.indexOf(query) !== -1;
    }

    filterAssociation(association, query) {
        return association.where({path: query})
    }

    renderItem(file) {
        return (
            <a className='item flex-center' href={file.html_url} key={file.id}>
                <div className={'offense-status ' + file.status}>
                    {this.renderOffenseCount(file.offense_count)}
                </div>
                <div className='details'>
                    {file.path}
                </div>
            </a>
        )
    }
}
