import React, { Component } from 'react'
import './styleuser.css';
import axios from "axios";

class ListUserPhoto extends Component {
   constructor(props) {
      super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
      this.state = { //state is by default an object
         students: [
         ],
         data: [
            { id: 1, name: 'Wasif', image:12}
         ]
      }
   }
   componentDidMount() {
    axios
    .post("/api/users/list",)
    .then(res => {
     this.setState({students:res.data})
     
    })
    .catch(err =>
      {console.log(err,'file')}
    );
  }
   renderTableData() {
    return this.state.students.map((student, index) => {
       const url ='https://res.cloudinary.com/dxthmh1wc/image/upload/v1588327733/'
       const { _id, name, image } = student //destructuring
       return (
          <tr key={_id}>
             <td>{_id}</td>
             <td>{name}</td>
             <td><img src={url+image} alt="" width="200px" height="200px"></img></td>
          </tr>
       )
    })
 }
 renderTableHeader() {
    console.log(this.state.students,'this.state.students')
    let header = Object.keys(this.state.data[0])
    return header.map((key, index) => {
       return <th key={index}>{key.toUpperCase()}</th>
    })
 }
   render() { //Whenever our class runs, render method will be called automatically, it may have already defined in the constructor behind the scene.
      return (
        <div>
        <h1 id='title'>React Dynamic Table</h1>
        <table id='students'>
           <tbody>
           <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData()}
           </tbody>
        </table>
     </div>
      )
   }
}

export default ListUserPhoto