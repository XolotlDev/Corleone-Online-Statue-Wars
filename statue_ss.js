function onPlayerTouchsMe(pl)
{
    let Owner = pl;
    this.hat = pl.hat;
    this.head = pl.head;
    this.body = pl.body;
    this.ani = "player_idle";
    if (Owner != pl) this.showhp("Taken!", "yellow");
}

function onRollStatue(plrs, delay, color) { 
    plrs.forEach((plr) => {
       this.triggerclient(plr, "rollstatue", delay, color);
    });
}
function onLockStatue(plr){
    this.triggerclient(plr, "lockstatue");
    this.showhp("Locked!", "red");
}

function onUnlockStatue(plr){
    this.triggerclient(plr, "unlockstatue");
    this.showhp("Unlocked!", "lime");
}

function onUpdateStats(pl) {
    
}
