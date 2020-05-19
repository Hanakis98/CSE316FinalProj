import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom';

import {clamp} from "../utils/utlity"

import Logo from "./Logo"

// REQUIRED PROPS:   Logo / History
class LogoEditor extends Component { 

    constructor(props){
        super(props)

        if(!props.logo) throw new Error("Cannot init LogoEditor without a valid logo property");

        if (!(props.logo instanceof Logo))
            throw new Error("LogoEditor logo property must be a Logo instance (see /EditorUI/Logo.js)");

        
        this.state = {
         //   userEmail:  props.session.getUserEmail(),
            logo: props.logo
        }
    }


    addText(){
        this.state.logo.addText();
       // console.log(this.state.logo.fetchData());
        this.setState({});
    }

    deleteText(index){
        this.state.logo.deleteText(index)
        this.setState({});
    }


    addImage(){
        this.state.logo.addImage();
        this.setState({});
    }

    deleteImage(index){
        this.state.logo.deleteImage(index)
        this.setState({});
    }



    //for logo text attributes
    //  if enforce number Rule == true , input element displayed value will be == value arg (which has already been clamped)
    updateLogoText(index, attribute, value, enforceNumberRule, element){
        this.state.logo.texts[index][attribute] = value;

        this.setState({});

        //makes sure that letters dont go in number spaces , or that numbers greater than permitted dont get entered in fields
        if(enforceNumberRule) {
            element.target.value = value;
        }
    }



    //for logo image attributes
    updateLogoImage(index, attribute, value, enforceNumberRule, element){
        this.state.logo.images[index][attribute] = value;
        this.setState({});

         //makes sure that letters dont go in number spaces , or that numbers greater than permitted dont get entered in fields
         if(enforceNumberRule) {
            element.target.value = value;
        }

    }


    // for logo attributes (border, margin, padding etc)
    updateLogo(attribute, value, enforceNumberRule, element){
        this.state.logo[attribute] = value;
        this.setState({});

         //makes sure that letters dont go in number spaces , or that numbers greater than permitted dont get entered in fields
         if(enforceNumberRule) {
            element.target.value = value;
        }
    }



    generateTextUI(){
      var textControls =  this.state.logo.texts.map( (text, index) =>
(
                <div className="logo_text_controller" key={`logotext-${index}`} style={{background: "#FFBBAA", padding: "10px", border: "1px solid #000", margin: "10px 0"}} >
                        <h4>Logo Text #{index}</h4>
                        <div className="form-group col-8">
                        <label htmlFor="text">Text:</label>
                        <input type="text" defaultValue={text.text}  onInput={e => this.updateLogoText(index, "text", e.target.value)} data-text_ref={index}  className="form-control" name="text"  placeholder="Text" />
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="color">Color:</label>
                        <input type="color" data-text_ref={index} defaultValue={text.color} onInput={e => this.updateLogoText(index, "color", e.target.value)} className="form-control" name="color"  placeholder="Color" />
                    </div>
                    <div className="form-group col-8">
                                        <label htmlFor="fontSize">Font Size:</label>
                                        <input type="number" min={5} max={70} data-text_ref={index} defaultValue={this.state.logo.texts[index].fontSize} onInput={ e => this.updateLogoText(index, "fontSize", clamp(e.target.value, 5, 70), true, e)}  className="form-control" name="fontSize" placeholder="Font Size" />
                        </div>
            </div>
        ));

 
 return (<div className="textUI">{textControls}</div>)

    }



    generateLogoDisplay(){

        var texts =  this.state.logo.texts.map(text => ( 
        <div className="logo_text_component" style={text.fetchData(true)}>{text.text}</div> )
        )

        var logo = (
            <div className="user_logo" style={this.state.logo.fetchData(true)}>
                {texts}
            </div>
        )

        return logo;

    }



    // for when submit button is clicked 
    // save to db (as new logo, or update existing one )
    saveLogo(){
alert("please implement this function");
    }


    render() {
        let  backgroundColor, borderColor, borderWidth, borderRadius, padding, margin;
        let userEmail = this.state.userEmail;

        console.log(this.state.logo.texts);

        var textUI =  this.generateTextUI(); 
        var logoDisplay = this.generateLogoDisplay();
 
 
 
        return (
           
                    <div className="container">
                        <div className="panel panel-default">
    
                            <div className="panel-body row">
                                <form className="col-6" style={{height:"500px", background: "rgba(71, 37, 32, 0.51)", overflowY: "scroll"}}>
                                  
                                    <div className="form-group col-4">
                                        <label htmlFor="backgroundColor">Background Color:</label>
                                        <input type="color" className="form-control" name="backgroundColor"   placeholder="Background Color" defaultValue={this.state.logo.backgroundColor} onInput={e => this.updateLogo("backgroundColor", e.target.value)} />
                                    </div>
                                    <div className="form-group col-4">
                                        <label htmlFor="borderColor">Border Color:</label>
                                        <input type="color" className="form-control" name="borderColor"  placeholder="Border Color" defaultValue={this.state.logo.borderColor}  onInput={e => this.updateLogo("borderColor", e.target.value)}  />
                                    </div>


                                    <div className="form-group col-8">
                                        <label htmlFor="height">Height:</label>
                                        <input type="number"  max={700} min={100}  placeholder="Height"  defaultValue={this.state.logo.height} onInput={e => this.updateLogo("height", clamp(e.target.value, 100, 700), true, e)}  />
                                            </div>



                                        <div className="form-group col-8">
                                        <label htmlFor="width">Width:</label>
                                        <input type="number"  max={650} min={100}  placeholder="Width"  defaultValue={this.state.logo.width} onInput={e => this.updateLogo("width", clamp(e.target.value, 100, 650), true, e)}  />
                                        </div>



                                    <div className="form-group col-8">
                                        <label htmlFor="borderWidth">Border Width:</label>
                                        <input type="number"  max={8} min={0}  placeholder="Border Width"  defaultValue={this.state.logo.borderWidth} onInput={e => this.updateLogo("borderWidth", clamp(e.target.value, 0, 8), true, e)}  />
                                    </div>
                                    <div className="form-group col-8">
                                        <label htmlFor="borderRadius">Border Radius:</label>
                                        <input type="number" max={20} min={0} className="form-control" name="borderRadius" defaultValue={ this.state.logo.borderRadius}  placeholder="Border Radius" onInput={e => this.updateLogo("borderRadius", clamp(e.target.value, 0, 20), true, e)} />
                                    </div>
                                    <div className="form-group col-8">
                                        <label htmlFor="padding">Padding:</label>
                                        <input type="number" max={200} min={0} className="form-control" name="padding" defaultValue={ this.state.logo.padding }  placeholder="Padding" onInput={e => this.updateLogo("padding", clamp(e.target.value, 0, 200), true, e)}/>
                                    </div>
                                    <div className="form-group col-8">
                                        <label htmlFor="margin">Margin:</label>
                                        <input type="number" max={50} min={0} className="form-control" name="margin"  defaultValue={ this.state.logo.margin} placeholder="Margin" onInput={e => this.updateLogo("margin", clamp(e.target.value, 0, 50), true, e)} />
                                    </div>


                                {textUI}


                                    <div className="form-group col-8">
                                        <div className="btn btn-primary" onClick={ e => this.addText()}>Add Text</div>
                                    </div>

                                    <div className="form-group col-8">
                                        <div className="btn btn-primary" onClick={e => this.addImage()}>Add Image</div>
                                    </div>

                                    <button type="submit" className="btn btn-success">Submit</button>
                                </form>
                                <div className="col-6">

                                    <div className="logo_container">

                                    {logoDisplay}

                                    </div>
                                  
  



                                </div>
  

                            </div>
                        </div>
                    </div>
                )}
           
       
    }


export default LogoEditor;


