function onServerShowHelpGUI(pl){
    var popup = GUI.showpopup({
        title: "<b>Statue Wars",
        width: 400,
        height: 300
    });
    popup.innerHTML = "<center>How To Play:</center><br>" +
    "Hey " + pl.name + ", Thanks playing statue wars! In this event you'll need to ...";
}

function onServerStartEvent(pl){
    var popup = GUI.showpopup({
        title: "<b>Statue Wars Controller",
        width: 400,
        height: 300
    });
    popup.innerHTML = "<center>How To Play:</center><br>" +
    "Hey " + pl.name + ", Thanks playing statue wars! In this event you'll need to ...";
}
