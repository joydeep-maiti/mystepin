import React from "react";

import { DialogTitle, DialogContent } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import moment from "moment";
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

const AdvancedList = () => {

  return (
    <DialogContent>
       <div>{"Advanced"}</div>
      <TableContainer component={Paper} style={{marginTop:"0.7rem"}}>
        <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Advanced</TableCell>
                  <TableCell align="center">Reference Number</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    <TableRow>
                      <TableCell align="center">{moment().format("Do MMMM YYYY")}</TableCell>
                      <TableCell align="center">{"1000"}</TableCell>
                      <TableCell align="center">{"1000"}</TableCell>
                      <TableCell align="center">{"1000"}</TableCell>
                    </TableRow>
              </TableBody>
        </Table>
      </TableContainer>
      
    </DialogContent>
  );
};

export default AdvancedList;
