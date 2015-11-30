class BadgeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            repository: new Repository(api, props.repository),
            branch: new Branch(api, props.repository.default_branch)
        }
    }

    componentDidMount() {
        this.state.repository.fetch(true).then(function (repository) {
            this.setState({repository: repository})
        }.bind(this));
    }

    onBranchSelected(branch) {
        this.setState({branch: branch})
    }

    renderLinks(url) {
        var link = this.state.repository.html_url;
        return (
            <div>
                <div className='form-section'>
                    <label>Url</label>
                    <input value={url} readOnly={true}/>
                </div>
                <div className='form-section'>
                    <label>Html</label>
                    <input value={badgeHtml(url, link)} readOnly={true}/>
                </div>
                <div className='form-section'>
                    <label>Markdown</label>
                    <input value={badgeMarkdown(url, link)} readOnly={true}/>
                </div>
                <div className='form-section'>
                    <label>Textile</label>
                    <input value={badgeTextile(url, link)} readOnly={true}/>
                </div>
                <div className='form-section'>
                    <label>RDoc</label>
                    <input value={badgeRDoc(url, link)} readOnly={true}/>
                </div>
            </div>

        )
    }

    render() {
        let branch = this.state.branch;
        let repository = this.state.repository;
        return (
            <div className='sm-container badge-box'>
                <h1>
                    <a href={this.state.repository.html_url}>
                        {this.state.repository.full_name}
                    </a> Badges
                    <Component.BranchDropdown repository={repository} branch={branch}
                                              branches={repository.branches}
                                              onBranchSelected={this.onBranchSelected.bind(this)}/>
                </h1>
                <Tabs tabActive={1}>
                    <Tabs.Panel title={'Rating'} active={true}>
                        <h2>Rating badge</h2>
                        <a className='badge' href={repository.badges_url}><img
                            src={branch.badge_url}/></a>

                        <div><img src={this.state.repository.badge_url}/></div>
                        {this.renderLinks(this.state.branch.badge_url)}
                    </Tabs.Panel>
                    <Tabs.Panel title={'Offenses'}>
                        <h2>Offense count badge</h2>
                        <a className='badge' href={repository.badges_url}><img
                            src={branch.offense_badge_url}/></a>
                        <div><img src={this.state.repository.offense_badge_url}/></div>
                        {this.renderLinks(this.state.branch.offense_badge_url)}

                    </Tabs.Panel>
                </Tabs>

            </div>
        )
    }
}
;


function badgeMarkdown(badge_url, link) {
    return `[![Lint-CI](${badge_url})](${link})`
}


function badgeTextile(badge_url, link) {
    return `"!${badge_url}!":${link}`
}


function badgeRDoc(badge_url, link) {
    return `{<img src="${badge_url}" />}[${link}]`
}


function badgeHtml(badge_url, link) {
    return `<a href="${link}"><img src="${badge_url}" /></a>`
}
