Component.UserList = class extends Component.Base.LiveList {
    constructor(props) {
        super(props, User);
        console.log(api.users());
        this.loadItems(api.users());
    }

    listClasses() {
        return "user-list";
    }

    itemMatch(file, query) {
        return file.username.indexOf(query) !== -1;
    }

    filterAssociation(association, query) {
        return association.where({username: query})
    }

    renderNoItems() {
        return (
            <div className='v-flex flex-center'>
                <div className='fa fa-user-times'></div>
                <div>No user matching your query!</div>
            </div>
        )
    }

    renderItem(user) {
        return (
            <a className='item flex-center' href={user.html_url} key={user.id}>
                <div className="icon">
                    <img src={user.gravatar_url}/>
                </div>
                <div className='details'>
                    {user.username}
                </div>
            </a>
        )
    }
};
