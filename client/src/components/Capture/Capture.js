import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import ListUserPhoto from "../ListUserPhoto/index"
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

  render() {
    const { user } = this.props.auth;
    return (
      <div className="container row" id="hello">
        <ListUserPhoto/>
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
