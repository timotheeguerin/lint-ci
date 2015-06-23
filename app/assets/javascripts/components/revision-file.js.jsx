//= require components/tabs

class RevisionFileViewer extends React.Component {
    constructor(props) {
        this.state = {
            file: new RevisionFile(api, props.file),
            lines: [],
            annotations: {},
            loading: true
        }

    }

    keep(text) {
        return '<span>' + text + '</span>'
    }

    highlightOffense(offense, text) {
        return '<span class="offense" data-id="' + offense.id + '" title="' + offense.message + '">' + text + '</span>'
    }

    handleContent(content) {
        var dom = $(content);
        var pre = dom.find('code');
        var lines = pre.html().split('\n').map(function (x) {
            return $('<div>' + x + '</div>')
        });
        var that = this;
        this.state.file.offenses.forEach(function (offense) {
            var row = offense.line - 1;
            var start = offense.column - 1;
            var end = start + offense.length;
            var current = 0;

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
                    var left = text.slice(0, end - current);
                    var right = text.slice(end - current, text.length);
                    console.log('Not', left, right);
                    $(this).html(that.highlightOffense(offense, left) + that.keep(right));
                }
                current += text.length;
            });
        });

        lines = lines.map(function (x) {
            return x.html()
        });

        return lines;
    }

    findOffense(id) {
        id = parseInt(id);
        for (var i in this.state.file.offenses) {
            var offense = this.state.file.offenses[i];
            if (offense.id == id) {
                return offense;
            }
        }
        return null;
    }

    registerEvents() {
        var self = this;
        $(React.findDOMNode(this)).on('click', '.offense', function () {
            var id = $(this).data('id');
            var offense = self.findOffense(id);
            var annotations = self.state.annotations;
            if (offense.line in annotations) {
                delete annotations[offense.line];
                self.setState(annotations);
            } else {
                annotations[offense.line] = offense.message;
                self.setState(annotations);
            }
        });
    }

    componentDidMount() {
        this.state.file.content.fetch().then((content) => {
            this.setState({lines: this.handleContent(content.raw), loading: false});

        });
        this.registerEvents();
    }

    render() {
        return (
            <div style={{padding: '1rem'}}>
                <Tabs tabActive={1}>
                    <Tabs.Panel title={'Preview'} active={true}>
                        <Loader loading={this.state.loading} size={4} message="Loading content...">
                            <RevisionFileViewerCode lines={this.state.lines}
                                                    annotations={this.state.annotations}/>
                        </Loader>
                    </Tabs.Panel>
                    <Tabs.Panel title={'Offenses'}>
                        <div className='list'>
                        </div>
                    </Tabs.Panel>
                </Tabs>

            </div>


        )
    }
}

RevisionFileViewerCode.defaultProps = {annotations: {}};
class RevisionFileViewerCode extends React.Component {
    render() {
        return (
            <pre className='highlight'>
                <table>
                    {this.renderLines()}
                </table>
            </pre>
        )
    }

    renderLines() {
        return this.props.lines.map((content, i) => {
            var box = '';
            var line = i + 1;
            if (line in this.props.annotations) {
                box = this.renderAnnotation(line)
            }
            return [
                <RevisionFileViewerLine line={line} content={content}/>,
                box
            ]
        });
    }

    renderAnnotation(line) {
        return (
            <tr>
                <td></td>
                <td>
                    <div className='offense-details'>
                        {this.props.annotations[line]}
                    </div>
                </td>
            </tr>
        )
    }
}

class RevisionFileViewerLine extends React.Component {
    render() {
        return (
            <tr>
                <td className='line-number'>{this.props.line}</td>
                <td className='line'
                    dangerouslySetInnerHTML={{__html: this.props.content}}>
                </td>
            </tr>
        )
    }
}
