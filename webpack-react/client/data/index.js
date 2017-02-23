let meals = require('./meals');
let plans = require('./plans');

const TAX_MULTIPLIER = 1.07;

let planStats = plans.stats;
let mealStats = meals.stats;

let planCosts = {};
for(let p in planStats){
    let planObj = planStats[p];
    let swipeCost = planObj.cost/planObj.swipes;

    planCosts[planObj.name] = (swipeCost)*TAX_MULTIPLIER;
}

let mealCosts = {};
for(let m in mealStats){
    let mealObj = mealStats[m];
    let key = `${mealObj.name} - ${mealObj.location}`;

    mealCosts[key] = (mealObj.maxCombo.price)*TAX_MULTIPLIER;
}

module.exports = {
    mealData:meals,
    planData:plans
}
