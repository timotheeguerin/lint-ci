var BadgeSelector = React.createClass({
    getInitialState: function () {
        return {
            repository: new Repository(api, this.props.repository)
        }
    },
    componentDidMount: function () {
        this.state.repository.fetch(true).then(function (repository) {
            this.setState({repository: repository})
        }.bind(this));
    },
    renderLinks: function (url) {
        var link = this.state.repository.html_url;
        return (
            <div>
                <div className='form-section'>
                    <label>Url</label>
                    <input value={url}></input>
                </div>
                <div className='form-section'>
                    <label>Html</label>
                    <input value={badgeHtml(url, link)}></input>
                </div>
                <div className='form-section'>
                    <label>Markdown</label>
                    <input value={badgeMarkdown(url, link)}></input>
                </div>
                <div className='form-section'>
                    <label>Textile</label>
                    <input value={badgeTextile(url, link)}></input>
                </div>
                <div className='form-section'>
                    <label>RDoc</label>
                    <input value={badgeRDoc(url, link)}></input>
                </div>
            </div>

        )
    },
    render: function () {
        return (
            <div className='sm-container badge-box'>
                <h1>
                    <a href={this.state.repository.html_url}>
                        {this.state.repository.full_name}
                    </a> Badges
                </h1>
                <Tabs tabActive={1}>
                    <Tabs.Panel title={'Rating'} active={true}>
                        <h2>Rating badge</h2>

                        <div><img src={this.state.repository.badge_url}/></div>
                        {this.renderLinks(this.state.repository.badge_url)}
                    </Tabs.Panel>
                    <Tabs.Panel title={'Offenses'}>

                        <h2>Offense count badge</h2>

                        <div><img src={this.state.repository.offense_badge_url}/></div>
                        {this.renderLinks(this.state.repository.offense_badge_url)}

                    </Tabs.Panel>
                </Tabs>

            </div>
        )
    }
});


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
