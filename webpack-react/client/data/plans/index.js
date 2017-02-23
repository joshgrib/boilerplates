let plans = require('./plans.js');

const SEM_WEEKS = 17;
const SWIPE_USAGE = 1.0;//100% usage
const GUEST_USAGE = 1.0;

function sumSwipes(swipesObj, includingGuestSwipes){
    let quant = swipesObj.buffet.quantity * SWIPE_USAGE;
    if(swipesObj.buffet.period == "week"){
        quant = quant * SEM_WEEKS;
    }
    if(includingGuestSwipes){
        quant += swipesObj.guest;
    }
    return Math.round(quant);
}

function getPlanStats(planLst){
    let res = {};
    for(let i in planLst){
        let planObj = planLst[i];

        let name = planObj.name;
        let cost = planObj.cost;
        let count = sumSwipes(planObj.swipes, true);

        let swipeCost = cost/count;

        res[i] = {
            "name":name,
            "cost":cost,
            "swipes":count
        }
    }
    return res;
}

let pStats = getPlanStats(plans);

module.exports = {
    raw: plans,
    stats: pStats
};
