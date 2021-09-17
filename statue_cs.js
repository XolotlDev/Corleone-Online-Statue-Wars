function onServerLockStatue(){
    var lockColor = [0.3,0.3,0.3,1];
    this.color = lockColor;
    
}

function onServerUnlockStatue(){
    var unlockColor = [1,1,1,1];
    this.color = unlockColor;
}

function onServerRollStatue(pl, delay, color)
{
    this.color = color;
    this.settimeout(delay);
}

function onTimeout()
{
    this.color = [1,1,1,1];
}
