import React, { Component } from 'react';
import { Webcam } from '../../webcam';
import './ClCamera.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
class ClCamera extends Component {
    constructor() {
        super();
        this.webcam = null;
        this.state = {
            capturedImage: null,
            captured: false,
            uploading: false
        }
    }
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };
    componentDidMount() {
        // initialize the camera
        this.canvasElement = document.createElement('canvas');
        this.webcam = new Webcam(
            document.getElementById('webcam'),
            this.canvasElement
        );
        this.webcam.setup().catch(() => {
            alert('Error getting access to your camera');
        });
        this.interval = setInterval(() =>
            this.setState({ time: Date.now() }, this.captureImage), 30000);
    }
    
    componentDidUpdate(prevProps) {
        if (!this.props.offline && (prevProps.offline === true)) {
            // if its online,
            this.batchUploads();
        }
    }

    render() {
        const imageDisplay = this.state.capturedImage ?
            <img src={this.state.capturedImage} alt="captured" width="350" />
            :
            <span />;

        const buttons = <div>
           
            <Link
                to="/capture"

                className="captureButton"
            >
                photos
      </Link>&nbsp;&nbsp;&nbsp;
    <button className="captureButton" onClick={this.onLogoutClick} >Logout </button>
        </div>
        return (
            <div>

                <video autoPlay playsInline muted id="webcam" width="100%" height="200" />
                <br />
                <div className="imageCanvas">
                    {/* {imageDisplay} */}
                </div>
                {buttons}
            </div>
        )
    }

    captureImage = async () => {
        const capturedData = this.webcam.takeBase64Photo({ type: 'jpeg', quality: 0.8 });
        this.setState({
            captured: true,
            capturedImage: capturedData.base64
        });
        var userID = this.props.auth.user.id
        axios
        .post("/api/users/file", {file:this.state.capturedImage,userId:userID})
        .then(res => {
         console.log(res,'res')
         this.setState({
            captured: false,
            capturedImage: null
        })
        })
        .catch(err =>
          {console.log(err,'file')}
        );
    }

    discardImage = () => {
        this.setState({
            captured: false,
            capturedImage: null
        })
    }

  

    findLocalItems = (query) => {
        var i, results = [];
        for (i in localStorage) {
            if (localStorage.hasOwnProperty(i)) {
                if (i.match(query) || (!query && typeof i === 'string')) {
                    const value = localStorage.getItem(i);
                    results.push({ key: i, val: value });
                }
            }
        }
        return results;
    }

    checkUploadStatus = (data) => {
        this.setState({ 'uploading': false });
        if (data.status === 200) {
            alert('Image Uploaded to Cloudinary Media Library');
            this.discardImage();
        } else {
            alert('Sorry, we encountered an error uploading your image');
        }
    }
    batchUploads = () => {
        // this is where all the images saved can be uploaded as batch uploads
        const images = this.findLocalItems(/^cloudy_pwa_/);
        let error = false;
        if (images.length > 0) {
            this.setState({ 'uploading': true });
            for (let i = 0; i < images.length; i++) {
                // upload
                axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
                    {
                        file: images[i].val,
                        upload_preset: process.env.REACT_APP_CLOUD_PRESET
                    }
                ).then((data) => this.checkUploadStatus(data)).catch((error) => {
                    error = true;
                })
            }
            this.setState({ 'uploading': false });
            if (!error) {
                alert("All saved images have been uploaded to your Cloudinary Media Library");
            }
        }
    }
}
ClCamera.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(ClCamera);