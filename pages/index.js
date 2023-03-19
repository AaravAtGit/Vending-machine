import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [DonutBalance,setDonutBalance] = useState(0)

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }


const update_donut_balance = async() => {
  if (atm) {
    setDonutBalance((await atm.getDonutBalance()).toNumber())
  }
}

const buy_donut = async() => {
  if (atm) {
    let tx = await atm.buyDonuts();
    await tx.wait()
    getBalance();
    update_donut_balance();
  }
}

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this Machine.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
      update_donut_balance();
    }

    return (
      <div style={{backgroundColor: "#f2f2f2", border: "1px solid #ddd", borderRadius: "10px", padding: "20px", width: "400px", margin: "0 auto", textAlign: "center"}}>
        <h2 style={{fontSize: "28px", marginBottom: "20px"}}>Your Account</h2>
        <div style={{marginBottom: "10px"}}>
          <p style={{display: "inline-block", marginRight: "10px", fontWeight: "bold"}}>Address:</p>
          <p style={{display: "inline-block", wordBreak: "break-all"}}>{account}</p>
        </div>
        <div style={{marginBottom: "10px"}}>
          <p style={{display: "inline-block", marginRight: "10px", fontWeight: "bold"}}>Balance:</p>
          <p style={{display: "inline-block"}}>{balance}</p>
        </div>
        <div style={{marginBottom: "10px"}}>
          <p style={{display: "inline-block", marginRight: "10px", fontWeight: "bold"}}>Donuts:</p>
          <p style={{display: "inline-block"}}>{DonutBalance}</p>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", marginTop: "20px"}}>
          <button style={{backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "5px", fontSize: "18px", padding: "10px 20px", cursor: "pointer", transition: "all 0.3s ease"}} onClick={deposit}>Deposit 1 ETH</button>
          <button style={{backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px", fontSize: "18px", padding: "10px 20px", cursor: "pointer", transition: "all 0.3s ease"}} onClick={withdraw}>Withdraw 1 ETH</button>
          <button style={{backgroundColor: "#FFC107", color: "white", border: "none", borderRadius: "5px", fontSize: "18px", padding: "10px 20px", cursor: "pointer", transition: "all 0.3s ease"}} onClick={buy_donut}>Buy Donut</button>
        </div>
      </div>
    );
    
    
      
  }

  useEffect(() => {getWallet(); getBalance();}, [balance]);

  return (
    <main className="container">
      <header><h1>Welcome to the a... Vending Machine?</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}


