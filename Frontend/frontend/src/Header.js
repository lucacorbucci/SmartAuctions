import React, { Component } from "react";
import Web3 from "web3";
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "./config";
import Navbar from "./Components/Navbar"

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const englishAuction = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    this.setState({ englishAuction });

  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      isActive: false
    };

  }


  toggleNav = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive
    }))
  }

  render() {
    var links = ["/", "asteconcluse", "regolamento"]
    var menuItems = ["Home", "Aste concluse", "Regolamento"]
    return (
      <Navbar menuItems={menuItems} links={links}></Navbar>
    )
  }
}

export default App;
