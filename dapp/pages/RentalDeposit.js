import Head from 'next/head'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import rentalDepositContract from '../blockchain/rental'
import 'bulma/css/bulma.css'
import styles from '../styles/RentalDeposit.module.css'

const RentalDeposit = () => {
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [web3, setWeb3] = useState(null)
  const [address, setAddress] = useState(null)
  const [rdContract, setRdContract] = useState(null)
  const [depositAmt, setDepositAmt] = useState('')
  const [claimAmt, setClaimAmt] = useState('')
  const [depositHold, setDepositHold] = useState('')
  const [myDonutCount, setMyDonutCount] = useState('')

  useEffect(() => {
    if (rdContract) getDepositHoldHandler()
    // if (rdContract && address) getMyDonutCountHandler()
    if (rdContract && address) tenantOfferHandler()
  }, [rdContract, address])

  const getDepositHoldHandler = async () => {
    const depositHold = await rdContract.methods.value().call()
    setDepositHold(depositHold)
  }

  const updateDepositAmount = event => {
    // console.log(`amount :: ${event.target.value}`)
    setDepositAmt(event.target.value)
  }
  const tenantOfferHandler = async () => {
    try {
      await rdContract.methods.tenantOffer(depositAmt).send({
        from: address,
        value: web3.utils.toWei('1', 'ether') * depositAmt
      })
      setSuccessMsg(Offered`${depositAmt} as a deposit!`)

      if (rdContract) getDepositHoldHandler()
      // if (rdContract && address) getMyDonutCountHandler()
    } catch (err) {
      setError(err.message)
    }
  }

  // const tenantTerminateHandler
  
  // const ReturnDepositHandler
  
  const updateClaimAmount = event => {
    // console.log(`amount :: ${event.target.value}`)
    setClaimAmt(event.target.value)
  }
  // const damageClaimHandler


  const connectWalletHandler = async () => {
    /* check if MetaMask is installed */
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        /* request wallet connect */
        await window.ethereum.request({ method: "eth_requestAccounts" })
        /* create web3 instance and set to state var */
        const web3 = new Web3(window.ethereum)
        /* set web3 instance */
        setWeb3(web3)
        /* get list of accounts */
        const accounts = await web3.eth.getAccounts()
        /* set Account 1 to React state var */
        setAddress(accounts[0])

        /* create local contract copy */
        const rd = rentalDepositContract(web3)
        setRdContract(rd)

        window.ethereum.on('accountsChanged', async () => {
          const accounts = await web3.eth.getAccounts()
          console.log(accounts[0])
          /* set account 1 to React state */
          setAddress(accounts[0])
        })

      } catch (err) {
        setError(err.message)
      }
    } else {
      // meta mask is not installed
      console.log("Please install MetaMask")
    }
  }

  return (
    <div className={styles.main}>
      <Head>
        <title>RentalDeposit App</title>
        <meta name="description" content="rental deposit app" />
      </Head>
      <nav className="navbar mt-4 mb-4">
        <div className="container">
          <div className="navbar-brand">
            <h1>Homey's Rental Deposit with blockchain</h1>
          </div>
          <div className="navbar-end">
            <button onClick={connectWalletHandler} className="button is-primary">Connect Wallet</button>
          </div>
        </div>
      </nav>
      <section>
        <div className="container">
          <h2>Deposit Hold in contract: {depositHold}</h2>
        </div>
      </section>
      <section>
        <div className="container">
          {/* <h2>My donuts: {myDonutCount}</h2> */}
        </div>
      </section>
      <section className="mt-5">
        <div className="container">
          <div className="field">
            <label className="label">If you are a tenant</label>
            <div className="control">
              <input onChange={updateDepositAmount} className="input" type="type" placeholder="Enter deposit amount" />
            </div>
            <button
              onClick={tenantOfferHandler}
              className="button is-primary mt-2"
            >Make an offer to landlord</button>
            <div>
              <button
                // onClick={tenantTerminateHandler}
                className="button is-primary mt-2"
              >Terminate offer - you will not get the deposit back</button>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-5">
        <div className="container">
          <div className="field">
            <label className="label">If you are a landlord</label>
            <button
              // onClick={ReturnDepositHandler}
              className="button is-primary mt-2"
            >Confirm no asset damage - release deposit to tenant</button>
            <div className="control">
              <input onChange={updateClaimAmount} className="input" type="type" placeholder="Enter claim amount" />
            </div>
            <button
              // onClick={damageClaimHandler}
              className="button is-primary mt-2"
            >Release remaining deposit to tenant</button>
          </div>
        </div>
      </section>
      <section>
        <div className="container has-text-danger">
          <p>{error}</p>
        </div>
      </section>
      <section>
        <div className="container has-text-success">
          <p>{successMsg}</p>
        </div>
      </section>
    </div>
  )
}

export default RentalDeposit