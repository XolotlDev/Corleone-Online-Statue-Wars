/* 
   Statue Wars, Written by XolotlDev & 0x0 
   Version 1.0, 
   Last Date Modified by Xol: 9/15/2021 @ 1:34 PM EST
   Last Editor: Xol
   
   Summary: 
*/

// Initialize Controller
function onUpdated() {
	let strPadding = "    "; // string padding offset
	this.x = 21.5;
	this.y = 26;
	this.zoom = 1.5;
	this.drawunder = true;
	this.nonblocking = true;
	this.name = strPadding + "[Controller V2]";
	this.debug = false; //shh
	this.scheduleevent(0, "setstatueproperties", pl);
	this.say("Controller Initialized!");
	this.image = "smart-sign-tv.gif";
}

function onPlayerTouchsMe(pl) {
	if (!pl.clanname.toString().includes("Admin") || pl.adminlevel == 0) return;
	this.scheduleevent(0, "sendinstruction", pl, "start");
}

function onPlayerSays(pl) {
	// Allows the help command for non admin Players
	if (pl.chat.toString().toLowerCase() == "statue help") {
		pl.chat = "";
		this.triggerclient(pl, "showhelpgui");
	}

	// Suggest correct command usage rip off
	let plrCmds = "<b>Available Commands:</b> statue help";
	let eAdminCmds = "<b>Event Admin Commands:</b> statue start, statue stop, statue reset, statue zoom";
	let dAdminCmds = "<b>Development Admin Commands:</b> statue ping, statue position, statue roll, statue lock";
	if (pl.chat.toString().toLowerCase() == "statue") {
		if (pl.clanname.toString().includes("Events Admin") && pl.adminlevel > 0) pl.showmessage(plrCmds + " <br>" + eAdminCmds);
		else if (pl.clanname.toString().includes("Development Admin") && pl.adminlevel > 0) pl.showmessage(plrCmds + " <br>" + eAdminCmds + " <br>" + dAdminCmds);
		else pl.showmessage(plrCmds);
	}

	// Prevent non admin Players from accessing commands
	if (pl.adminlevel > 0 && !pl.clanname.toString().includes("Admin") &&
		pl.chat.includes("statue") && pl.chat.length > 6) pl.showmessage("Insufficient Permissions");

	if (!pl.clanname.toString().includes("Admin") || pl.adminlevel == 0) return;

	// Construct staff commands
	switch (pl.chat.toString().toLowerCase()) // convert player chat to lowercase to prevent casing issues with cmds
	{
		case "statue start": // Brings up the client side GUI for the admin Player
			pl.chat = "";
			this.scheduleevent(0, "sendinstruction", pl, "start");
			break;
		case "statue reset": // Resets statue properties to default
			pl.chat = "";
			this.scheduleevent(0, "sendinstruction", pl, "reset");
			break;
		case "statue zoom": // Enlarges or shrinks statues by x2
			pl.chat = "";
			this.scheduleevent(0, "sendinstruction", pl, "zoom");
			break;
		case "statue position": // Repositions statue's to their correct positions 
			pl.chat = "";
			this.scheduleevent(0, "sendinstruction", pl, "position");
			break;
		case "statue survivors":
			this.say("Survivors: " + onGetInfo("players"));
			break;
	}

	// Prevent non development admin Players from accessing commands
	if (pl.adminlevel > 0 && !pl.clanname.toString().includes("Development Admin") &&
		pl.chat.toString().includes("statue") && pl.chat.length > 6) pl.showmessage("Insufficient Permissions");

	if (!pl.clanname.toString().includes("Development Admin") || pl.adminlevel == 0) return;

	// Construct development staff commands
	switch (pl.chat.toString().toLowerCase()) {
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
			onGetInfo("statues").forEach((statue) => {
				if (statue.tag != undefined) statue.say("Owner: " + statue.tag);
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
			this.scheduleevent(0, "pingstatues", pl);
			break;
		case "position":
			this.scheduleevent(0, "namestatues", pl);
			break;
		case "reset":
			this.scheduleevent(0, "resetstatues", pl);
			this.scheduleevent(0, "namestatues", pl);
			this.scheduleevent(0, "lockstatues", pl, null, true);
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
	onGetInfo("statues").forEach((statue) => {
		statue.hat = pl.hat;
		statue.head = pl.head;
		statue.body = pl.body;
		statue.ani = "player_idle[1]";
		statue.zoom = 1;
		statue.name = "";
		statue.tag = "";

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

	this.scheduleevent(0, "lockstatues", pl, null, true); // Lock all statues #1
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

	onGetInfo("survivors").forEach((sur) => { // Winning Conditions
		sur.say(winningStr);
		sur.setmap(sur.map.name, sur.map.name, 21.5, 26);
	});

	this.sleep(2.5);

	onGetInfo("players").forEach(plr => { // Losing Conditions
		if (plr.chat != winningStr) {
			plr.say(losingStr);
			plr.unstick();
			plr.showmessage("You have been eliminated from <b>Statue Wars</b>!");
		}
	});

	this.sleep(0.5);

	// Prep statues for next round if there will be one
	onGetInfo("statues").forEach((statue) => {
		if (statue.tag != "" || statue.tag != null || statue.tag != undefined) {
			statue.hat = pl.hat;
			statue.head = pl.head;
			statue.body = pl.body;
			statue.ani = "player_idle[1]";
		}
	});

	this.sleep(2.5);

	while (auto && onGetInfo("players").length >= 1) {
		this.scheduleevent(0, "startstatues", pl); // Re-Lock timer
		if (onGetInfo("players").length == 1 || !auto) {
			auto = false;
			this.showhp("Auto Mode Disabled!", "cyan");
			break;
		}
	}


}

//	this.scheduleevent(0, "startroundsystem", onGetInfo("players").length, true);
/* function onStartRoundSystem(playerCount, auto) { // int for starting players

	if (onGetInfo("survivors").length >= 12) statueCount = 12; // If we have 12 or more players then unlock all statues
	else statueCount = onGetInfo("players").length; // If we dont then tha starting statue should be our player count.


	let roundDelay = 10;
	let startDelay = 7;
    this.say(onGetInfo("survivors").length);

	while (onGetInfo("players").length > 1 && auto) {
	    this.scheduleevent(0, "lockstatues", pl, null, true); // Lock all statues
	    
	    this.scheduleevent(0, "runtimer", startDelay, "Unlocking Statues"); // Announce round starting
	    
	    this.scheduleevent(startDelay + 1, "runtimer", roundDelay, "Locking Statues"); // Announce locking statues
	    	
        this.scheduleevent(startDelay + 1, "lockstatues", pl, null, true); // Lock the statues
        
	


		statueCount -= 1; // Remove a statue for the next round
		// loop restarts to continue round
		
		if (onGetInfo("survivors") == 1 || onGetInfo("players") == 0) {
		    this.showhp("Round Ended!", "cyan");
		    yield; 
		}
	}
}*/

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
	var time = 0;

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

	onGetInfo("statues").forEach((_statue) => {
		onGetInfo("players").forEach((plr) => {
			if (_statue.name == statue) {
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
	onGetInfo("players").forEach((plr) => {
		for (var i = amount; i > 0; i--) {
			this.scheduleevent(0, "lockstatues", plr, statueArr[i].name, false);
		}
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
			return !npc.name.includes("Controller") && !npc.name.toLowerCase().includes("test");
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

	// Grab all named statue NPCs
	let namedstatues = Server.searchnpcs({
			map: this.map,
			area: {
				x: 4,
				y: 11,
				w: 300,
				h: 300
			}
		})
		.filter(function(npc) {
			return npc.name.includes("Statue #");
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
		return !plrs.clanname.toString().includes("Adm1in");
	});

	let survivors = [];
	namedstatues.forEach(npc => {
		if (npc.tag != undefined || npc.tag != "") survivors.push(npc.tag);
	});

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
		case "unnamedstatues":
			return unnamedstatues;
		case "unlockedstatues":
			return unlockedstatues;
		case "namedstatues":
			return namedstatues;
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
				Count++;
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
