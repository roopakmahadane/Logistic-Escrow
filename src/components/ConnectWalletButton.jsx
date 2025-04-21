import { useState, useEffect } from 'react'
import {ethers} from 'ethers';

export default function ConnectWallet(){
    const [walletAddress, setWalletAddress] = useState("");

    useEffect(() => {
        const checkConnectedWallet = async() => {
            if(window.ethereum){
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await provider.send("eth_accounts", []);
                    setWalletAddress(accounts[0]);
                    console.log("Connected address:", walletAddress[0]);
                      
            }
        }
        checkConnectedWallet();

        if(window.ethereum){
            window.ethereum.on('accountsChanged', (accounts) => {
                if(accounts.length> 0){
                    setWalletAddress(accounts[0]);
                }else{
                    setWalletAddress("");
                }
                
            })
        }

        return () => {
            if(window.ethereum && window.ethereum.removeListener){
                window.ethereum.removeListener('accountsChanged', () => {});
            }
        }
    },[])

    async function connectWallet(){
        if(window.ethereum){
            try{
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                setWalletAddress(accounts[0]);
                console.log("Connected address:", walletAddress[0]);
            } catch(err){
                console.error("User rejected connection", err);
            }
        }else{
            alert('Please install MetaMask!');
        }
    }
    return(
        
        <button class="bg-teal-700 text-amber-200 p-3 rounded-lg cursor-pointer hover:cursor-pointer hover:bg-teal-800 transition" onClick={connectWallet}>
            {walletAddress? `${walletAddress.slice(0,6)}...${walletAddress.slice(-6)}` : `Connect`}
            </button>
    )
}