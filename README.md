## Some useful queries for GraphiQL

Get all information about all logos:

    query getAllLogos{
        logos{
            _id
            text
            color
            fontSize
            backgroundColor
            borderColor
            borderWidth
            borderRadius
            padding
            margin
            lastUpdate
        }
    }

Get one logo using its ID:

    query getOneLogoById{
        logo(id:"----INSERT ID HERE----"){
            _id
            text
            color
            fontSize
            backgroundColor
            borderColor
            borderWidth
            borderRadius
            padding
            margin
            lastUpdate
        }
    }

Create a new logo:

    mutation AddLogo{
        addLogo(
            text: "New Logo",
            color: "#000000",
            fontSize: 12,
            backgroundColor: "#FFFFFF",
            borderColor: "#000000",
            borderWidth: 12,
            borderRadius: 12,
            padding: 12,
            margin: 12) {
            _id
        }
    }

Edit an existing logo:

    mutation updateLogo{
            updateLogo(
                id: "----ID OF LOGO TO UPDATE----",
                text: "NEW TEXT",
                color: "#000000",
                fontSize: 12,
                backgroundColor: "#FFFFFF",
                borderColor: "#000000",
                borderWidth: 12,
                borderRadius: 12,
                padding: 12,
                margin: 12) {
                    lastUpdate
            }
    }

Get all logos with a text:

    {
        getLogoByText(text: "----LOGO TEXT FRAGMENT----"){
            _id
            text
            color
            fontSize
            backgroundColor
            borderColor
            borderWidth
            borderRadius
            padding
            margin
            lastUpdate
        }
    }

Get a logos with a text that contains:

    {
        getLogosByTextContains(text: "----LOGO TEXT FRAGMENT----"){
            _id
            text
            color
            fontSize
            backgroundColor
            borderColor
            borderWidth
            borderRadius
            padding
            margin
            lastUpdate
        }
    }