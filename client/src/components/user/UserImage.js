import React, { Component } from 'react';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';

class UserImage extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedFile: null,
            alert: null,
            userProfileImage: ""
        }
    }

    componentDidMount = () => {
        axios.get('/api/users/userdetails/'+this.props.id)
            .then(res => {
                this.setState({
                    userProfileImage: "http://localhost:5000" + res.data.userImage.slice(7)
                })
            })
    }
    fileSelectedHandler = (e) => {
        this.setState({
            selectedFile: e.target.files[0]
        });
        
        const getAlert = () => (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes"
                confirmBtnBsStyle="default"
                cancelBtnBsStyle="default"
                title="Are you sure"
                onConfirm={this.fileUploadHandler}
                onCancel={this.onCancelDelete}
            >
                <h6>you want to upload this profile picture?</h6>
        </SweetAlert>
        );
        this.setState({
            alert: getAlert()
        });

    }

    onCancelDelete = () =>{
        this.setState({
            alert: null,
            selectedFile: null
        })
    }

    fileUploadHandler = () => {
        const fd = new FormData();
        fd.append('userImage',this.state.selectedFile,this.state.selectedFile.name);
        fd.append('id', this.props.id);
        axios.put('/api/users/images', fd)
            .then(res => {
                this.setState({
                    userProfileImage: "http://localhost:5000" + res.data.userImage.slice(7)
                })
            })
            .catch(err => console.log("clicked",err.response));
        this.setState({alert:null});
        window.location.reload(false);
    }

    render() {
        return (
            <div class="card">
                <div class="card-image">
                    <img src={this.state.userProfileImage} style={{ height: "25vh" }} />
                    <label
                        for="file-upload"
                        class="btn-floating halfway-fab waves-effect waves-light red"
                        style={{ right: "0px" }}>
                        <i class="material-icons">add</i>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        style={{ display: "none" }}
                        onChange={this.fileSelectedHandler}
                    />{this.state.alert}
                </div>
            </div>
        )
    }
}

export default UserImage;
