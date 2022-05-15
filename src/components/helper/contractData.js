import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { nft_address, nft_abi } from '../../hooks/constant';
import { RPC_URLS } from '../../hooks/connectors';
import { RPC } from '../../hooks/constant';


export let singer =  new JsonRpcProvider(RPC_URLS[RPC]);

export async function getContract (library = null) {
    try{
        singer = library ? library.getSigner() : singer;
        let contract = new Contract(nft_address, nft_abi);
        return contract.connect(singer);
    }
    catch(err){
        console.log(err.message);
        return false;
    }
    
}


export async function getHasPresaleStarted()
{
    try{
        let nftContract = await getContract();
        let started = await nftContract.hasPresaleStarted();
        return started;
    }
    catch(err){
        console.log(err.message);
        return false;
    }
}


export async function getHasPublicsaleStarted()
{
    try{
        let nftContract = await getContract();
        let started = await nftContract.hasPublicSaleStarted();
        return started;
    }
    catch(err){
        console.log(err.message);
        return false;
    }
}

export async function getTokenPrice()
{
    try{
        let nftContract = await getContract();
        let started = await nftContract.tokenPrice();
        return started.toString() / Math.pow(10,18);
    }
    catch(err){
        console.log(err.message);
        return false;
    }
}

export async function getTotalSupply()
{
    try{
        let nftContract = await getContract();
        let supply = await nftContract.totalSupply();
        return supply.toString();
    }
    catch(err){
        console.log(err.message);
        return false;
    }
}

export async function checkWhitelistAddress(address=null)
{
    try{
        let nftContract = await getContract();
        let check = await nftContract.presaleWhitelist(address);
        return check;
    }
    catch(err){
        console.log(err.message);
        return false;
    }
}
export async function getMaxTokensPerMint()
{
    try{
        let nftContract = await getContract();
        let check = await nftContract.maxTokensPerMint();
        return check.toString();
    }
    catch(err){
        console.log(err.message);
        return false;
    }
}


export async function getPresaleWhitelistPurchased(address=null)
{
    try{
        let nftContract = await getContract();
        let check = await nftContract.presaleWhitelistPurchased(address);
        return check.toString();
    }
    catch(err){
        console.log(err.message);
        return false;
    }
}











