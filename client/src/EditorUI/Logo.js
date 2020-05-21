import Session from "../Session/Session"

class Logo{


   // USE THIS WHEN PERFORMING GRAPHQL QUERIES 
   serializeForGQL(){

    return {
        userEmail:  this.userEmail,
        height: this.height, 
        width:  this.width,
        backgroundColor: this.backgroundColor,
        borderColor: this.borderColor,
        borderWidth:  this.borderWidth,
        borderRadius:  this.borderRadius,
        padding:  this.padding,
        margin:  this.margin,
        texts:this.texts.map(function(t){return t.serializeForGQL()}),
        images:  this.images.map(function(i){return i.serializeForGQL()}),
    }
}



addText(){
    this.texts = this.texts.concat(new Text());
}

deleteText(index){
    if(index < 0 || index > (this.texts.length - 1)) throw new Error("Invalid index to delete text");
    this.texts.splice(index, 1);
}




addImage(){
    this.images = this.images.concat(new LogoImage());
}


deleteImage(index){
    if(index < 0 || index > (this.images.length - 1)) throw new Error("Invalid index to delete image");
    this.images.splice(index, 1);
}




//returns object containing 
// if forCss, only include attributes for css styling and format accordingly
fetchData(forCss){

    return {
        userEmail: forCss ? false : this.userEmail,
        height: forCss ? `${this.height}px` : this.height, 
        width: forCss ? `${this.width}px` : this.width,
        backgroundColor: this.backgroundColor,
        borderColor: this.borderColor,
        borderWidth: forCss ? `${this.borderWidth}px` : this.borderWidth,
        borderRadius: forCss ? `${this.borderRadius}px` : this.borderRadius,
        padding: forCss ? `${this.padding}px` : this.padding,
        margin: forCss ?  `${this.margin}px` : this.margin,
        texts: forCss ? false : this.texts.map(function(t){return t.fetchData()}),
        images: forCss ? false : this.images.map(function(i){return i.fetchData()}),
        borderStyle: forCss ? "solid" : false, //only display for CSS purposes , NEVER for DB Storage
        overflowY: forCss ? "hidden" : false,
        overflowX: forCss ? "hidden" : false 
    }


  

}



getId(){
    return this.id;
}

    constructor(props){

        var defaultProps = {}
        if(!props) props = defaultProps;


        // DO NOT SERIALIZE THIS . IF YOU HAVE A NEED TO USE ID, retrieve it USING Logo.getId()
        if(props._id)   
        this.id = props._id || false;

        this.texts = []
        this.images = [];

       
        this.userEmail = Session.getUserEmail();
        this.backgroundColor = props.backgroundColor || "#FFFFFF";
        this.borderColor = props.borderColor || "#000000";
        this.borderWidth = props.borderWidth || 1;
        this.borderRadius = props.borderRadius || 10;
        this.height = props.height || 500; 
        this.width = props.width || 500; // MAX WIDTH SHOULD BE 500
        this.padding = props.padding || 0;
        this.margin = props.margin || 0;

        if(!props.texts){
            props.texts =  this.texts = [];
        }

        if(!props.images){
           props.images = this.images = [];
        }
        if(!Array.isArray(props.texts) || !Array.isArray(props.images))
            throw new Error("Texts and Images attributes must be Array type");

 
  

            for(let text of props.texts)
                this.texts =  this.texts.concat(new Text(text))

            for(let image of props.images)
                this.images = this.images.concat(new LogoImage(image))


    }




}




class Text{


    serializeForGQL(){
        return {
            text:  this.text,
            color:  this.color,
            fontSize: this.fontSize,
            x: this.x,
            y:  this.y,
        }
    }

    fetchData(forCss){
        return {
            text: forCss ? false : this.text,
            color:  this.color,
            fontSize: forCss ? `${this.fontSize}px` : this.fontSize,
            x: forCss ? false : this.x,
            y: forCss ? false : this.y,
            wordWrap: forCss ? 'break-word' : false
        }
    }

    constructor(props){

        if(!props) props = {};

        console.log(props);

        if(props && typeof props != "object")
            throw new Error("Text class requires an object to be instantiated");

        this.reactKey = String(new Date()); // to be used in React Components to represent this text entry
        this.text = props.text || "";
        this.color = props.color || "#000000";
        this.fontSize = props.fontSize || 20;
        this.x = props.x || 0; 
        this.y = props.y || 0; 


        // the following attributes are for React component tracking only.
        // this applies to when a text's position (and therefore z-index) is modified
        // these references allow us to update the input elements' data
        this.textInput = undefined; //applies to react components (stores reference to input elemnt for text)
        this.fontSizeInput =  undefined;
        this.colorInput = undefined;
    }

}


class LogoImage{

    serializeForGQL(){
        return {
            src: this.src,
            height:  this.height,
            width:  this.width,
            x:  this.x,
            y:  this.y 
        }
    }

    fetchData(forCss){
        return {
            src: forCss ? false : this.src,
            height: forCss ? `${this.height}px` : this.height,
            width: forCss ? `${this.width}px` : this.width,
            x: forCss ? false : this.x,
            y: forCss ? false : this.y 
        }
    }

    constructor(props){

        if(!props) props = {};

        if(props && typeof props != "object")
            throw new Error("Image class requires an object to be instantiated")


        this.src = props.src || "";
        this.height = props.height || 10;
        this.width = props.width || 10;
        this.x = props.height || 0;
        this.y = props.height || 0;

    }

}


export {Logo, Text};