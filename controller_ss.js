/* 
   Statue Wars, Written by XolotlDev & 0x0 
   Pre-Alpha Version 1.0, 
   Last Date Modified by Xol: 9/15/2021 @ 1:34 PM EST
   Last Editor: Xol
   
   Summary: 
*/

// Initialize Controller
function onUpdated() {
	let offset = "    "; // string padding offset
	this.x = 21.5;
	this.y = 26;
	this.zoom = 1.5;
	this.drawunder = true;
	this.nonblocking = true;
	this.name = offset + "[Controller V2]";
	this.debug = false;
	this.scheduleevent(0, "setstatueproperties", pl);
	this.say("Controller Initialized!");
}

function onPlayerSays(pl) {
	// Allows the help command for non admin Players
	if (pl.chat.toLowerCase() == "statue help") this.triggerclient(pl, "showhelpgui");

    // Suggest correct command usage rip off
    let plrCmds = "<b>Available commands:</b> statue help";
    let eAdminCmds = "<b>Event Admin commands:</b> statue start, statue stop, statue reset, statue zoom"; 
    let dAdminCmds = "<b>Development Admin commands:</b> statue ping, statue position, statue roll, statue lock"; 
    if (pl.chat.toLowerCase() == "statue") {
        if (pl.clanname.includes("Events Admin") && pl.adminlevel > 0) pl.showmessage(plrCmds + " <br>" + eAdminCmds);
        else if (pl.clanname.includes("Development Admin") && pl.adminlevel > 0) pl.showmessage(plrCmds + " <br>" + eAdminCmds + " <br>" + dAdminCmds);
        else pl.showmessage(plrCmds);
    }
    
	// Prevent non admin Players from accessing commands
	if (pl.adminlevel > 0 && !pl.clanname.includes("Admin") && 
	pl.chat.includes("statue") && pl.chat.length > 6) pl.showmessage("Insufficient Permissions");
	
	if (!pl.clanname.includes("Admin") || pl.adminlevel == 0) return;

	// Construct staff commands
	switch (pl.chat.toLowerCase()) // convert player chat to lowercase to prevent casing issues with cmds
	{
		case "statue start": // Brings up the client side GUI for the admin Player
			this.scheduleevent(0, "sendinstruction", pl, "start");
			break;
		case "statue reset": // Resets statue properties to default
			this.scheduleevent(0, "sendinstruction", pl, "reset");
			break;
		case "statue zoom": // Enlarges or shrinks statues by x2
			this.scheduleevent(0, "sendinstruction", pl, "zoom");
			break;
		case "statue position": // Repositions statue's to their correct positions 
			this.scheduleevent(0, "sendinstruction", pl, "position");
			break;
	}

	// Prevent non development admin Players from accessing commands
	if (!pl.clanname.includes("Development Admin") || pl.adminlevel == 0) return;


	// Construct development staff commands
	switch (pl.chat.toLowerCase()) {
		case "statue ping": // Debugging command used for checking that all statue npcs are operating
			this.scheduleevent(0, "sendinstruction", pl, "ping");
			break;
		case "statue lock":
			this.scheduleevent(0, "lockstatues", pl, "", true);
			break;
		case "statue roll":
			this.scheduleevent(0, "rollstatues");
			break;
	}

	// Debugging stuff
	if (this.debug) pl.echo(this.name.toUpperCase() + ": Event -> onPlayerSays(), Player -> " +
		pl.name + ", NPC ID -> " + this.id);
}

// Sends an instruction to the npc to carry out a given task
function onSendInstruction(pl, type, data) {
	// Differenciate between instruction type
	switch (type) {
		case "start":
			this.triggerclient(pl, "startevent");
			break;
		case "ping":
			this.scheduleevent(0, "pingstatues", pl);
			break;
		case "position":
			this.scheduleevent(0, "namestatues", pl);
			break;
		case "reset":
			this.scheduleevent(0, "resetstatues", pl);
			break;
		case "zoom":
			this.scheduleevent(0, "zoomstatues");
			break;
	}

	// Debugging stuff
	if (this.debug) pl.echo(this.name.toUpperCase() + ": Event -> onSendInstruction(), Player -> " +
		pl.name + ", NPC ID -> " + this.id);
}

// Sets default statue properties
function onSetStatueProperties(pl) {
	this.scheduleevent(0, "sendinstruction", pl, "namestatues");
}

// Check for missing statues
function onCheckStatues() {
	onGetInfo("statues").forEach((statue) => {
		if (statues.length != 12) {
			// 
		}
	});
}

// Debugging function used for checking that all statue NPCs are operating
function onPingStatues(pl) {
	onGetInfo("statues").forEach((statue) => {
		statue.scheduleevent(0, "getinstruction", "ping", "pong");
	});

	// Debugging stuff
	if (this.debug) pl.echo(this.name.toUpperCase() + ": Event -> onPingStatues(), Player -> " +
		pl.name + ", NPC ID -> " + this.id);
}

// Resets statue properties to default
function onResetStatues(pl) {
	onGetInfo("statues").forEach((statue) => {
		statue.hat = pl.hat;
		statue.head = pl.head;
		statue.body = pl.body;
		statue.ani = "player_idle";
		statue.zoom = 1;
		statue.name = "";
		statue.chat = "";

		onGetInfo("players").forEach((plr) => {
			statue.scheduleevent(0, "unlockstatue", plr);
		});
	});
}

// Enlarges or shrinks statues by x2
function onZoomStatues() {
	onGetInfo("statues").forEach((statue) => {
		if (statue.zoom == 1) statue.zoom = 2;
		else statue.zoom = 1;
	});
}

// Start statue wars event
function onClientStartStatues(pl) {

}

// Stop statue wars event
function onStopStatues(pl) {

}

// Pauses statue wars event
function onPauseStatues(pl) {

}

// Returns a random statue
function onRollStatues() {
    let rollColor = [2.5,2.5,1,2.5];
    var time = 0;
    
	onGetInfo("statues").forEach((statue) => {
		statue.scheduleevent(time, "rollstatue", onGetInfo("players"), 0.5, rollColor);
		time++
	});
}

// Locks statue
function onLockStatues(pl, statue, bool) {
	/* 
	   Summary: Grab all statues, check to see if a statue was specified to be 
	   in the 'statue' argument if not then every statue gets locked foreach 
	   player on the level.
	*/

	onGetInfo("statues").forEach((_statue) => {
		if (_statue == statue) this.triggerclient(plr, "lockstatues", true, _statue);
		else if (statue == "") onGetInfo("players").forEach((plr) => {
			if (bool) _statue.scheduleevent(0, "lockstatue", plr);
			else _statue.scheduleevent(0, "unlockstatue", plr);
		});
	});
}

// Grabs and returns specified event info
function onGetInfo(type, npc) {
	// Grab all non-controller NPCs
	let npcs = Server.searchnpcs({
			map: this.map,
			area: {
				x: 4,
				y: 11,
				w: 300,
				h: 300
			}
		})
		.filter(function(npc) {
			return !npc.name.includes("Controller") && !npc.name.includes("Test");
		});

	// Grab all unnamed statue NPCs
	let unnamedstatues = Server.searchnpcs({
			map: this.map,
			area: {
				x: 4,
				y: 11,
				w: 300,
				h: 300
			}
		})
		.filter(function(npc) {
			return npc.name.length == 0;
		});

	// Grab all unlocked statue NPCs
	let unlockedstatues = Server.searchnpcs({
			map: this.map,
			area: {
				x: 4,
				y: 11,
				w: 300,
				h: 300
			}
		})
		.filter(function(npc) {
			return npc.name.includes("Statue");
			// ill think of another condition later
		});

	// Grab all Players and their IDs
	let players = Server.searchPlayers({
		map: this.map
	}).filter(function(plrs) {
		return !plrs.clanname.includes("Adm1in");
	});

	/*
    
	// Grab all Survivors Names and Player Accounts
	let survivors = [];
	npcs.forEach(npc =>{ 
	    let chat = npc.chat.substring(1, npc.chat.length-1); //Filter out "( )"
	    survivors.push(survivors.push(chat))
	});
    
	/ Filter survivors through Player IDs
	survivors = players.filter(function(plr){
	    return survivors.includes(plr.name)
	});
    
	*/

	// Grab a list of Players to kick from the event
	let toKick = players.filter(function(plr) {
		return !survivors.includes(plr.name); // Grab every player who didn't survive
	});

    npc.sort((a,b) => a-b);
    
	// Debugging stuff
	if (this.debug) pl.echo(this.name.toUpperCase() + ": Event -> onGetInfo(), NPC ID -> " + this.id + ", Players -> " + players + ", Survivors -> " + survivors);

	switch (type) {
		case "statues":
			return npcs;
		case "players":
			return players;
		case "survivors":
			return survivors;
		case "unnamedstatues":
			return unnamedstatues;
		case "unlockedstatues":
			return unlockedstatues;
	}

}

// Names statue NPCs based on count
function onNameStatues(pl) {
	let Offset = "      ";
	let Count = 1;

	if (onGetInfo("unnamedstatues").length > 0) {
		onGetInfo("unnamedstatues").forEach((statue) => {
			if (statue.name.length < (9 + Offset.length)) {
				statue.name = Offset + "Statue #" + (onGetInfo("statues") + Count);
				this.scheduleevent(0, "positionstatues", pl, Offset);
				Count++
			}
		});
	} else this.scheduleevent(0, "positionstatues", pl, Offset);


}

// Positions statue NPCs based on name
function onPositionStatues(pl, Offset) {
	let Prefix = Offset + "Statue #";
	onGetInfo("statues").forEach((statue) => {
		switch (statue.name) {
			case Prefix + "1":
				statue.x = 19.25;
				statue.y = 17.5;
				statue.dir = 2;
				break;
			case Prefix + "2":
				statue.x = 23.75;
				statue.y = 17.5;
				statue.dir = 2;
				break;
			case Prefix + "3":
				statue.x = 28.25;
				statue.y = 20;
				statue.dir = 2;
				break;
			case Prefix + "4":
				statue.x = 30.80;
				statue.y = 23.5;
				statue.dir = 1;
				break;
			case Prefix + "5":
				statue.x = 30.75;
				statue.y = 28;
				statue.dir = 1;
				break;
			case Prefix + "6":
				statue.x = 28.30;
				statue.y = 31.55;
				statue.dir = 0;
				break;
			case Prefix + "7":
				statue.x = 23.75;
				statue.y = 34;
				statue.dir = 0;
				break;
			case Prefix + "8":
				statue.x = 19.25;
				statue.y = 34;
				statue.dir = 0;
				break;
			case Prefix + "9":
				statue.x = 14.75;
				statue.y = 31.55;
				statue.dir = 0;
				break;
			case Prefix + "10":
				statue.x = 12.25;
				statue.y = 28;
				statue.dir = 3;
				break;
			case Prefix + "11":
				statue.x = 12.25;
				statue.y = 23.5;
				statue.dir = 3;
				break;
			case Prefix + "12":
				statue.x = 14.75;
				statue.y = 20;
				statue.dir = 2;
				break;
		}
	});
}
