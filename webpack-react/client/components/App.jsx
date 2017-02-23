import React from 'react';
import ReactDOM from 'react-dom';

import { Container, Row, Col } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Table } from 'reactstrap';
import { Button, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Card, CardBlock, CardTitle, CardText } from 'reactstrap';

//import { TodoApp } from './TodoApp.jsx';



const MealPlanList = ({planList}) => {
    return (
        <ListGroup>
            {planList.map((planObj) => {
                return (
                    <ListGroupItem key={planObj.name}>
                        <b>{planObj.name}</b><br/>
                        ${planObj.price.toFixed(2)}
                    </ListGroupItem>
                )
            })}
        </ListGroup>
    );
}

const MealCostList = ({mealList}) => {
    return (
        <ListGroup>
            {mealList.map((mealObj) => {
                return (
                    <ListGroupItem key={mealObj.name}>
                        <b>{mealObj.name}</b><br/>
                        ${mealObj.price.toFixed(2)}
                    </ListGroupItem>
                )
            })}
        </ListGroup>
    )
}

const DisplayJSON = ({title, jsonData}) => {
    return (
        <div>
            <header>{title}</header>
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
    )
}

const PlanTable = ({planData}) => {
    let planList = [];
    for(let p in planData){
        let planObj = planData[p];
        let exchanges = `${planObj.swipes.exchange.quantity} per ${planObj.swipes.exchange.period}`;
        let pierceCount = planObj.swipes.buffet.unlimited?
            'Unlimited' :
            `${planObj.swipes.buffet.quantity} per ${planObj.swipes.buffet.period}`;

        let plan = {
            'name':planObj.name,
            'pierce':pierceCount,
            'exchanges':exchanges,
            'guests':planObj.swipes.guest,
            'cost':planObj.cost
        }
        planList.push(plan);
    }

    return (
        <section id="mealPlanTable">
            <p>All meal plans have Washington Street Wednesday and can include 0, 100, or 300 Duckbills.</p>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Pierce Swipes</th>
                        <th>Meal Exchanges</th>
                        <th>Guest Swipes</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {planList.map((plan) => {
                        return (
                            <tr key={plan.name}>
                                <th>{plan.name}</th>
                                <td>{plan.pierce}</td>
                                <td>{plan.exchanges}</td>
                                <td>{plan.guests}</td>
                                <td>{plan.cost}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </section>
    );
}

const MealTable = ({mealData}) => {
    let mealList = [];
    for(let m in mealData){
        let mealObj = mealData[m];

        let maxMeal = [];
        let maxMealPrice = 0;
        let minMeal = [];
        let minMealPrice = 0;

        for(let c in mealObj.categories){
            let items = mealObj.categories[c].items;

            let maxItem = items[0].name;
            let maxPrice = parseFloat(items[0].price);
            let minItem = items[0].name;
            let minPrice = parseFloat(items[0].price);

            for(let i in items){
                let item = items[i];
                let p = parseFloat(item.price);
                if(p < minPrice){
                    minPrice = p;
                    minItem = item.name;
                }
                if(p > maxPrice){
                    maxPrice = p;
                    maxItem = item.name;
                }
            }

            maxMeal.push(maxItem);
            maxMealPrice += maxPrice;
            minMeal.push(minItem);
            minMealPrice += minPrice;
        }

        let meal = {
            'name':mealObj.name,
            'location':mealObj.location,
            'minprice':minMealPrice,
            'mincombo':minMeal,
            'maxprice':maxMealPrice,
            'maxcombo':maxMeal
        }
        mealList.push(meal);
    }
    return (
        <section id="mealTable">
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Meal</th>
                        <th>Max Value</th>
                        <th>Min Value</th>
                    </tr>
                </thead>
                <tbody>
                    {mealList.map((meal) => {
                        let name = meal.name;
                        let loc = meal.location;
                        let maxPrice = meal.maxprice.toFixed(2);
                        let maxItems = meal.maxcombo;
                        let minPrice = meal.minprice.toFixed(2);
                        let minItems = meal.mincombo;
                        return (
                            <tr key={`${meal.name} @ ${meal.location}`}>
                                <td>{name}</td>
                                <td>{loc}</td>
                                <td>
                                    {`${maxPrice} ($${(maxPrice*1.07).toFixed(2)} w/ tax)`}
                                    <br/>
                                    {maxItems.join(' + ')}
                                </td>
                                <td>
                                    {`${minPrice} ($${(minPrice*1.07).toFixed(2)} w/ tax)`}
                                    <br/>
                                    {minItems.join(' + ')}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </section>
    );
}

const SideBar = ({planData, mealData}) => {
    return (
        <section>
            <header>
                <h3>Meal plan costs and values</h3>
            </header>

            <h4>Meal Plans</h4>
            <PlanTable planData={planData}/>

            <h4>Maximum Value Meals</h4>
            <MealTable mealData={mealData}/>
        </section>
    );
}

const ValueTable = ({planList, mealList, stateStatus}) => {
    return (
        <Table bordered hover responsive className="table-condensed">
            <thead>
                <tr>
                    <th></th>
                    {planList.map((plan, i) => {
                        return (
                            <th key={`plan_${i}`}>
                                {plan.name}<br/>
                            {`$${plan.value}`}/swipe
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {mealList.map((meal, i) => {
                    let mealName = `${meal.name} at ${meal.location}`;
                    let mealPrice = (meal.price*stateStatus.tax).toFixed(2);
                    return (
                        <tr key={`meal_${i}`}>
                            <th>{mealName} {meal.type?`(${meal.type})`:''}: {`$${mealPrice}`}
                            </th>
                            {planList.map((plan, j) => {
                                let swipePrice = plan.value;
                                let savings = mealPrice - swipePrice;
                                let isPos = savings>0;
                                let cellValue = `$${savings.toFixed(2)}`;
                                if(isPos){
                                    cellValue = <strong>{cellValue}</strong>
                                }
                                return (
                                    <td
                                        key={`meal_${i}|plan_${j}`}
                                        className={isPos?'success':'danger'}>
                                        {cellValue}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

const ValueChartTool = ({title, planData, mealData, updateUsage, updateGuests, updateUnlimited, updateTax, updateWeeks, stateStatus}) => {
    let planList = [];
    for(let p in planData){
        let planObj = planData[p];
        let cost = parseInt(planObj.cost);
        let swipes = planObj.swipes.buffet.quantity;
        //multiply for weekly plans
        if(planObj.swipes.buffet.period=='week'){
            swipes = swipes * stateStatus.semester_weeks;
        }
        //adjust usage
        swipes = swipes * stateStatus.swipe_usage;
        //add extra unlimited swipes if the plan is unlimited
        if(planObj.swipes.buffet.unlimited){
            swipes = swipes + stateStatus.unlimited;
        }
        //add guest swipes
        swipes = swipes + stateStatus.guest_usage;
        let swipeCost = (cost/swipes).toFixed(2);
        planList.push({'name':planObj.name, 'value':swipeCost})
    }
    let mealList = [];
    for(let m in mealData){
        let mealObj = mealData[m];
        let maxMealPrice = 0;
        let minMealPrice = 0;

        for(let c in mealObj.categories){
            let items = mealObj.categories[c].items;
            let maxPrice = parseFloat(items[0].price);
            let minPrice = parseFloat(items[0].price);

            for(let i in items){
                let item = items[i];
                let p = parseFloat(item.price);
                if(p < minPrice){
                    minPrice = p;
                }
                if(p > maxPrice){
                    maxPrice = p;
                }
            }
            maxMealPrice += maxPrice;
            minMealPrice += minPrice;
        }
        let minMaxEqual = (maxMealPrice == minMealPrice);

        mealList.push({
            'name':mealObj.name,
            'location':mealObj.location,
            'type':minMaxEqual? '' : 'Max',
            'price':maxMealPrice
        });
        if(!minMaxEqual){
            mealList.push({
                'name':mealObj.name,
                'location':mealObj.location,
                'type':'Min',
                'price':minMealPrice
            });
        }
    }
    return (
        <section id="valueChart">
            <header>
                <h3>{title}</h3>
            </header>
            <h4>Change the settings here</h4>
            <Col sm={6}>
                <Container>
                    <Row>
                        <Col sm={6}>Normal swipes used</Col>
                        <Col sm={6}>
                            <InputGroup>
                                <Input type="number" name="usage" id="usage"
                                defaultValue={stateStatus.swipe_usage * 100}
                                onChange={updateUsage}
                                min={0} max={100} step={1}/>
                                <InputGroupAddon>%</InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>Guest swipes used</Col>
                        <Col sm={6}>
                            <InputGroup>
                                <Input type="number" name="guests" id="guests"
                                    defaultValue={stateStatus.guest_usage * 100}
                                    onChange={updateGuests}
                                    min={0} max={100} step={1}/>
                                <InputGroupAddon>%</InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>Swipes per week over 21(3/day)</Col>
                        <Col sm={6}>
                            <InputGroup>
                                <Input type="number" name="unlim" id="unlim"
                                    defaultValue={stateStatus.unlimited}
                                    onChange={updateUnlimited}
                                    min={0} step={1}/>
                                <InputGroupAddon>per week</InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>Tax rate is</Col>
                        <Col sm={6}>
                            <InputGroup>
                                <Input type="number" name="tax" id="tax"
                                    defaultValue={parseInt((stateStatus.tax-1)*100)}
                                    onChange={updateTax}
                                    min={0} step={1}/>
                                <InputGroupAddon>%</InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>Weeks in the semester</Col>
                        <Col sm={6}>
                            <InputGroup>
                                <Input type="number" name="weeks" id="weeks"
                                    defaultValue={stateStatus.semester_weeks}
                                    onChange={updateWeeks}
                                    min={0} max={26} step={1}/>
                                <InputGroupAddon>weeks</InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </Col>
            <Col sm={12}>
                <h4>See where you save and lose money here</h4>
                <ValueTable planList={planList} mealList={mealList} stateStatus={stateStatus}/>
                <Card>
                    <CardBlock>
                        <CardTitle>Math</CardTitle>
                        <ul>
                            <li>Meal max and min prices are calculated by combining items to get the greatest and least cost respectively, and adding tax.</li>
                            <li>Meal plan prices are calculated as total_swipes/plan_cost, where total swipes is the sum of normal and guest swipes, adjusting for usage and extra unlimited swipes. </li>
                            <li>Cell values are calculated by taking the cost of the meal normally and subtracted the cost of the swipe used for the meal, to get the amount saved by using a plan over buying the meal alone.</li>
                        </ul>
                    </CardBlock>
                </Card>
            </Col>
        </section>
    );
}

let mData = require('../data/meals/meals.js');
let pData = require('../data/plans/plans.js');

import {AppHeader} from './AppHeader.jsx';

export default class App extends React.Component {
    constructor(props){
        // Pass props to parent class
        super(props);
        // Set initial state
        this.state = {
            swipe_usage:1,
            guest_usage:1,
            unlimited:0,
            tax:1.07,
            semester_weeks:17
        }
    }
    // Lifecycle method
    componentDidMount(){
        console.log('App mounted');
    }
    changeStateVal(key, newVal){
        let s = this.state;
        s[key] = newVal;
        this.setState(s);
    }
    updateUsage(e) {
        let newVal = e.target.value;
        this.changeStateVal('swipe_usage', parseFloat(newVal/100));
    }
    updateGuests(e) {
        let newVal = e.target.value;
        this.changeStateVal('guest_usage', parseFloat(newVal/100));
    }
    updateUnlimited(e) {
        let newVal = e.target.value * this.state.semester_weeks;
        this.changeStateVal('unlimited', parseFloat(newVal));
    }
    updateTax(e) {
        let newVal = e.target.value;
        this.changeStateVal('tax', parseFloat(1+(newVal/100)));
    }
    updateWeeks(e) {
        let newVal = e.target.value;
        this.changeStateVal('semester_weeks', parseFloat(newVal));
    }
    render() {
        return (
            <div>
                <Container id="joshApp">
                    <Row>
                        <AppHeader
                            main="Stevens Meal Plans"
                            sub="Which one is best for you?"/>
                    </Row>
                    <Row id="joshMain">
                        <Col sm={12}>
                            <ValueChartTool
                                title="Meal plan value chart"
                                planData={pData}
                                mealData={mData}
                                updateUsage={this.updateUsage.bind(this)}
                                updateGuests={this.updateGuests.bind(this)}
                                updateUnlimited={this.updateUnlimited.bind(this)}
                                updateTax={this.updateTax.bind(this)}
                                updateWeeks={this.updateWeeks.bind(this)}
                                stateStatus={this.state}
                                />
                        </Col>
                        <Col sm={12}>
                            <SideBar
                                planData={pData}
                                mealData={mData}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
