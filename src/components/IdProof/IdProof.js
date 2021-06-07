import React from 'react'
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import bookingService from '../../services/bookingService'
import Loader from "../../common/Loader/Loader";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '23rem',
        },
    },
    divi:{
        display:"flex",
        justifyContent: "center",
        alignItems: "center",
        height: "inherit"
    }
}));


const IdProof = (props) => {

    const classes = useStyles();

    const [data, setData] = React.useState("")
    const [loading, setLoading] = React.useState(false);

    React.useEffect(()=>{
        console.log("IdProofprops",props)
        if(props.location.state){
            fetchId(props.location.state)
        }
    },[])

    const fetchId = async(id)=>{
        setLoading(true)
        const res = await bookingService.getProofId(id)
        setLoading(false)
        console.log("IdProofprops",res)
        if(res.status===200 && res.data.idProofImage){
            setData(res.data.idProofImage)
        }
    }

    return (
        <React.Fragment>
            {loading && <Loader color="#0088bc" />}
            {data && <div className={classes.divi}><img src={data} style={{height:"60vh"}}/></div>}
            {!data && !loading && <div className={classes.divi}>NO IDPROOF FOUND</div>}
        </React.Fragment>
    )
}

export default withRouter(IdProof);