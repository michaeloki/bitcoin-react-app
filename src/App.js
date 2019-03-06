import React, { Component } from 'react';
import './App.css';
import {
  Container, Col, Form,
  FormGroup, Label, Input,
  Button
} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'startDate': ''
    }
    this.state = { prices: [] };
  }

  PriceList(days) {
    fetch('https://blockchain.info/charts/market-price?timespan='
      + days + 'days&format=json&cors=true')
      .then(results => {
        return results.json();
      })
      .then(data => {
        let prices = data.values.map((dataValue) => {
          let primeCheck = this.primeNumberChecker(Math.round(dataValue.y));
          let priceDate = '';
          if (primeCheck) {
            let itemPosition = dataValue.indexOf(Math.round(dataValue.y)) + 1;
            priceDate = new Date(Date.now() - 864e5 * itemPosition).toLocaleDateString("en-GB");
          }
          return (
            <div key="dataValue.values">$ {Math.round(dataValue.y)}
              <span> {priceDate}</span>
            </div>
          )
        });
        this.setState({ prices: prices });
      });
  }

  primeNumberChecker(num) {
    for (var i = 2; i < num; i++)
      if (num % i === 0) return false;
    return num > 1;
  }

  handleChange = async (event) => {
    const { target } = event;
    const value = target.value;
    const { startDate } = target;
    await this.setState({
      [startDate]: value
    });
  }

  submitForm(event) {
    event.preventDefault();
    let chosenDate = Date.parse(event.target.startDate.value);

    if (!isNaN(chosenDate)) {
      let dateDiff = Date.now() - 864e5 * 180;
      if (chosenDate < dateDiff) {
        alert('You can only pick from the last 6 months');
      } else {
        let numOfDays = Math.round(Date.now() / 864e5 - chosenDate / 864e5);
        this.PriceList(numOfDays);
      }
    } else {
      alert('Please enter a valid date');
    }
  }

  render() {
    return (
      <Container className="App">
        <h2>BitCoin Price</h2>
        <Form className="form" onSubmit={(e) => this.submitForm(e)}>
          <Col>
            <FormGroup>
              <Label>Start Date</Label>
              <Input type='date' name="startDate"
                onChange={(e) => {
                  this.handleChange(e)
                }} />
            </FormGroup>
          </Col>
          <Button>Submit</Button>
        </Form>
        <div name="evaluation" id="evaluation" className="white-text">{this.state.prices}</div>
      </Container>
    );
  }
}

export default App;
