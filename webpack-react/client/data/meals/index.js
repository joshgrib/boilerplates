let meals = require('./meals.js');

function findMealLimit(mealObj, findingMin){
    //find max by default
    let res = {
        "price":undefined,
        "items":{}
    };
    let cats = mealObj.categories;
    let totalPrice = 0;

    let firstIsBetter = (first, second) => {
        //custom comparison to get > or < depending on situation
        if(findingMin){
            return first < second;
        }
        return first > second
    }

    for(let c in cats){
        let itemList = cats[c].items;
        bestItem  = itemList[0];
        for(let item in itemList){
            let thisItem = itemList[item];
            if(firstIsBetter(thisItem.price, bestItem.price)){
                bestItem = thisItem;
            }
        }
        res.items[c] = bestItem;
        totalPrice += bestItem.price;
    }
    res.price = totalPrice;
    return res;
}

function findMealStats(mealObj){
    res = {
        "name":mealObj.name,
        "location":mealObj.location,
        "maxCombo":undefined,
        "minCombo":undefined//leave this undef is there is only one combo?meals
    }
    res.maxCombo = findMealLimit(mealObj, false);
    res.minCombo = findMealLimit(mealObj, true);
    return res;
}

function findAllStats(mealList){
    let res = {};
    for(let meal in mealList){
        let mealObj = mealList[meal];
        let stats = findMealStats(mealObj);
        res[meal] = stats
    }
    return res;
}

let mStats = findAllStats(meals);

module.exports = {
    raw: meals,
    stats: mStats
};
