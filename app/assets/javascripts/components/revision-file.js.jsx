var Range = ace.require('ace/range').Range;

var RevisionFileViewer = React.createClass({
    getInitialState: function () {
        return {
            file: new RevisionFile(api, this.props.file),
            content: ''
        }

    },
    keep: function (text) {
        return '<span>' + text + '</span>'
    },
    highlightOffense: function (offense, text) {
        return '<span class="offense" title="' + offense.message + '">' + text + '</span>'
    },
    handleContent: function (content) {
        var dom = $(content);
        var pre = dom.find('.code pre');
        var lines = pre.html().split('\n').map(function (x) {
            return $('<div>' + x + '</div>')
        });
        var that = this;
        this.state.file.offenses.forEach(function (offense) {
            var row = offense.line - 1;
            var start = offense.column - 1;
            var end = start + offense.length + 4;
            var current = 0;
            console.log(lines[row].text());

            lines[row].contents().filter(function () {
                return this.nodeType === 3
            })
                .wrap('<span/>');
            lines[row].children().each(function () {
                var text = $(this).text();
                if (current < start) {
                    if (current + text.length >= start) {
                        var left = text.slice(0, start - current);
                        var right = text.slice(start - current, text.length);
                        console.log('First', left, right);
                        $(this).html(that.keep(left) + that.highlightOffense(offense, right));
                    }
                } else if (current < end) {
                    var left = text.slice(0, end - current - 1);
                    var right = text.slice(end - current - 1, text.length);
                    console.log('Not', left, right);
                    $(this).html(that.highlightOffense(offense, left) + that.keep(right));
                }
                current += text.length;
            });
        });

        lines = lines.map(function (x) {
            return x.html()
        });
        pre.html(lines.join('\n'));

        return dom[0].outerHTML;
    },
    registerEvents: function () {
        $(this.getDOMNode()).on('mouseenter', '.offense', function () {
            console.log('enter')
        });

        $(this.getDOMNode()).on('mouseleave', '.offense', function () {
            console.log('leave')
        });
    },
    componentDidMount: function () {
        this.state.file.content.fetch().then(function (content) {
            this.setState({content: this.handleContent(content.raw)});

        }.bind(this));
        this.registerEvents();
    },
    render: function () {
        console.log(this.state.file);
        return (
            <div style={{padding: '1rem'}}>
                <Tabs tabActive={1}>
                    <Tabs.Panel title={'Preview'} active={true}>
                        <div dangerouslySetInnerHTML={{__html: this.state.content}}>

                        </div>
                    </Tabs.Panel>
                    <Tabs.Panel title={'Offenses'}>
                        <div className='list'>
                        </div>
                    </Tabs.Panel>
                </Tabs>

            </div>


        )
    }
});


var Range = ace.require('ace/range').Range;

var RevisionFileViewer2 = React.createClass({
    getInitialState: function () {
        return {
            file: new RevisionFile(api, this.props.file),
            content: {}
        }
    },
    loadEditor: function () {
        this.editor = ace.edit(this.refs.editor.getDOMNode());
        this.editor.setTheme("ace/theme/github");
        this.editor.getSession().setMode("ace/mode/ruby");
        this.editor.setOptions({
            maxLines: Infinity
        });
        this.editor.setHighlightActiveLine(false);
        this.editor.setReadOnly(true);
        this.editor.setShowPrintMargin(false);
        this.editor.on("change", function () {
            this.markOffenses();
        }.bind(this))
    },
    markOffenses: function () {
        this.editor.getSession().clearBreakpoint();
        Object.keys(this.markers).forEach(function (key) {
            this.editor.getSession().removeMarker(key);
            delete this.markers[i];
        }.bind(this));
        for (var i in this.state.file.offenses) {
            var offense = this.state.file.offenses[i];
            var row = offense.line - 1;
            var range = new Range(row, offense.column - 1,
                row, offense.column + offense.length - 1);
            var marker = this.editor.getSession().addMarker(range, "offense", "text");
            this.editor.getSession().setBreakpoint(row);
            this.markers[marker] = offense;
        }
    },
    componentDidMount: function () {
        this.markers = {};
        this.loadEditor();
        this.state.file.content.fetch().then(function (content) {
            this.editor.setValue(content.raw, -1);
        }.bind(this));
    },
    render: function () {
        console.log(this.state.file);
        return (
            <div>
                <Tabs tabActive={1}>
                    <Tabs.Panel title={'Preview'} active={true}>
                        <div>
                            <div className='editor' ref='editor'>
                            </div>
                        </div>
                    </Tabs.Panel>
                    <Tabs.Panel title={'Offenses'}>
                        <div className='list'>
                        </div>
                    </Tabs.Panel>
                </Tabs>

            </div>


        )
    }
});
