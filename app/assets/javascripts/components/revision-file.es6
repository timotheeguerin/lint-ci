//= require components/tabs

class RevisionFileViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: new RevisionFile(api, props.file),
            lines: [],
            annotations: {},
            loading: true,
            offenses: []
        }

    }

    keep(text) {
        return '<span>' + text + '</span>'
    }

    highlightOffense(offense, text) {
        return '<span class="offense" data-id="' + offense.id + '" title="' + offense.message + '">' + text + '</span>'
    }

    handleContent(content, offenses) {
        var dom = $(content);
        var pre = dom.find('code');
        var lines = pre.html().split('\n').map(function (x) {
            return $('<div>' + x + '</div>')
        });
        var that = this;
        offenses.forEach(function (offense) {
            var row = offense.line - 1;
            var start = offense.column - 1;
            var end = start + offense.length;
            var current = 0;

            lines[row].contents().filter(function () {
                return this.nodeType === 3
            }).wrap('<span/>');
            lines[row].children().each(function () {
                var text = $(this).text();
                if (current < start) {
                    if (current + text.length >= start) {
                        var left = text.slice(0, start - current);
                        var right = text.slice(start - current, text.length);
                        $(this).html(that.keep(left) + that.highlightOffense(offense, right));
                    }
                } else if (current < end) {
                    var left = text.slice(0, end - current);
                    var right = text.slice(end - current, text.length);
                    $(this).html(that.highlightOffense(offense, left) + that.keep(right));
                }
                current += text.length;
            });

            //When missing a character a the end
            if (current < end) {
                $(that.highlightOffense(offense, ' ')).appendTo(lines[row])

            }
        });

        lines = lines.map(function (x) {
            return x.html()
        });

        return lines;
    }

    findOffense(id) {
        for (var i in this.state.offenses) {
            var offense = this.state.offenses[i];
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
                self.setState({annotations: annotations});
            } else {
                annotations[offense.line] = offense.message;
                self.setState({annotations: annotations});
            }
        });
    }

    componentDidMount() {
        var promises = [this.state.file.content.fetch(), this.state.file.offenses.fetchAll()];
        Promise.all(promises).then((values) => {
            console.log(values[0].highlighted);
            var content = atob(values[0].highlighted);
            var offenses = values[1];
            this.setState({
                lines: this.handleContent(content, offenses),
                offenses: offenses,
                loading: false
            });
        });
        this.registerEvents();
    }

    getLinters() {
        var linters = [];
        for (var offense of this.state.offenses) {
            console.log(offense);
            var linter = offense.linter;
            if (!(linter.name in linters)) {
                linter.offense_count = 1;
                linters[linter.name] = linter;
            } else {
                linters[linter.name].offense_count++;
            }
        }
        var out = [];
        for (var key in linters) {
            if (linters.hasOwnProperty(key)) {
                out.push(linters[key]);
            }
        }
        return out;
    }

    render() {
        return (
            <div>
                <Tabs tabActive={1}>
                    <Tabs.Panel title={'Preview'} active={true}>
                        <Loader loading={this.state.loading} size={4} message="Loading content...">
                            <div className='linters'>
                                <LinterPreview linters={this.getLinters()}/>
                            </div>

                            <RevisionFileViewerCode lines={this.state.lines}
                                                    annotations={this.state.annotations}/>
                        </Loader>
                    </Tabs.Panel>
                    <Tabs.Panel title={'Offenses'}>
                        <div className='list'>
                            <OffenseList offenses={this.state.offenses}
                                         lines={this.state.lines}/>
                        </div>
                    </Tabs.Panel>
                </Tabs>

            </div>


        )
    }
}

class RevisionFileViewerCode extends React.Component {
    render() {
        return (
            <pre className='highlight'>
                <table>
                    <tbody>{this.renderLines()}</tbody>
                </table>
            </pre>
        )
    }

    renderLines() {
        var start = this.props.start;
        var end = this.props.end;
        if (!start || start < 0) {
            start = 0;
        }
        if (!end || end > this.props.length) {
            end = this.props.lines.length;
        }

        return this.props.lines.slice(start, end).map((content, i) => {
            var box = null;
            var line = start + i + 1;
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
                <td className='offense-details'>
                    {this.props.annotations[line]}
                </td>
            </tr>
        )
    }
}
RevisionFileViewerCode.defaultProps = {annotations: {}};

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

class OffenseList extends React.Component {
    render() {
        return (
            <div className='list offense-list'>
                {this.props.offenses.map((x) => this.renderOffense(x))}
            </div>
        )
    }

    renderOffense(offense) {
        var start = offense.line - 3;
        var end = offense.line + 2;
        return (
            <div className='item'>
                <div className='message'>
                    {offense.message}
                </div>
                <RevisionFileViewerCode lines={this.props.lines} start={start} end={end}/>
            </div>
        )
    }
}
