import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  panelHeader: {
    backgroundColor: "#bdbdbd"
  },
  panel: {
    width: "100%",
    margin: "2% auto 3% auto"
  },
  button: {
    textAlign: "right"
  },
  buttonSec: {
    marginRight: 20
  },
  expansionPanelDetails: {
    display: "block"
  },
  expansionPanelSummary: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  panelLabel: {
    flexGrow: 1
  },
  deleteButton: {
    marginTop: 20
  },
  formHeader: {
    flexGrow: 1
  },
  formTitle: {
    flexGrow: 1
  },
  datePicker: {
    width: "100%",
    marginRight: 8,
    marginLeft: 8
  },
  uploadButton: {
    margin: theme.spacing(1),
  },
  pricebreaktable: {
    minWidth:"100%",
    width:"max-content",
    textAlign:"center",
    border:"1px solid cadetblue"
  },
  pricebreaktableTr : {
    background:"aliceblue"
  },
  pricebreaktableTh: {
    padding:"5px",
    fontSize:"15px",
    fontWeight: 400
  },
  pricebreaktableTd: {
    fontSize:"14px",
    fontWeight: 300
  }
}));
