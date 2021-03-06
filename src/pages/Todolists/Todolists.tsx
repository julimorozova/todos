import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import React, {useCallback, useEffect} from "react";
import Paper from "@material-ui/core/Paper";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {addTodolistTC, fetchTodolistsTC, TodolistDomainType} from "../../state/todolists-reducer";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "../../components/TodoList/TodoList";
import {Navigate} from "react-router-dom";

export const Todolists = () => {
    const todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state=> state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect( () => {
        if (!isLoggedIn) {
            return
        }
        dispatch(fetchTodolistsTC())
    }, [dispatch, isLoggedIn])

    const addTodoList = useCallback((title: string) => {
        const thunk = addTodolistTC(title)
        dispatch(thunk)
    }, [dispatch])

    const todoListsComponents = todoLists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={3}>
                    <TodoList todoListId={tl.id}/>
                </Paper>
            </Grid>
        )
    })

    if(!isLoggedIn) {
        return  <Navigate to={'/todos/login'}/>
    }
    return (
        <Container fixed>
            <Grid container style={{padding: "25px 0"}}>
                <AddItemForm
                    addItem={addTodoList}
                    label={"Create a new todo"}
                />
            </Grid>
            <Grid container spacing={4}>
                {todoListsComponents}
            </Grid>
        </Container>
    )
}
