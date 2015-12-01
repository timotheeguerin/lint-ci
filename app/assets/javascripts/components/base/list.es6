/**
 * Reusable class for any type of list
 */
Component.Base.List = class extends React.Component {
    static defaultProps = {loading: false};

    /**
     * @param props React props
     * @param modelCls Class of the model represented in this list. This is needed if the items
     *        are set using a hash of values instead of instance of the modelClass
     */
    constructor(props, modelCls = null) {
        super(props);
        this.modelCls = modelCls;
        this.state = {
            loading: true,
            items: [],
            query: ""
        }
    }


    /**
     * This load items to be displayed in the list.
     * @param association {Array|Promise|HasManyRelationship}It can be the following:
     * - Actual list of items
     * - Promise that will return the list of items
     * - HasManyRelationship
     */
    loadItems(association) {
        if (association instanceof RelationshipProxy) {
            this.association = association;
            this.fetchNextBatch(); //Initial load rest is with paging/infinite load
        } else if (association instanceof Promise) {
            association.then(this.setItems.bind(this));
        } else {
            let objects = ModelHelper.convertArray(association, this.modelCls);
            //Timeout so it can be called in constructor on React component
            setTimeout(() => {
                this.setItems(objects);
            }, 0);
        }
    }

    fetchNextBatch() {
        if (!this.association) {
            return;
        }
        return this.association.fetchNext().then((items) => {
            this.setItems(items);
        })
    }

    listClasses() {
        return "";
    }

    setItems(items) {
        this.setState({items: items, loading: (this.props.loading)})
    }

    renderItem(item) {

    }

    /**
     * Overwrite this method to filter the item when we query
     * @param item Record
     * @param query Query typed in the search box
     * @returns {boolean} If the item should be displayed
     */
    itemMatch(item, query) {
        return true;
    }

    renderNoItems() {
        return (
            <div>
                <div className='fa fa-database'></div>
                <div>No data!</div>
            </div>
        )
    }

    filterItems(e) {
        this.setState({query: e.target.value})
    }

    hasMore() {
        return this.association !== undefined && !this.association.reachedLast;
    }

    render() {
        var items = this.state.items.filter((item) => {
            return this.itemMatch(item, this.state.query)
        }).map(this.renderItem.bind(this));
        if (items.length === 0) {
            items = (
                <div className='flex-center no-repository'>
                    {this.renderNoItems()}
                </div>
            )
        }
        return (
            <div className={'list '+ this.listClasses()}>
                <div className='box-search'>
                    <input type="text" onChange={this.filterItems.bind(this)}
                           placeholder="Search..."/>
                </div>
                <Component.Controls.InfiniteScroll loadMore={this.fetchNextBatch.bind(this)} hasMore={this.hasMore()}>
                    {items}
                </Component.Controls.InfiniteScroll>
            </div>
        )
    }
}

//<Loader loading={this.state.loading} size={4} message={this.props.loadingMessage}>
//    {items}
//</Loader>
