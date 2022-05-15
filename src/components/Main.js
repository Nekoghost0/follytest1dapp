import React from 'react'
// import ConnectButton from './helper/ConnectButton';
// import logo from '../images/Logo.png';
// import header_logo from '../images/header-logo.png';
// import discord from '../images/discord.png';
// import twitter from '../images/twitter.png';
// import instagram from '../images/instagram.png';
// import opensea from '../images/opensea.svg';
import SaleCard from './SaleCard';




export default function Main() {


    return (

        // <div className='sc-jSgvzq jZTiFu'>
            <div className="main-wrapper">
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-sm-12 col-md-12 col-lg-12">

                            <div className="row justify-content-center">
                                <div className="col-sm-12 col-lg-6 card-top">
                                    <div className="card">
                                        <SaleCard />
                                    </div>
                                </div>
                            </div>

                            <p className="text-center mt-4 mx-4">Please make sure you are connected to the right network (Ethereum Mainnet) and the correct address. Please note: Once you make the purchase, you cannot undo this action.</p>
                            <p className="text-center mx-4">We have set the gas limit to 285000 for the contract to successfully mint your NFT. We recommend that you don't lower the gas limit.</p>
                        </div>
                    </div>
                </div>
            </div>
        // </div>
       

            /* <nav className="navbar navbar-expand-lg  navbar-expand-ms navbar-dark bg-dark">
                <div className="container-fluid">

                    <a className="navbar-brand nav-img" href="#section">
                        <img src={header_logo} height="32px" width="151px" alt="head-logo" />
                    </a>

                    <ul className="float-right mb-2 mb-lg-0">
                        <li className="nav-item">
                            <img src={discord} className="img-social" alt="discord-img" />
                        </li>
                        <li className="nav-item">
                            <img src={twitter} className="img-social" alt="discord-img" />
                        </li>
                        <li className="nav-item">
                            <img src={opensea} className="img-social" alt="discord-img" />
                        </li>
                        <li className="nav-item">
                            <img src={instagram} className="img-social" alt="discord-img" />
                        </li>
                        <li className="nav-item nav-connect-right">
                            <ConnectButton />
                        </li>

                    </ul>
                </div>
            </nav> */



    /* <footer className="footer mt-auto py-0 px-0">
                <div className="container align-content-center">
                    <div className="d-flex justify-content-center bd-highlight">
                        <p><img src={header_logo} height="32px" width="151px" alt="header-logo" /></p>

                    </div>
                    <div className="d-flex justify-content-center bd-highlight">
                        <p>Copyright © 2022 Folly Apes</p>
                    </div>
                    <div className="d-flex justify-content-center bd-highlight">
                        <p >Back to Homepage | Privacy Policy</p>
                    </div>
                </div>
            </footer> */
       
    )
}