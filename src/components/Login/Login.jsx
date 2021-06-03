import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import userService from '../../services/userService'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '23rem',
        },
    },
    loginDiv: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "85%"
    },
    formDiv: {
        display: "flex",
        flexDirection: "column"

    }
}));


const Login = (props) => {
    
    const classes = useStyles();

    const [userData, setUserData] = React.useState({
        username: "guest",
        password: "guest"
    })

    const onFormSubmit = async(e)=>{
        e.preventDefault();   
        console.log("userData",userData)
        const res = await userService.login(userData)
        console.log("res",res)
        if(res){
            props.onLoggedIn(res[0])
        }
    }

    const handleInput = (e)=>{
        setUserData({
            ...userData,
            [e.target.name]:e.target.value
        })
    }

    return (
        <div className={classes.loginDiv}>
            <form className={`${classes.root} ${classes.formDiv}`} autoComplete="off" onSubmit={onFormSubmit}>
                <Typography variant="h3" gutterBottom>
                    Login
                </Typography>
                <TextField id="outlined-basic" label="Username" variant="outlined" name="username" onChange={handleInput} value={userData.username}/>
                <TextField id="outlined-basic" type="password" label="Password" variant="outlined" name="password" onChange={handleInput} value={userData.password}/>
                <Button variant="outlined" color="primary" type="submit">
                    Submit
                </Button>
            </form>
        </div>
    )
}

export default Login;