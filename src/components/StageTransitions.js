import 'date-fns';
import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Modal, Button } from '@material-ui/core';

import CancelIcon from '@material-ui/icons/Cancel';

import { connect } from 'react-redux';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { theme } from '../theme/theme';
import { changeFetching } from '../store/actions/auth';
import { withRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';

import DetailsIcon from '@material-ui/icons/Details';
import MainLayout from './MainLayout';
// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

function getModalStyle() {
  const top = 50 // + rand()
  const left = 50 //+ rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflowY: 'scroll',
    maxHeight: '90vh',
    width: "90%"
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    marginLeft: '3vw',
    marginRight: '3vw',
    width: '94vw',
    [theme.breakpoints.up('md')]: {
      margin: 'auto',
      width: '50%'
    },
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        minHeight: '22px'
      }
    }
  }
})

export class Transition extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      modalOpen: false,
    }
  }

  transitionsChangeEvent = () => {
    this.fetchTransition();
  }

  async fetchTransition() {
    try {
      this.transitionURL = `${baseURL}students/transitionsWithFeedback/${this.props.studentId}`;
      this.props.fetchingStart()
      const response = await axios.get(this.transitionURL, {});
      const newData = response.data.data.map(v => ({ ...v, loggedInUser: this.props.loggedInUser }))
      this.setState({
        data: newData
      }, this.props.fetchingFinish)
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  };

  handleOpen = () => {
    this.fetchTransition();
    this.setState({
      modalOpen: true
    })
  };


  render = () => {
    const { classes, studentName,  dataType } = this.props;
    const modalStyle = getModalStyle()
    return !this.state.modalOpen ? <div>
      <Button color="primary" align="right" onClick={this.handleOpen}>
        <DetailsIcon color="primary" />&nbsp;&nbsp;
    </Button>
    </div> :
      <Modal
        open={this.state.modalOpen}
        onClose={this.handleClose}
      >
        <Box style={modalStyle} className={classes.paper}>
          <MuiThemeProvider theme={theme}>
            <Box display="flex" justifyContent="space-between" pt={4}>
              <Typography variant="h6" id="modal-title">Student Name:- {studentName}</Typography><br />
              <Box onClick={this.handleClose}>
                <CancelIcon />
              </Box>
            </Box>
            <MainLayout 
              data={this.state.data}
              dataType={dataType}
            />
          </MuiThemeProvider>
        </Box>
      </Modal>
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
});

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Transition)))