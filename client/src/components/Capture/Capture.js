import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";
import { Link } from "react-router-dom";
import html2canvas from 'html2canvas'

class Capture extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          password: "",
          errors: {}
        };
      }
    
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  componentDidMount() {
    this.interval = setInterval(() =>
     this.setState({ time: Date.now() },this.test), 3000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  test = () => {
      var userID=this.props.auth.user.id
    html2canvas(document.querySelector("#hello"))
         .then(function (canvas) {
            // document.body.appendChild(canvas);
            var base64URL =  canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
            // var { user } = this.props.auth;
         //localhost:5000/api/users/file
         axios
         .post("/api/users/file", {file:base64URL,userId:userID})
         .then(res => {
          console.log(res,'res')
          
         })
         .catch(err =>
           {console.log(err,'file')}
         );
  })
}
  render() {
    const { user } = this.props.auth;
console.log(user,'user')
    return (
      <div className="container row" id="hello">
        <h1>Capture List</h1>
      </div>
    );
  }
}

Capture.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  // captureFile:PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Capture);
