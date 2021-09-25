function onPlayerTouchsMe() {
    this.nonblocking = true;
}

function onServerShowHelpGUI(pl){
    var popup = GUI.showpopup({
        title: "<b>Statue Wars: <u>How To Play</u></b>",
        width: 400,
        height: 120
    });
    popup.innerHTML = '<br><p style="font-size: 19px";>Welcome to statue wars the objective of this event is to claim as many ' + 
    'statues as you can by touching it before the time rounds out. Players without a statue claimed at the end of the round will be eliminated.  Good Luck!</p>';
}

function onServerStartEvent(pl){
    var popup = GUI.showpopup({
        title: "<b>Statue Wars Controller</b>",
        width: 400,
        height: 170
    });
    
    popup.innerHTML = '<center><b><u>How To Play:</u></b></center>' + 
    '<p style="font-size: 19px";>Welcome to statue wars the objective of this event is to claim as many ' + 
    'statues as you can by touching it before the time rounds out. Players without a statue claimed at the end of the round will be eliminated.</p><hr>' + 
    '<center><input id="startbtn" type="submit" class="button" style="left:75%;width:100px;height:40px;" value="Start">' +
    '</input></center>' + 
    '<select id="selectfield" style="background-color:lightblue;position:absolute;left:45%;width:120px;height:40px;font-size:13px;">' +
    '  <option selected>Single Round</option>' +
    '  <option>Auto</option>' +
    '</select>';
    
    var self = this;
    GUI.onclick("startbtn", function(event) {
        self.triggerserver("startstatues", GUI.get("selectfield").value);
        GUI.hidepopup();
    });
}
