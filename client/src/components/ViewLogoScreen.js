import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';


const RETRIEVE_LOGO = gql`
query logo($logoId: String) {
    logo(id: $logoId) {
        _id
        height
        width 
        userEmail
        backgroundColor
        borderColor
        borderWidth
        borderRadius
        padding
        margin
        lastUpdate
        texts{
            text
            color
            fontSize
            x
            y
        }
        images{
            src
            width
            height
            x
            y
        }
    }
}
`;
const DELETE_LOGO = gql`
  mutation removeLogo($id: String!) {
    removeLogo(id:$id) {
      _id
    }
  }
`;

class ViewLogoScreen extends Component {

    generateLogoDisplay(logo){

        //zindex organizes texts such that elements at beginning of text array will be positioned in front of elements that are placed later in array
        var texts =  logo.texts.map(function(text, index, array) { 
            
        //    text.height = `${text.height}px`;
         //   text.width = `${text.width}px`;
           // text.borderWidth = `${text.borderWidth}px`;
          //  text.borderRadius = `${text.borderRadius}px`;
           // text.padding = `${text.padding}px`;
           // text.margin = `${text.margin}px`;
          //  text.borderStyle = "solid";
         //   text.overflowY = "hidden";
         //   text.overflowX = "hidden";
           
         var styles = Object.create(text);
         styles.color = text.color;
         styles.fontSize = `${text.fontSize}px`;
         styles.wordWrap = "break-word";

      

         styles.cursor = "default";
         styles.zIndex = (array.length - index); 
         styles.transform = `translate(${text.x}px, ${text.y}px)`;
             return ( 
            <div key={"logo_text_component_" + index} className="logo_text_component" style={styles}>{text.text}</div> 
            )
    }, this );
    

    
    
        var images = logo.images.map(function(image, index, array)  {

    var imageStyles = Object.assign({}, image);
    imageStyles.height = `${image.height}px`;
    imageStyles.width = `${image.width}px`;
             return (
            <img src={image.src} key={"logo_image_component_" + index}  className="logo_image_component"  style={Object.assign({   transform: `translate(${image.x}px, ${image.y}px)`}, imageStyles)} onError={ function(e){ e.target.src = "https://wfpl.org/wp-content/plugins/lightbox/images/No-image-found.jpg";} } />
             )
        }, this)


        var logoStyles = Object.assign({}, logo);

        logoStyles.height = `${logo.height}px`
        logoStyles.width = `${logo.width}px`
        logoStyles.borderWidth = `${logo.borderWidth}px`
        logoStyles.borderRadius = `${logo.borderRadius}px`
        logoStyles.padding = `${logo.padding}px`
        logoStyles.margin = `${logo.margin}px`
        logoStyles.overflow = "hidden"

        var logo = (
            <div className="user_logo" style={logoStyles}>
                {texts}
                {images}
            </div>
        )

        return logo;

    }



    generateLogoMetaDisplay(logo){

        var logoUI = (
            <div className="row">

                </div>
        )

    }


    render() {
        return (
            <Query pollInterval={500} query={RETRIEVE_LOGO} variables={{ logoId: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    var texts = data.logo.texts;
                    var textComponentsUI = data.logo.texts.map(function(text, index){
                        return(
                        <dd>{text.text} - (Font Size: {text.fontSize}) (Color: {text.color}) (x: {text.x}) (y: {text.y})</dd>
                        )
                    }, this)


                    var imageComponentsUI = data.logo.images.map(function(image, index){
                        return(
                        <dd>{image.src} - (Height: {image.height}) (Width: {image.width}) (x: {image.x}) (y: {image.y})</dd>
                        )
                    }, this)


                    var finalImageUI = (
                        <div>
                            <dt>Images:</dt>
                            {imageComponentsUI}
                        </div>
                    )


                    var finalTextUI = (
                        <div>
                        <dt>Texts:</dt>
                        {textComponentsUI}
                        </div>
                    );


                    var finalLogoUI = (
                        <div>
                            <dt>Logo Metadata:</dt>
                    <dd>Height: {data.logo.height}px</dd>
                    <dd>Width: {data.logo.width}px</dd>
                    <dd>Background Color: {data.logo.backgroundColor}</dd>
                    <dd>Border Color: {data.logo.borderColor}</dd>
                    <dd>Border Radius: {data.logo.borderRadius}px</dd>
                    <dd>Padding: {data.logo.padding}px</dd>
                    <dd>Margin: {data.logo.margin}px</dd>
                        </div>
                    )


                    return (
                        <div className="container">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h4><Link to="/" className={"btn btn-secondary btn-block"}>Home</Link></h4>
                                    <h3 className="panel-title">
                                        View Logo
                                    </h3>
                                </div>
                                <div className="panel-body row">
                                    <div className="col-6">
                                        <dl>
                                            
                                            {finalTextUI}
                                            {finalLogoUI}
                                            {finalImageUI}



                                            <dt>Last Updated:</dt>
                                            <dd>{data.logo.lastUpdate}</dd>
                                        </dl>
                                        <Mutation mutation={DELETE_LOGO} key={data.logo._id} onCompleted={() => this.props.history.push('/')}>
                                        {(removeLogo, { loading, error }) => (
                                            <div>
                                                <form
                                                    onSubmit={e => {
                                                        e.preventDefault();
                                                        removeLogo({ variables: { id: data.logo._id } });
                                                    }}>
                                                    <Link to={`/edit/${data.logo._id}`} className="btn btn-success">Edit</Link>&nbsp;
                                                <button type="submit" className="btn btn-danger">Delete</button>
                                                </form>
                                                {loading && <p>Loading...</p>}
                                                {error && <p>Error :( Please try again</p>}
                                            </div>
                                        )}
                                    </Mutation>
                                    </div>
                                    <div className="col-6">
                   {this.generateLogoDisplay(data.logo)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default ViewLogoScreen;