treasureNames=""
fetch("https://codecyprus.org/th/api/list")
    .then(response => response.json()) //Parse JSON text to JavaScript object
    .then(jsonObject => {
        console.log(jsonObject)
        treasureNames = jsonObject.treasureHunts;
        i = document.getElementById("myWraper");
        for(j = 0; j < jsonObject.treasureHunts.length; j++)
        {
            i.innerHTML += "<div class='Hunts'><h1>"+treasureNames[j].name+"</h1>" +
                "<p>"+treasureNames[j].description+"</p>" +
                "<a href='app.html?uuid="+treasureNames[j].uuid+"'>Let the Hunt Begin!</a>" +
                "</div>"
        }
    });