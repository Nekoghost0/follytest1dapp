import React, { useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap-button-loader';
import { parseUnits } from '@ethersproject/units';
import { getContract  } from './contractData';
import {metadata_path} from '../../hooks/constant';


export default function BuyButton(props) {

    const context = useWeb3React();
    const { library, account } = context;

    const [loading, setLoading] = useState(false);
    

    const handleBuytoken = async () => {
        try {
            setLoading(true);
            if (account) {
                if(props.counter > 0){
                    const nft_contract = await getContract(library);
                    let price = await nft_contract.price();
                    price = parseFloat(price.toString() / Math.pow(10,18));
                    let total_price = parseFloat(props.counter) * price;
                    let user_balance = await library.getBalance(account);
                    user_balance = user_balance.toString() / Math.pow(10,18);
                    
                    if(parseFloat(user_balance) > parseFloat(total_price))
                    {
                        let path = `${metadata_path}/${props.jsonno}.json`;
                    
                        let tx = await nft_contract.mint(props.counter, path , { 'from': account, 'value': parseUnits(total_price.toString()) });
                        let response = await tx.wait();
                        if (response) {
                            if (response.status === 1) {
                                toast.success('success ! Your Last Transaction is Successfull.');
                                setLoading(false);
                            }
                            else if (response.status === 0) {
                                toast.error('error ! Your Last Transaction is Failed.');
                                setLoading(false);
                            }
                            else {
                                toast.error('error ! something went wrong.');
                                setLoading(false);
                            }
                        }
                        else {
                            toast.error('Opps ! Your adddress is not whitelisted!');
                            setLoading(false);
                        }
                    }
                    else{
                        toast.error('Opps !Insufficient funds for transfer!');
                        setLoading(false);
                    }
                }
                else{
                    toast.error('Required Minimum 1 value for mint !');
                    setLoading(false);
                }
            }
            else {
                toast.error(`Please Connect Wallet !`);
                setLoading(false);
            }
        }
        catch (err) {
            typeof err.data !== 'undefined' ? toast.error(err.data.message) : toast.error(err.message)
            // toast.error(typeof err.data.message !== 'undefined' ? err.data.message : err.message  );
            setLoading(false);
        }
    }

    

    
    
      
    
    

    return (
        <>
            <ToastContainer />
                <span className='sync-icon' onClick={props.handleChangeImage}>
                    <i className="fas fa-2x fa-sync my-3" style={{"cursor": "pointer"}}></i><br/> Random Generate NFT</span>
            <div className="qty mt-5">
                <span className="minus bg-dark" onClick={props.handleMinusCounter}>-</span>
                <span className="count input-counter mx-2">{props.counter}</span>
                <span className="plus bg-dark" onClick={props.handlePlusCounter}>+</span>

            </div>
            <Button loading={loading} className="btn btn-main mt-3" onClick={handleBuytoken}>Buy</Button>
        </>
    )
}
