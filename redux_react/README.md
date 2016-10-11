redux note:

state is read only.

change state? dispatch an action


reducer: (currentState, action) => nextState


Store:
    include createStore in 3 different ways:
    
    1. const {createStore} = Redux; //es6
    2. var createStore = Redux.createStore; //js
    3. import {createStore} from Redux // babel

    create a store:
        const store = createStore(counter); // has to specify a reducer. In the simple_counter example, it is counter.

    3 methods in store:
        1. getState()   //get current state
        2. subscribe(callback)  // callback function is called if store.dispatch is triggered
        3. dispatch(action)// dispatch a action

    How to implement createStore:
        const createStore = (reducer) =>{
            let state;
            let listeners = [];
            const getState()=> state;
            const dispatch = (action)=>{
                state = reducer(state, action);
                listeners.forEach(listener => listener());
            }
            const subscribe(listener) =>{
                listeners.push(listener);
                return ()=>{
                    listeners = listeners.filter(l=> l !== listener); // destroy current listener
                }
            }

            dispatch(); //reducer will return initial value
            return{
                getState,
                dispatch,
                subscribe
            }
        }

combineReducers:
    How to implement:

    const combineReducers = (reducers) =>{
        return (state = {}, action) =>{
            return Object.keys(reducers).reduce((nextState, key)=>{   // the nextState is {} at the begining
                nextState[key] = reducers[key](state[key], action);
                return nextState;
            }, {});
        };
    };

    why?
    we have to create a root reducers. CombineReducers can do combine reducers automatically.
        without combineReducers:
            const todoApp = (state = {}, action) =>{
                return {
                    todos: todos(state.todos, action),
                    visiblityFilter: visiblityFilter(
                        state.visiblityFilter,
                        action
                    )
                };
            };
        with combineReducers:
            const todoApp = combineReducers({
                todos,
                visiblityFilter
            });


JSX way to create component:

    componentName = (obj) =>{ //obj is this.props
        return(
            <h1>hi</h1>
        )
    }

    e.g.:
    const FilterLink = ({ filter, currentFilter, children}) =>{
        console.log(filter);
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


Provider:
    Redux store is passed down the tree. Reducer can create once and make the store available on every react component

    *** whenever we use the store in the component, we have to specify context type
        FilterLink.contextTypes = {
            store: React.PropTypes.object
        };

    1. without using react-redux
        e.g.:
            class Provider extends Component{
                getChildContext(){
                    return {
                        store: this.props.store
                    };
                }
                render(){
                    return this.props.children;  //this.props.children is <TodoApp />
                }
            }

            Provider.childContextTypes = {       // this is required to specify
                store: React.PropTypes.object
            }
    2. using react-redux:
        e.g.: const {Provider} = ReactRedux;

        
        ReactDOM.render(
            <Provider store={createStore(todoApp)}>
                <TodoApp />
            </Provider>,
            document.getElementById('root')
        );
Problems:
    1. pass too many props to intermedia component. For example, filterLink needs visiblityFilter. it need to pass the pros to the tree (TodoApp -> Footer -> FilterLink)
    
    solve: 
    create a container component(FilterLink become Link and create a new container component FilterLink) and get data from store.
    
    small problem: The parent component doesn't update but the store updated. we need to force to update the component.
    There is no such problem for the current app because every re-render the whole app when the store is changed.
