Component.Controls.InfiniteScroll = class extends React.Component {
    static defaultProps = {
        threshold: 250,
        pageStart: 0,
        loadMore: () => {
        }
    };

    constructor(props) {
        super(props);
        this.loading = false;
    }

    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this.attachScrollListener();
    }

    componentDidUpdate() {
        //this.attachScrollListener();
    }

    componentWillUnmount() {
        this.detachScrollListener();
    }

    scrollListener() {
        if (this.loading || !this.props.hasMore) {
            return;
        }

        var el = ReactDOM.findDOMNode(this);
        var scrollTop = (window.pageYOffset) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
            this.detachScrollListener();
            // call loadMore after detachScrollListener to allow
            // for non-async loadMore functions
            console.log("Should load more... at page:", this.pageLoaded);
            let promise = this.props.loadMore(this.pageLoaded++);
            this.loading = true;
            console.log(promise);
            if (promise instanceof Promise) {
                promise.then(() => {
                    console.log("Done loading");
                    this.loading = false;
                })
            }
        }
    }

    attachScrollListener() {
        if (!this.props.hasMore) {
            return;
        }
        window.addEventListener('scroll', this.scrollListener.bind(this));
        window.addEventListener('resize', this.scrollListener.bind(this));
        this.scrollListener();
    }

    detachScrollListener() {
        window.removeEventListener('scroll', this.scrollListener.bind(this));
        window.removeEventListener('resize', this.scrollListener.bind(this));
    }

    render() {
        console.log("has more:", this.props.hasMore);
        return (
            <div>
                {this.props.children}
                <Loader loading={this.props.hasMore} size={4}/>
            </div>
        )
    }
};

function topPosition(domElt) {
    if (!domElt) {
        return 0;
    }
    return domElt.offsetTop + topPosition(domElt.offsetParent);
}
