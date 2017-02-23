import React from 'react';
import ReactDOM from 'react-dom';

export class AppHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render(){
        return (
            <header>
                <h1>{this.props.main}</h1>
                <h2>{this.props.sub}</h2>
            </header>
        );
    }
}
