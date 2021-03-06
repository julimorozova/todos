import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import {Menu} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {logoutTC} from "../../state/auth-reducer";

export const Header = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()
    const logoutHandler = () => {
        dispatch(logoutTC())
    }
    return (
        <AppBar position="static">
            <Toolbar style={{justifyContent: "space-between"}}>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <Menu/>
                </IconButton>
                <Typography variant="h6">
                    TodoLists
                </Typography>
                {isLoggedIn
                    ? <Button color="inherit" variant={"outlined"} onClick={logoutHandler}>Logout</Button>
                    : <Button color="inherit" variant={"outlined"}>Login</Button>
                }
            </Toolbar>
        </AppBar>
    )
}
