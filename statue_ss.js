function onCreated() { this.onUpdated(); }
function onUpdated()
{
    this.tags = ["statuewars_statue", "", 11];

}

function onPlayerTouchsMe(pl)
{
    
    if (this.chat != "🔓")
    {
        this.tags[1] = pl;
        this.hat = pl.hat;
        this.head = pl.head;
        this.body = pl.body;
        this.ani = "player_idle[1]";
        this.showhp("Taken!", "yellow");
    } else pl.showmessage("This statue is currently locked and cannot be claimed.");
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

