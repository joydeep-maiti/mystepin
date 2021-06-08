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
    inputs: {
        backgroundColor:"white"
    },
    loginDiv: {
        display: "flex",
        // alignItems: "center",
        // justifyContent: "center",
        // height: "85%",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        height: "100%",
        backgroundImage: "url('image.png')",
        backgroundPosition: "top",
        backgroundSize: "cover"
    },
    formDiv: {
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1rem", 
        margin: "5rem",
        backgroundColor: "rgba(255, 255, 255, 0.89)",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px"
    },
    back: {
        clipPath: "ellipse(40vw 60vh at 90% 50%)",
        height: "100%",
        width: "100%",
        position: "absolute",
        background: "aquamarine"
    }
}));


const Login = (props) => {

    const classes = useStyles();

    const [userData, setUserData] = React.useState({
        username: "admin",
        password: "admin"
    })

    const onFormSubmit = async (e) => {
        e.preventDefault();
        console.log("userData", userData)
        const res = await userService.login(userData)
        console.log("res", res)
        if (res) {
            props.onLoggedIn(res[0])
        }
    }

    const handleInput = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <React.Fragment>
            {/* <div className={classes.back}></div> */}
            <div className={classes.loginDiv}>
                <form className={`${classes.root} ${classes.formDiv}`} autoComplete="off" onSubmit={onFormSubmit}>
                    <Typography variant="h3" gutterBottom>
                        Login
                    </Typography>
                    <TextField id="outlined-basic" className={classes.inputs} label="Username" variant="outlined" name="username" onChange={handleInput} value={userData.username} />
                    <TextField id="outlined-basic" className={classes.inputs} type="password" label="Password" variant="outlined" name="password" onChange={handleInput} value={userData.password} />
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                     </Button>
                </form>
            </div>
        </React.Fragment>
    )
}

export default Login;