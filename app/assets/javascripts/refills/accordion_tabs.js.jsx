var Tabs = React.createClass({
    displayName: 'Tabs',
    propTypes: {
        className: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.string,
            React.PropTypes.object
        ]),
        tabActive: React.PropTypes.number,
        onMount: React.PropTypes.func,
        onBeforeChange: React.PropTypes.func,
        onAfterChange: React.PropTypes.func,
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.element
        ]).isRequired
    },
    getDefaultProps: function () {
        return {tabActive: 1};
    },
    getInitialState: function () {
        return {
            tabActive: this.props.tabActive
        };
    },
    componentDidMount: function () {
        var index = this.state.tabActive;
        var $selectedPanel = this.refs['tab-panel'];
        var $selectedMenu = this.refs[("tab-menu-" + index)];

        if (this.props.onMount) {
            this.props.onMount(index, $selectedPanel, $selectedMenu);
        }
    },
    componentWillReceiveProps: function (newProps) {
        if (newProps.tabActive) {
            this.setState({tabActive: newProps.tabActive})
        }
    },
    render: function () {
        var className = classNames('tabs', this.props.className);
        return (
            <div className={className}>
                {this._getMenuItems()}
                {this._getSelectedPanel()}
            </div>
        );
    },
    setActive: function (index, e) {
        var onAfterChange = this.props.onAfterChange;
        var onBeforeChange = this.props.onBeforeChange;
        var $selectedPanel = this.refs['tab-panel'];
        var $selectedTabMenu = this.refs[("tab-menu-" + index)];

        if (onBeforeChange) {
            var cancel = onBeforeChange(index, $selectedPanel, $selectedTabMenu);
            if (cancel === false) {
                return
            }
        }

        this.setState({tabActive: index}, function () {
            if (onAfterChange) {
                onAfterChange(index, $selectedPanel, $selectedTabMenu);
            }
        });

        e.preventDefault();
    },
    _getMenuItems: function () {
        if (!this.props.children) {
            throw new Error('Tabs must contain at least one Tabs.Panel');
        }

        if (!Array.isArray(this.props.children)) {
            this.props.children = [this.props.children];
        }

        var $menuItems = this.props.children
            .map(function ($panel) {
                return typeof $panel === 'function' ? $panel() : $panel;
            })
            .filter(function ($panel) {
                return $panel;
            })
            .map(function ($panel, index) {
                var ref = ("tab-menu-" + (index + 1));
                var title = $panel.props.title;
                var classes = classNames(
                    'tabs-menu-item',
                    this.state.tabActive === (index + 1) && 'is-active'
                );

                return (
                    React.createElement("li", {ref: ref, key: index, className: classes},
                        React.createElement("a", {
                                href: "#",
                                onClick: this.setActive.bind(this, index + 1)
                            },
                            title
                        )
                    )
                );
            }.bind(this));

        return (
            React.createElement("nav", {className: "tabs-navigation"},
                React.createElement("ul", {className: "tabs-menu"}, $menuItems)
            )
        );
    },
    _getSelectedPanel: function () {
        var index = this.state.tabActive - 1;
        var panel = this.props.children[index];
        return (
            <article ref='tab-panel' className='tab-panel'>
                {panel}
            </article>
        );
    }
});

Tabs.Panel = React.createClass({
    displayName: 'Panel',
    propTypes: {
        title: React.PropTypes.string.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.element
        ]).isRequired
    },
    render: function () {
        return React.createElement("div", null, this.props.children);
    }
});


