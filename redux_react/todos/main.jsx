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
const {createStore} = Redux;
const store = createStore(todoApp);

const { Component } = React;

let nextTodoId = 0;

const FilterLink = ({ filter, currentFilter, children}) =>{
    if(filter === currentFilter){
        return <span>{children}</span>;
    }
    return (
            <a href='#' onClick={(e)=>{
                e.preventDefault();
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter
                });
            }}>
            {children}
           </a>
       );
};

class TodoApp extends Component{
    render(){
        const {todos, visiblityFilter} = this.props;
        const visiblityTodos = getVisibleTodos(
            todos,
            visiblityFilter
        );
        return (
            <div>
                <input ref={node=>{
                    this.input = node;
                }} />
                <button onClick={()=>{
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: this.input.value,
                        id: nextTodoId++
                    });
                    this.input.value = '';
                }}>Add Todo</button>
                <ul>
                    {visiblityTodos.map(todo=>{
                        return(
                            <li key={todo.id} onClick={()=>{
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    id: todo.id
                                });
                            }}
                            style={{
                                textDecoration: todo.completed? 'line-through': 'none'
                            }}> {todo.text}</li>
                        );
                    })}
                </ul>
                <p>Show:
                   {' '}
                   <FilterLink
                        filter="SHOW_ALL"
                        currentFilter={visiblityFilter}
                   > ALL </FilterLink>
                   {' '}
                   <FilterLink
                        filter="SHOW_ACTIVE"
                        currentFilter={visiblityFilter}
                   > Active </FilterLink>
                   {' '}
                   <FilterLink
                        filter="SHOW_COMPLETED"
                        currentFilter={visiblityFilter}
                    > Completed </FilterLink>
                </p>
            </div>
        );
    };
};
const render = ()=>{
    ReactDOM.render(
        <TodoApp todos={store.getState().todos} visiblityFilter={store.getState().visiblityFilter}/>,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();
// console.log('initial state:');
// console.log(store.getState());
// console.log('--------------');
// console.log('dispatch ADD_TODO:');
// store.dispatch({
//     type: 'ADD_TODO',
//     id: 0,
//     text: 'Learn Redux'
// });
// console.log(store.getState());
// console.log('--------------');
// console.log('dispatch ADD_TODO:');
// store.dispatch({
//     type: 'ADD_TODO',
//     id: 1,
//     text: 'go shopping'
// });
// console.log(store.getState());
// console.log('--------------');
// console.log('dispatch TOGGLE_TODO:');
// store.dispatch({
//     type: 'TOGGLE_TODO',
//     id: 0
// });
// console.log(store.getState());
// console.log('--------------');
//
// const testAddTodo = () => {
//     const stateBefore = [];
//     const action = {
//         type: 'ADD_TODO',
//         id: 0,
//         text: 'Learn Redux'
//     };
//     const stateAfter = [
//         {
//             id: 0,
//             text: 'Learn Redux',
//             completed: false
//         }
//     ];
//     Object.freeze(stateBefore);
//     Object.freeze(action);
//     expect(todos(stateBefore, action)).toEqual(stateAfter);
// }
// const testToggleTodo = () =>{
//     const stateBefore = [
//         {
//             id: 0,
//             text: 'Learn Redux',
//             completed: false
//         },{
//             id: 1,
//             text: 'Go shopping',
//             completed: false
//         }
//     ];
//     const action = {
//         type: 'TOGGLE_TODO',
//         id: 1,
//     };
//
//     const stateAfter = [
//         {
//             id: 0,
//             text: 'Learn Redux',
//             completed: false
//         },{
//             id: 1,
//             text: 'Go shopping',
//             completed: true
//         }
//     ];
//     Object.freeze(stateBefore);
//     Object.freeze(action);
//     expect(todos(stateBefore, action)).toEqual(stateAfter);
//
// }
// testAddTodo();
// testToggleTodo();
// console.log('all test passed');
