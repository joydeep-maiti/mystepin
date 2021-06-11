import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import userService from '../../services/userService'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '15rem',
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

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = (props) => {

    const classes = useStyles();

    const [userData, setUserData] = React.useState({
        username: "admin",
        password: "admin"
    })
    const [openSnack, setOpenSnack] = React.useState({
        open:false,
        msg: ""
    })

    const onFormSubmit = async (e) => {
        e.preventDefault();
        console.log("userData", userData)
        const res = await userService.login(userData)
        console.log("res", res)
        if (res && res.status === 200) {
            props.onLoggedIn(res.data[0])
        }else if(res && res.status===401){
            setOpenSnack({
                open:true,
                msg:res.data.msg
            })
        }else {
            setOpenSnack({
                open:true,
                msg:"Something went wrong"
            })
        }
    }

    const handleInput = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleClose = (e) => {
        setOpenSnack({
            open:false,
            msg:""
        })
    }

    return (
        <React.Fragment>
            {/* <div className={classes.back}></div> */}
            <Snackbar open={openSnack.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={handleClose} severity="error">
                    {openSnack.msg}
                </Alert>
            </Snackbar>
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