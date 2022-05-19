import {TaskStateType} from "../AppWithRedux";
import {AddTodoListAT, RemoveTodoListAT, SetTodolistsAT} from "./todolists-reducer";
import {taskAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../api/todolist-api";
import {AppRootStateType, AppThunk} from "./store";

const REMOVE_TASK = "REMOVE_TASK"
const ADD_TASK = "ADD_TASK"
const CHANGE_TASK_STATUS = "CHANGE_TASK_STATUS"
const CHANGE_TASK_TITLE = "CHANGE_TASK_TITLE"

export type removeTaskAT = {
    type: 'REMOVE_TASK'
    taskId: string
    todolistId: string
}
export type addTaskAT = {
    type: 'ADD_TASK'
    task: TaskType
    todolistId: string
}
export type changeTaskStatusAT = {
    type: 'CHANGE_TASK_STATUS'
    taskId: string
    status: TaskStatuses
    todoListId: string
}
export type changeTaskTitleAT = {
    type: 'CHANGE_TASK_TITLE'
    taskId: string
    title: string
    todoListId: string
}
export type SetTasksAT = {
    type: "SET_TASKS"
    tasks: Array<TaskType> | []
    todolistId: string
}


export type ActionTypeTask = removeTaskAT
    | addTaskAT
    | changeTaskStatusAT
    | changeTaskTitleAT
    | AddTodoListAT
    | RemoveTodoListAT
    | SetTodolistsAT
    | SetTasksAT

const initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: ActionTypeTask): TaskStateType => {
    switch (action.type) {
        case REMOVE_TASK:
            return {...state, [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId )}
        case ADD_TASK:
            return {
                ...state, [action.todolistId]:  [action.task, ...state[action.todolistId]]
            }
        case CHANGE_TASK_STATUS:
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(task => task.id ===  action.taskId
                    ? {...task, status: action.status} : task)
            }
        case CHANGE_TASK_TITLE:
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(task => task.id === action.taskId
                    ? {...task, title: action.title} : task)
            }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case "REMOVE-TODOLIST": {
            const newState = {...state}
            delete newState[action.id]
            return newState
        }
        case "SET-TODOLISTS": {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = [];
            })
            return copyState
        }
        case "SET_TASKS": {
            return {
                ...state, [action.todolistId]: [...action.tasks]
            }
        }

        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): removeTaskAT => {
    return  { type: REMOVE_TASK, taskId, todolistId }
}

export const addTaskAC = (task: TaskType, todolistId: string): addTaskAT => {
    return  { type: ADD_TASK, task, todolistId }
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todoListId: string): changeTaskStatusAT => {
    return  { type: CHANGE_TASK_STATUS, taskId, status, todoListId }
}

export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string): changeTaskTitleAT => {
    return  { type: CHANGE_TASK_TITLE, taskId, title, todoListId }
}

export const SetTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksAT => {
    return {type: "SET_TASKS", tasks, todolistId}
}
export const fetchTasksTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        taskAPI.getTasks(todolistId)
            .then(res => {
                dispatch(SetTasksAC(res.data.items, todolistId))
            })
    }
}

export const deleteTaskTC = (taskId: string, todolistId: string): AppThunk => {
    return (dispatch) => {
        taskAPI.deleteTask(todolistId, taskId)
            .then(res => {
                dispatch(removeTaskAC(taskId, todolistId))
            })
    }
}

export const addTaskTC = (title: string, todolistId: string): AppThunk => {
    return (dispatch) => {
        taskAPI.createTask(todolistId, title)
            .then(res => {
                dispatch(addTaskAC(res.data.data.item, todolistId))
            })
    }
}
export const changeTaskTitleTC = (taskId: string, title: string, todoListId: string): AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {
        const state = getState();
        const task = state.tasks[todoListId].find(task => task.id === taskId)
        if (!task) return
        const model: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            startDate: task.startDate,
            priority: task.priority,
            status: task.status,
            title
        }
        taskAPI.updateTask(todoListId, taskId, model)
            .then(res => {
                dispatch(changeTaskTitleAC(taskId, title, todoListId))
            })
    }
}

export const changeTaskStatusTC = (taskId: string, status: TaskStatuses, todoListId: string): AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {
        const state = getState();
        const task = state.tasks[todoListId].find(task => task.id === taskId)
        if (!task) return
        const model: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            startDate: task.startDate,
            title: task.title,
            priority: task.priority,
            status
        }
        taskAPI.updateTask(todoListId, taskId, model)
            .then(res => {
                dispatch(changeTaskStatusAC(taskId, status, todoListId))
            })
    }
}




