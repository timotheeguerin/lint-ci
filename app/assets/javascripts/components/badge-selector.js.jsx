var BadgeSelector = React.createClass({
    getInitialState: function () {
        return {
            repository: new Repository(api, this.props.repository)
        }
    },
    componentDidMount: function () {
        this.state.repository.fetch(true).then(function (repository) {
            console.log('Repo:');
            console.log(repository);
            this.setState({repository: repository})
        }.bind(this))
    },
    render: function () {
        return (
            <div className='container badge-box'>
                <h1>Badges</h1>
                <Tabs tabActive={1}>
                    <Tabs.Panel title={'Rating'} active={true}>
                        <h2>Rating badge</h2>

                        <div><img src={this.state.repository.badge_url}/></div>

                    </Tabs.Panel>
                    <Tabs.Panel title={'Offenses'}>

                        <h2>Offense count badge</h2>
                        <div><img src={this.state.repository.offense_badge_url}/></div>
                    </Tabs.Panel>
                </Tabs>

            </div>
        )
    }
});
