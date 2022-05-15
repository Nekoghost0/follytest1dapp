import React, { useEffect, useState } from 'react'
import * as contractdata from '../components/helper/contractData';
import { totalNFTCount, presalecountdown, publicsalecountdown } from '../hooks/constant';
import Countdown from "react-countdown";
import { useWeb3React } from "@web3-react/core";
import { parseUnits } from '@ethersproject/units';
import { toast } from "react-toastify";
import loadingimg from '../images/loading.gif';
import {Facebook} from 'react-content-loader'
import ConnectButton from './helper/ConnectButton';

export default function SaleCard() {
    const context = useWeb3React();
    const { account, error, library } = context;
    const [totalSupply, setTotalSupply] = useState('...');
    const [presaleStart, setPresaleStart] = useState('');
    const [publicsaleStart, setPublicsaleStart] = useState('');
    const [usewhitelist, setUserwhitelist] = useState(false);
    const [refresh, setRefresh] = useState(new Date());
    const [maxtokenBuy, setMaxtokenBuy] = useState(0);
    const [tokenprice, setTokenprice] = useState(0.077);
    const [counter, setCounter] = useState(1);
    const [loading, setLoading] = useState('none');
    const [getdata, setGetdata] = useState(false);
    const [totalAmount , setTotalAmount ] = useState(0);

    useEffect(() => {
        async function saleData() {
            let presale_start = await contractdata.getHasPresaleStarted();
            let public_start = await contractdata.getHasPublicsaleStarted();
            setPresaleStart(presale_start);
            setPublicsaleStart(public_start);
            setGetdata(true);
        }
        saleData();
    }, [presaleStart, publicsaleStart]);

    useEffect(() => {
        async function tokenPriceset() {
            try {
                let tokenPrice = await contractdata.getTokenPrice();
                setTokenprice(tokenPrice)
            }
            catch (err) {
                console.log(err.message);
                setTokenprice(0)
            }
        }
        tokenPriceset();
    }, [tokenprice]);


    useEffect(() => {
        async function setTokenData() {
            let maxTokenBuy = await contractdata.getMaxTokensPerMint();
            if (account && !error && maxTokenBuy) {
                contractdata.checkWhitelistAddress(account).then(async (result) => {
                    setUserwhitelist(result);
                    if (presaleStart && !publicsaleStart) {
                        let WhitelistPurchased = await contractdata.getPresaleWhitelistPurchased(account);
                        console.log(WhitelistPurchased)
                        maxTokenBuy = maxTokenBuy - WhitelistPurchased;
                        setMaxtokenBuy(maxTokenBuy);
                    }
                });
            }
            else if (maxTokenBuy) {
                setMaxtokenBuy(maxTokenBuy);
            }
        }
        setTokenData();
    }, [account, error, presaleStart, publicsaleStart, maxtokenBuy, refresh]);


    useEffect(() => {
        async function nftData() {
            let total_supply = await contractdata.getTotalSupply();
            setTotalSupply(total_supply);
        }

        nftData();
    }, [totalSupply , refresh]);

    const whitelistcountdown = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {

            return (
                <>
                </>
            );
        } else {
            // Render a countdown
            return (
                <div id="countdown">
                    <ul>
                        <li><span id="days">{days}</span>days</li>
                        <li><span id="hours">{hours}</span>Hours</li>
                        <li><span id="minutes">{minutes}</span>Minutes</li>
                        <li><span id="seconds">{seconds}</span>Seconds</li>
                    </ul>
                </div>

            );

        }
    };

    const handleMinusCounter = () => {
        if (counter > 1) {
            setCounter(prevCounter => prevCounter - 1);
            setTotalAmount(parseFloat(counter - 1) *  tokenprice )
        }
    }

    const handlePlusCounter = () => {
        if (counter < maxtokenBuy) {
            setCounter(prevCounter => prevCounter + 1);
            setTotalAmount(parseFloat(counter + 1) *  tokenprice )
        }
    }

    const handleMaxButton = () => {
        setCounter(maxtokenBuy);
        setTotalAmount(parseFloat(maxtokenBuy) *  tokenprice )
    }

    const handleBuyToken = async () => {
        try {
            setLoading('inline-block');
            if (account) {
                let public_start = await contractdata.getHasPublicsaleStarted();
                let pre_start = await contractdata.getHasPresaleStarted();
                if (public_start && pre_start) {
                    if (counter > 0) {
                        const nft_contract = await contractdata.getContract(library);
                        let token_price = await contractdata.getTokenPrice();
                        let total_price = counter * token_price;

                        let user_balance = await library.getBalance(account);
                        user_balance = user_balance.toString() / Math.pow(10, 18);

                        if (parseFloat(user_balance) > parseFloat(total_price)) {
                            let tx = await nft_contract.mint(counter, { 'from': account, 'value': parseUnits(total_price.toString()) });
                            let response = await tx.wait();
                            if (response) {
                                if (response.status === 1) {
                                    toast.success('success ! Your Last Transaction is Successfull.');
                                    setLoading('none');
                                    setRefresh(new Date());
                                }
                                else if (response.status === 0) {
                                    toast.error('error ! Your Last Transaction is Failed.');
                                    setLoading('none');
                                }
                                else {
                                    toast.error('error ! something went wrong.');
                                    setLoading('none');
                                }
                            }
                            else {
                                toast.error('Opps ! Your adddress is not whitelisted!');
                                setLoading('none');
                            }
                        }
                        else {
                            toast.error('Opps !Insufficient funds for transfer!');
                            setLoading('none');
                        }
                    }
                    else {
                        toast.error('Required Minimum 1 value for mint !');
                        setLoading('none');
                    }
                }
                else if (pre_start) {
                    let checkWhitelist = await contractdata.checkWhitelistAddress(account);
                    if (checkWhitelist) {
                        if (counter > 0) {
                            const nft_contract = await contractdata.getContract(library);
                            let token_price = await contractdata.getTokenPrice();
                            let total_price = parseFloat(counter) * token_price;
                            let user_balance = await library.getBalance(account);
                            user_balance = user_balance.toString() / Math.pow(10, 18);

                            if (parseFloat(user_balance) > parseFloat(total_price)) {
                                let tx = await nft_contract.mint(counter, { 'from': account, 'value': parseUnits(total_price.toString()) });
                                let response = await tx.wait();
                                if (response) {
                                    if (response.status === 1) {
                                        toast.success('success ! Your Last Transaction is Successfull.');
                                        setLoading('none');
                                        setRefresh(new Date());
                                    }
                                    else if (response.status === 0) {
                                        toast.error('error ! Your Last Transaction is Failed.');
                                        setLoading('none');
                                    }
                                    else {
                                        toast.error('error ! something went wrong.');
                                        setLoading('none');
                                    }
                                }
                                else {
                                    toast.error('Opps ! Your adddress is not whitelisted!');
                                    setLoading('none');
                                }
                            }
                            else {
                                toast.error('Opps !Insufficient funds for transfer!');
                                setLoading('none');
                            }
                        }
                        else {
                            toast.error('Required Minimum 1 value for mint !');
                            setLoading('none');
                        }
                    }
                    else {
                        toast.error('Opps ! Your Address is not Whitelisted !');
                        setLoading('none');
                    }
                }
                else {
                    toast.error('Sale not stared yet !');
                    setLoading('none');
                }
            }
            else {
                toast.error(`Please Connect Wallet !`);
                setLoading('none');
            }

        }
        catch (err) {
            typeof err.data !== 'undefined' ? toast.error(err.data.message) : toast.error(err.message)
            // toast.error(typeof err.data.message !== 'undefined' ? err.data.message : err.message  );
            setLoading('none');
        }
    }


    if (presaleStart && publicsaleStart && getdata) {
        return (
            <>
                <div className="card-body">
                    <div className="text-center countdown-text fw-bold">
                        <h3>Public Minting Open!!</h3>
                    </div>

                    <h5 className="text-center totalsupply-text" >{totalSupply} / {totalNFTCount}</h5>
                    <div id="mintContainer" className="mint-container mt-3">
                        <div className="info-container">
                            <div>
                                <h6 className="fw-bold">Price Per Mint</h6>
                                <p id="pricePerMint">{tokenprice} ETH</p>
                            </div>
                            <div>
                                <h6 className="fw-bold">Max</h6>
                                <p id="maxPerMint">{maxtokenBuy}</p>
                            </div>
                        </div>
                        <div className="mint-qty text-center">
                            <span>
                                <button className="input-number-decrement btn1" id="mintDecrement" onClick={handleMinusCounter}>
                                    –
                                </button>
                                <input id="mintInput" className="input-number btn1" type="number" value={counter} readOnly />
                                <button className="input-number-increment btn1" id="mintIncrement" onClick={handlePlusCounter}>
                                    +
                                </button>
                            </span>
                            <button id="setQtyMax" className="btn1" onClick={handleMaxButton}>SET MAX</button>
                        </div>
                        <div className="total-price-container">
                            <h6 className="fw-bold text-info">Total - {parseFloat(totalAmount.toFixed(3))} ETH</h6>
                            
                        </div>
                        {account ? (
                        <button className="hero-btn btn1 mint-btn" onClick={handleBuyToken}>
                            <img src={loadingimg} alt="loading-img" style={{ "display": loading }} />Mint</button>) : 
                            <ConnectButton/>
                        }
                    </div>
                </div>
            </>
        );
    }
    else if (presaleStart && !usewhitelist && getdata) {
        return (
            <>
                <div className="card-body">
                    <div className="text-center countdown-text fw-bold">
                        <Countdown key={Math.floor((Math.random() * 10) + 1)} date={publicsalecountdown} renderer={whitelistcountdown} />
                        <h6>Public Minting Countdown</h6>
                    </div>
                    <div className='text-center countdown-text fw-bold '>
                        Pre-sale Minting Open!!
                    </div>
                    {account ? (
                        <>
                        <p className='text-center'>You are not whitelisted for the pre-sale..😢</p>
                        <button className="hero-btn btn1 mint-btn">Join Community</button> 
                        </>
                        ) : 
                            <ConnectButton/>
                        }
                    
                </div>
            </>
        );
    }
    else if (presaleStart && usewhitelist && getdata) {
        return (
            <>
                <div className="card-body">
                    <div className="text-center countdown-text fw-bold">
                        <Countdown key={Math.floor((Math.random() * 10) + 1)} date={publicsalecountdown} renderer={whitelistcountdown} />
                        <h3>Pre-Sale Minting Open!!</h3>
                    </div>

                    <h5 className="text-center totalsupply-text" >{totalSupply} / {totalNFTCount}</h5>
                    <p className='text-center'>You're on the whitelist for the Pre-sale🎉</p>
                    <div id="mintContainer" className="mint-container mt-3">
                        <div className="info-container">
                            <div>
                                <h6 className="fw-bold">Price Per Mint</h6>
                                <p id="pricePerMint">{tokenprice} MATIC</p>
                            </div>
                            <div>
                                <h6 className="fw-bold">Max</h6>
                                <p id="maxPerMint">{maxtokenBuy}</p>
                            </div>
                        </div>
                        <div className="mint-qty text-center">
                            <span>
                                <button className="input-number-decrement btn1" id="mintDecrement" onClick={handleMinusCounter}>
                                    –
                                </button>
                                <input id="mintInput" className="input-number btn1" type="number" value={counter} readOnly />
                                <button className="input-number-increment btn1" id="mintIncrement" onClick={handlePlusCounter}>
                                    +
                                </button>
                            </span>
                            <button id="setQtyMax" className="btn1" onClick={handleMaxButton}>SET MAX</button>
                        </div>
                        <div className="total-price-container">
                            <h6 className="fw-bold text-info">Total</h6>
                            <p></p>
                        </div>
                        {account ? (
                        <button className="hero-btn btn1 mint-btn" onClick={handleBuyToken}>
                            <img src={loadingimg} alt="loading-img" style={{ "display": loading }} />Mint</button>) : 
                            <ConnectButton/>
                        }
                    </div>
                </div>
            </>
        );
    }
    else if (!presaleStart && !publicsaleStart && getdata) {
        return (
            <>
                <div className="card-body">
                    <div className="text-center countdown-text fw-bold">
                        <Countdown key={Math.floor((Math.random() * 10) + 1)} date={presalecountdown} renderer={whitelistcountdown} />
                        <h6>Pre-Sale Minting Countdown</h6>
                    </div>
                    <div className='text-center countdown-text fw-bold '>
                        NFT Drop Coming Soon!!
                    </div>
                    <p className='text-center'>we are working hard to launch the NFT Collection stay tuned for update!</p>
                    
                    {account ? (
                        <button className="hero-btn btn1 mint-btn">Go on The whitelist</button>) : 
                            <ConnectButton/>
                        }
                </div>
            </>
        );
    }
    else {
        return (
            <>
                <div className="card-body">
                    <div className="text-center countdown-text fw-bold">
                        <Facebook />
                    </div>
                </div>
            </>
        );
    }

}
