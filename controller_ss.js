/* 
   Statue Wars, Written by XolotlDev & 0x0 
   Version 1.0, 
   Last Date Modified by Xol: 9/24/2021 @ 4:40 PM EST
   Last Editor: Xol
   
   Summary: 
*/

// Initialize Controller
function onUpdated() {
	this.tags = ["statuewars_controller"];
	this.x = 21.5;
	this.y = 26;
	this.drawunder = true;
	this.nonblocking = true;
	this.debug = false; //shh
	//this.scheduleevent(0, "setstatueproperties", pl);
	this.say("Controller Initialized!");
    this.image = "";
    
}

function onPlayerTouchsMe(pl) {
    if (!pl.clanname) return;
 	if (pl.clanname.includes("Events Admin") || pl.clanname.includes("Development Admin") &&  pl.adminlevel >= 1)
	this.scheduleevent(0, "sendinstruction", pl, "start");
}

function onPlayerSays(pl) {
    // Allows the help command for non admin Players
	if (pl.chat.toLowerCase() == "statue help") {
		pl.chat = "";
		return this.triggerclient(pl, "showhelpgui");
	}

	// Suggest correct command usage rip off
	let plrCmds = "<b>Available Commands:</b> statue help";
	let eAdminCmds = "<b>Event Admin Commands:</b> statue start, statue stop, statue reset, statue zoom";
	let dAdminCmds = "<b>Development Admin Commands:</b> statue ping, statue position, statue roll, statue lock";
	if (pl.chat.toLowerCase() == "statue") {
	    if (!pl.clanname) return pl.showmessage(plrCmds);
		if (pl.clanname.includes("Events Admin") && pl.adminlevel > 0) pl.showmessage(plrCmds + " <br>" + eAdminCmds);
		else if (pl.clanname.includes("Development Admin") && pl.adminlevel > 0) pl.showmessage(plrCmds + " <br>" + eAdminCmds + " <br>" + dAdminCmds);
		else pl.showmessage(plrCmds);
	}
  
    if (!pl.clanname) return;
    
	// Prevent non development admin Players from accessing commands
	if (pl.adminlevel > 0 && !pl.clanname.includes("Development Admin") &&
		pl.chat.includes("statue") && pl.chat.length > 6) pl.showmessage("Insufficient Permissions");
		
	if (!pl.clanname.includes("Events Admin") && !pl.clanname.includes("Development Admin") && pl.adminlevel < 1) return;

   
    
	// Construct staff commands
	switch (pl.chat.toLowerCase()) // convert player chat to lowercase to prevent casing issues with cmds
	{
		case "statue start": // Brings up the client side GUI for the admin Player
			pl.chat = "";
			return this.scheduleevent(0.1, "sendinstruction", pl, "start");
		case "statue reset": // Resets statue properties to default
			pl.chat = "";
			return this.scheduleevent(0.1, "sendinstruction", pl, "reset");
		case "statue zoom": // Enlarges or shrinks statues by x2
			pl.chat = "";
			return this.scheduleevent(0.1, "sendinstruction", pl, "zoom");
		case "statue position": // Repositions statue's to their correct positions 
			pl.chat = "";
			return this.scheduleevent(0.1, "sendinstruction", pl, "position");
		case "statue survivors":
			return this.say("Survivors: " + onGetInfo("players"));
	}

	// Prevent non development admin Players from accessing commands
	if (pl.adminlevel > 0 && !pl.clanname.includes("Development Admin")  &&
		pl.chat.includes("statue") && pl.chat.length > 6) pl.showmessage("Insufficient Permissions");

	if (!pl.clanname.includes("Development Admin") || pl.adminlevel == 0) return;

	// Construct development staff commands
	switch (pl.chat.toLowerCase()) {
		case "statue ping": // Debugging command used for checking that all statue npcs are operating
			pl.chat = "";
			this.scheduleevent(0, "sendinstruction", pl, "ping");
			break;
		case "statue lock":
			pl.chat = "";
			this.scheduleevent(0, "lockstatues", pl, null, true);
			break;
		case "statue roll":
			pl.chat = "";
			this.scheduleevent(0, "rollstatues");
			break;
		case "statue unlock":
			pl.chat = "";
			this.scheduleevent(0, "lockstatues", pl, null, false);
			break;
		case "statue owner":
			pl.chat = "";
			onGetInfo("statues").forEach(statue => {
				if (statue.tags[1] != undefined || statue.tags[1] == "") statue.say("Owner: " + statue.tags[1]);
				else statue.say("Unowned");
			});
			break;
		case "statue test":
			pl.chat = "";
			this.say(onGetInfo("survivors"));
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
			this.scheduleevent(0.1, "pingstatues", pl);
			break;
		case "position":
			this.scheduleevent(0.1, "positionstatues");
			break;
		case "reset":
			this.scheduleevent(0.1, "resetstatues", pl);
			this.scheduleevent(0.1, "lockstatues", pl, null, true);
			break;
		case "zoom":
			this.scheduleevent(0.1, "zoomstatues");
			break;
	}

	// Debugging stuff
	if (this.debug) pl.echo(this.name.toUpperCase() + ": Event -> onSendInstruction(), Player -> " +
		pl.name + ", NPC ID -> " + this.id);
}

/* Sets default statue properties
function onSetStatueProperties(pl) {
	this.scheduleevent(0.1, "sendinstruction", pl, "namestatues");
} */


// Debugging function used for checking that all statue NPCs are operating
function onPingStatues(pl) {
	onGetInfo("statues").forEach((statue) => {
		statue.say("pong!");
	});

	// Debugging stuff
	if (this.debug) pl.echo(this.name.toUpperCase() + ": Event -> onPingStatues(), Player -> " +
		pl.name + ", NPC ID -> " + this.id);
}

// Resets statue properties to default
function onResetStatues(pl) {
	onGetInfo("statues").forEach(statue => {
		statue.hat = pl.hat;
		statue.head = pl.head;
		statue.body = pl.body;
		statue.ani = "player_idle[1]";
		statue.zoom = 1;
		statue.name = "";
        statue.tags[1] = "";
		onGetInfo("players").forEach(plr => {
			statue.scheduleevent(0.1, "unlockstatue", plr);
		});
	});
}

// Enlarges or shrinks statues by x2
function onZoomStatues() {
	onGetInfo("statues").forEach(statue => {
		if (statue.zoom == 1) statue.zoom = 2;
		else statue.zoom = 1;
	});
}

// Start statue wars event
function onClientStartStatues(pl, auto) {
	if (onGetInfo("players").length <= 1) {
		this.showhp("Not Enough Players!", "red");
		return;
	}

	let startDelay = 5;
	let maxStatues = 12;
	let roundTimer = 10;
	let lockAmount = onGetInfo("players").length - 1;

	if (auto == "Single Round") auto = false;
	else auto = true;

	onGetInfo("players").forEach(plr => {
		plr.showmessage("Welcome to statue wars, say 'statue help' for a quick description on how to play, Good Luck!");
	});

	this.scheduleevent(0.1, "lockstatues", pl, null, true); // Lock all statues #1
	this.scheduleevent(0.5, "runtimer", startDelay, "Unlocking Statues"); // Unlock timer #2

	// timeout 5 seconds

	// Decide if lock all or specific amount #3
	if (onGetInfo("players").length <= maxStatues) this.scheduleevent(startDelay + 1, "unlockstatues", pl, lockAmount);
	else this.scheduleevent(startDelay + 1, "lockstatues", pl, null, false); // Max players unlock all statues 

	// timeout 7 seconds

	// this.scheduleevent(0, "rollstatues"); // Roll 

	this.scheduleevent(startDelay + 1.5, "runtimer", roundTimer, "Locking Statues"); // Re-Lock timer

	this.scheduleevent(startDelay + roundTimer + 3, "lockstatues", pl, null, true); // Re-Lock all 

	this.scheduleevent(startDelay + 4.5 + roundTimer, "checkstatues", pl, auto); // Check winners
}

function onCheckStatues(pl, auto) {
	let winningStr = "o.o";
	let losingStr = ":_(";

	onGetInfo("survivors").forEach(sur => { // Winning Conditions
	    if (sur) {
	        sur.say(winningStr);
	    	sur.setmap(sur.map.name, sur.map.name, 21.5, 26);
	    }

	});


    this.sleep(0.5);
    
	onGetInfo("players").forEach(plr => { // Losing Conditions
		if (plr.chat != winningStr) {
			plr.say(losingStr);
		//	plr.unstick();
			plr.showmessage("You have been eliminated from <b>Statue Wars</b>!");
		}
	});
    
    
	// Prep statues for next round if there will be one
	onGetInfo("statues").forEach(statue => {
		if (statue.tags[1] != "" || statue.tags[1] != null || statue.tags[1] != undefined) {
			statue.hat = pl.hat;
			statue.head = pl.head;
			statue.body = pl.body;
			statue.ani = "player_idle[1]";
		}
	});

	this.sleep(2.5);

	while (auto && onGetInfo("players").length >= 1) {
		this.scheduleevent(0.1, "startstatues", pl); // Re-Lock timer
		if (onGetInfo("players").length == 1 || !auto) {
			auto = false;
			this.showhp("Auto Mode Disabled!", "cyan");
			break;
		}
	}


}

// Starts timer
function onRunTimer(timer, msg) {
	let Color;
	for (var i = timer; i > 0; i--) {
		if (timer < 11) Color = "lime";
		if (timer < 6) Color = "yellow";
		if (timer < 2) Color = "red";
		this.showhp(msg + "(" + timer.toString() + ")", Color);
		timer--;
		this.sleep(1);
	}
}

// Returns a random statue
function onRollStatues() {
	let rollColor = [2.5, 2.5, 1, 2.5];
	let unlockColor = [1, 1, 1, 1];
	let lockColor = [0.3, 0.3, 0.3, 1];
	let time = 0;

	onGetInfo("statues").forEach((statue) => {
		statue.scheduleevent(time, "rollstatue", onGetInfo("players"), 0.5, [1, 2.5, 2.5, 2.5]); // 0
		time++;
	});
}

// Locks statue
function onLockStatues(pl, statue, bool) {
	/* 
	   Summary: Grab all statues, check to see if a statue was specified to be 
	   in the 'statue' argument if not then every statue gets locked foreach 
	   player on the level.
	*/

	onGetInfo("statues").forEach(_statue => {
		onGetInfo("players").forEach(plr => {
			if (_statue.tags[2] == statue) {
				if (bool) { // lock specified statue
					_statue.scheduleevent(0, "lockstatue", plr);
					_statue.chat = "🔒";
				} else { // unlock specified statue
					_statue.scheduleevent(0, "unlockstatue", plr);
					_statue.chat = "🔓";
				}
			} else if (statue == "" || statue == null) {
				if (bool) { // lock all statues 
					_statue.scheduleevent(0, "lockstatue", plr);
					_statue.chat = "🔒";
				} else { // unlock all statues
					_statue.scheduleevent(0, "unlockstatue", plr);
					_statue.chat = "🔓";
				}
			}
		});
	});
}

function onUnlockStatues(pl, amount) {
	let statueArr = onGetInfo("statues");
	onGetInfo("players").forEach(plr => {
		for (var i = amount; i > 0; i--) {
			this.scheduleevent(0.1, "lockstatues", plr, statueArr[i].tags[2], false);
		}
	});
}

// Grabs and returns specified event info
function onGetInfo(type, npc) {
    // Grab all non-controller NPCs
    let npcs = Server.searchnpcs({tag:"statuewars_statue"});
    
    
    /* Grab all unnamed statue NPCs
    let unnamedstatues = npcs.filter(npc => {return npc.name.length == 0 && npc.tags[0] == "statuewars_statue"; });
    */
    
    //Grab all named statue NPCs
    let takenstatues = npcs.filter(npc => {return npc.tags[0] == "statuewars_statue" && npc.tags[1] != "" || npc.tags[1] != undefined;});
          

    /* Grab all unlocked statue NPCs
    let unlockedstatues = npcs.filter(npc => {return npc.tags[1] = "" || npc.tags[31] != undefined; });
    */

    // Grab all Players and their IDs
    let players = Server.searchPlayers({map: this.map }).filter(function(plrs) {
        return !plrs.clanname && !plrs.clanname.includes("Admin");
    });

    let survivors = [];
    takenstatues.forEach(npc => { if (npc.tags[1] != undefined || npc.tags[1] != "") survivors.push(npc.tags[1]); });

	survivors = survivors.filter(function(survivor, pos) {
		return survivors.indexOf(survivor) == pos;
	});

	// Debugging stuff
	if (this.debug) pl.echo(this.name.toUpperCase() + ": Event -> onGetInfo(), NPC ID -> " + this.id + ", Players -> " + players + ", Survivors -> " + survivors);

	switch (type) {
		case "statues":
			return npcs;
		case "players":
			return players;
		case "survivors":
			return survivors;
		/*case "unnamedstatues":
			return unnamedstatues;
		case "namedstatues":
			return namedstatues; */
	}

}

// Positions statue NPCs based on name
function onPositionStatues() {
    
	onGetInfo("statues").forEach(statue => {
		switch (statue.tags[2]) {
			case 1:
				statue.x = 19.25;
				statue.y = 17.5;
				statue.dir = 2;
				break;
			case 2:
				statue.x = 23.75;
				statue.y = 17.5;
				statue.dir = 2;
				break;
			case 3:
				statue.x = 28.25;
				statue.y = 20;
				statue.dir = 2;
				break;
			case 4:
				statue.x = 30.80;
				statue.y = 23.5;
				statue.dir = 1;
				break;
			case 5:
				statue.x = 30.75;
				statue.y = 28;
				statue.dir = 1;
				break;
			case 6:
				statue.x = 28.30;
				statue.y = 31.55;
				statue.dir = 0;
				break;
			case 7:
				statue.x = 23.75;
				statue.y = 34;
				statue.dir = 0;
				break;
			case 8:
				statue.x = 19.25;
				statue.y = 34;
				statue.dir = 0;
				break;
			case 9:
				statue.x = 14.75;
				statue.y = 31.55;
				statue.dir = 0;
				break;
			case 10:
				statue.x = 12.25;
				statue.y = 28;
				statue.dir = 3;
				break;
			case 11:
				statue.x = 12.25;
				statue.y = 23.5;
				statue.dir = 3;
				break;
			case 12:
				statue.x = 14.75;
				statue.y = 20;
				statue.dir = 2;
				break;
		}
	});
}

/* Names statue NPCs based on count
function onNameStatues(pl) {
	let strPadding = "    ";
	let Count = 1;

	if (onGetInfo("unnamedstatues").length > 0) {
		onGetInfo("unnamedstatues").forEach((statue) => {
			if (statue.name.length < (9 + strPadding.length) && statue.tags[0] == "statuewars_statue") {
				statue.name = strPadding + "Statue #" + (onGetInfo("statues").length + Count);
				this.scheduleevent(0.1, "positionstatues", pl, strPadding);
				Count++;
			}
		});
	} else this.scheduleevent(0.1, "positionstatues", pl, strPadding);


} */
