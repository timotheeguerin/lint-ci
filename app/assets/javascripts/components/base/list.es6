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
        if (association instanceof RelationshipProxy || association instanceof Association) {
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

    renderNoItem() {
        let message = this.state.query === '' ? 'No data!' : 'No items matched query!';
        return (
            <div className='v-flex flex-center'>
                <div className='fa fa-database'></div>
                <div>{message}</div>
            </div>
        )
    }

    filterItems(e) {
        this.onQueryChange(e.target.value)
    }

    onQueryChange(query) {
        this.setState({query: query})
    }

    hasMore() {
        return this.association !== undefined && this.association.hasMore();
    }

    render() {
        var items = this.state.items.filter((item) => {
            return this.itemMatch(item, this.state.query)
        }).map(this.renderItem.bind(this));
        if (!this.state.loading && items.length === 0) {
            items = (
                <div className='flex-center no-items'>
                    {this.renderNoItem()}
                </div>
            )
        }
        return (
            <div className={'list '+ this.listClasses()}>
                <div className='box-search'>
                    <input type="text" onChange={this.filterItems.bind(this)}
                           placeholder="Search..."/>
                </div>
                <Component.Controls.InfiniteScroll loadMore={this.fetchNextBatch.bind(this)}
                                                   hasMore={this.hasMore()}>
                    {items}
                </Component.Controls.InfiniteScroll>
            </div>
        )
    }
};

/** This list will refresh the content depending on the query of the user
 *  It will reload data from the server
 */
Component.Base.LiveList = class extends Component.Base.List {
    static typeDelay = 300;

    loadItems(association) {
        if (!association instanceof RelationshipProxy || association instanceof Association) {
            console.error(`${this.constructor.name} require association to be an association or a proxy`);
        }
        this.originalAssociation = association;
        super.loadItems(association.clone());
        this.timeout = null;
    }

    onQueryChange(query) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.setState({loading: true});
            this.timeout = null;
            let filteredAssociation = this.filterAssociation(this.originalAssociation, query).clone();
            this.loadItems(filteredAssociation)
            super.onQueryChange(query);
        }, Component.Base.LiveList.typeDelay)
    }
};
