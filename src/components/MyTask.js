// Todo
// Logic of RQC Columns

import 'date-fns';
import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { changeFetching, setupUsers } from '../store/actions/auth';
import StudentService from '../services/StudentService';
import MainLayout from './MainLayout';


// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

export class MyTaskReport extends React.Component {

  constructor(props) {

    super(props);    
    this.state = {
      data: [],
    }
  }

  dataSetup = (data) => {
    for (let i = 0; i < data.length; i++) {
      data[i] = StudentService.dConvert(data[i])
    }
    const newData = data.map(v => ({ ...v, loggedInUser: this.props.loggedInUser.email.split('@')[0] }))
    this.setState({ 'data': newData }, function () {
      this.props.fetchingFinish()
    });
  }

  render = () => {
    return(
      <MainLayout
        data={this.state.data}
        dataType={'softwareCourse'} 
      />
    )
  }

  componentDidMount() {
    this.fetchOwnerReport();
    this.fetchUsers();
  }

  async fetchUsers() {
    try {
      this.props.fetchingStart()
      this.usersURL = baseURL + 'users/getall';
      const response = await axios.get(this.usersURL, {});
      this.props.usersSetup(response.data.data);
      this.props.fetchingFinish()
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  }

  async fetchOwnerReport() {
    try {
      this.props.fetchingStart()
      this.onwerDetailsURL = baseURL + 'students/my_tasks'
      // response = ngFetch(this.studentsURL, 'GET', {
      //   params: {
      //     dataType: this.dataType,
      //     fromDate: this.fromDate,
      //     toDate: this.toDate
      //   }
      // }, true);
      const user = this.props.loggedInUser.email.split('@')[0];
      const response = await axios.get(this.onwerDetailsURL, {
        params: {
          user: user
        }
      });
      this.dataSetup(response.data.data)
      this.props.fetchingFinish();
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  }
}

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false)),
  usersSetup: (users) => dispatch(setupUsers(users))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyTaskReport);
