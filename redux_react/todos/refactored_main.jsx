let nextTodoId = 0;
const {connect} = ReactRedux;
//====================Reducer==============================
const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id){
                return state;
            }
            return Object.assign({},state,{
                completed: !state.completed
            });
        default:
            return state;
    }
}
const todos = (state =[], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t =>{
                return todo(t, action);
            });
        default:
            return state;
    }
};
const visiblityFilter = (state = 'SHOW_ALL', action) =>{
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

    //===========================combineReducers ========================
    const {combineReducers} = Redux;
    // const combineReducers = (reducers) =>{
    //     return (state = {}, action) =>{
    //         return Object.keys(reducers).reduce((nextState, key)=>{   // the nextState is {} at the begining
    //             nextState[key] = reducers[key](state[key], action);
    //             return nextState;
    //         }, {});
    //     };
    // };
    const todoApp = combineReducers({
        todos,
        visiblityFilter
    });
    // const todoApp = (state = {}, action) =>{
    //     return {
    //         todos: todos(state.todos, action),
    //         visiblityFilter: visiblityFilter(
    //             state.visiblityFilter,
    //             action
    //         )
    //     };
    // };
    //=========================== end combineReducers ========================
//=========================end reducer==============================

//=================================== Helper ==================================
const getVisibleTodos = (todos, filter) =>{
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter(todo=> !todo.completed);
        case 'SHOW_COMPLETED':
            return todos.filter(todo=> todo.completed);
        default:
            return todos;
    }
};
//=================================== End Helper===============================

const { Component } = React;

//=============== addTodo is the combination of presetational component and container component

let AddTodo = ({dispatch}) =>{
    let input;
    return (
        <div>
        <input ref={node=>{
            input = node;
        }} />
        <button onClick={()=>{
            dispatch({
                type: 'ADD_TODO',
                id: nextTodoId++,
                text: input.value
            });
            input.value = '';
        }}>Add Todo</button>
        </div>
    )
}
AddTodo = connect(
    // state =>{
    //     return {}
    // },
    // dispatch =>{
    //     return {dispatch}
    // }
)(AddTodo);
// AddTodo.contextTypes = {
//     store: React.PropTypes.object
// };
//======================== presentational compoenent ====================

const Todo = ({
    onClick,
    completed,
    text
}) =>{
    return (
        <li onClick={onClick}
        style={{
            textDecoration: completed? 'line-through': 'none'
        }}> {text}</li>
    )
}

const TodoList = ({
    todos,
    onTodoClick
})=>{
    return (
        <ul>
            {todos.map(todo =>
                <Todo key={todo.id} completed={todo.completed} text={todo.text} onClick={() => onTodoClick(todo.id)}/>
            )}
        </ul>
    )
}
const Link = ({
    active,
    children,
    onClick
}) =>{
    if(active){
        return <span>{children}</span>;
    }
    return (
            <a href='#' onClick={(e)=>{
                e.preventDefault();
                onClick();
            }}>
            {children}
           </a>
       );
};
const Footer = ({store})=>{
    return (
        <p>Show:
           {' '}
           <FilterLink filter="SHOW_ALL" store={store}> ALL </FilterLink>
           {' '}
           <FilterLink filter="SHOW_ACTIVE" store={store}> Active </FilterLink>
           {' '}
           <FilterLink filter="SHOW_COMPLETED" store={store}> Completed </FilterLink>
        </p>
    )
}

const TodoApp = ()=>
(
    <div>
        <AddTodo/>
        <VisibleTodoList/>
        <Footer/>
    </div>
)


//==================== end representational compoenent ====================
//==================== container compoenent ====================
//State is store's state
const mapStateToTodoListProps = (state) =>{
    return {
        todos: getVisibleTodos(
            state.todos,
            state.visiblityFilter
        )
    };
};
const mapDispatchToTodoListProps = (dispatch) =>{
    return {
        onTodoClick: (id) =>{
            dispatch({
                type: 'TOGGLE_TODO',
                id
            })
        }
    };
};


const VisibleTodoList = connect(
    mapStateToTodoListProps,
    mapDispatchToTodoListProps
)(TodoList);
// class VisibleTodoList extends Component{
//     componentDidMount(){
//         const {store} = this.context;
//         this.unsubscribe = store.subscribe(()=>{
//             this.forceUpdate();
//         });
//     }
//     componentWillUnmount(){
//         this.unsubscribe();
//     }
//     render(){
//         const {store} = this.context;
//         const props = this.props;
//         const state = store.getState();
//
//         return (
//             <TodoList todos={
//                 getVisibleTodos(
//                     state.todos,
//                     state.visiblityFilter
//                 )
//             }
//             onTodoClick={ id=>
//                 store.dispatch({
//                     type: 'TOGGLE_TODO',
//                     id
//                 })
//             }/>
//         )
//     }
// }
//
// VisibleTodoList.contextTypes = {
//     store: React.PropTypes.object
// };

const mapStateToLinkProps = (state, ownProps) =>{
    return {
        active: ownProps.filter === state.visiblityFilter
    }
}
const mapDIspatchToLinkProps = (dispatch, ownProps) =>{
    return {
        onClick: ()=>{
            dispatch({
                type: 'SET_VISIBILITY_FILTER',
                filter: ownProps.filter
            })
        }
    }
}

const FilterLink = connect(mapStateToLinkProps, mapDIspatchToLinkProps)(Link);
// class FilterLink extends Component {
//     componentDidMount(){
//         const {store} = this.context;
//         this.unsubscribe = store.subscribe(()=>{
//             this.forceUpdate();
//         });
//     }
//     componentWillUnmount(){
//         this.unsubscribe();
//     }
//     render(){
//         const {store} = this.context;
//         const props = this.props;
//         const state = store.getState();
//         return (
//             <Link active={
//                 props.filter === state.visiblityFilter
//             }
//             onClick={()=>{
//                 store.dispatch({
//                     type: 'SET_VISIBILITY_FILTER',
//                     filter: props.filter
//                 })
//             }} > {props.children} </Link>
//         );
//     }
// }
// FilterLink.contextTypes = {
//     store: React.PropTypes.object
// };
//==================== end container compoenent ====================


// class Provider extends Component{
//     getChildContext(){
//         return {
//             store: this.props.store
//         };
//     }
//     render(){
//         return this.props.children;
//     }
// }
//
// Provider.childContextTypes = {
//     store: React.PropTypes.object
// }

const {Provider} = ReactRedux;
const {createStore} = Redux;
// const store = createStore(todoApp);


ReactDOM.render(
    <Provider store={createStore(todoApp)}>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);
