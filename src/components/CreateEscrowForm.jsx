import Header from "./Header";
import { useState, useEffect } from 'react'
import {ethers} from 'ethers';
import Escrow from '../../artifacts/contracts/Escrow.sol/Escrow.json';

export default function CreateEscrow(){

    const [driverAddress, setDriverAddress] = useState("");
    const [arbiterAddress, setArbiterAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [escrowsubmitted, setEscrowSubmitted] = useState(false);
    const [transactionBlockId, setTransactionBlockId] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        if (!window.ethereum) {
            alert("Please install MetaMask to continue.");
            return;
          }
       
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                "0xFa1994bc4161F0Ff135691EE40Cda9f942A0f570",
                Escrow.abi,
                signer
            ) 
            const amountInWei = ethers.parseEther(amount);
            const tx = await contract.createEscrow(arbiterAddress, driverAddress, {value: amountInWei});
            const receipt = await tx.wait();
            if(receipt.status){
                setLoading(false);
                setEscrowSubmitted(true);
                setTransactionBlockId(receipt.blockNumber)
            }
    }

    return(
        <div>
            <Header />

            <form onSubmit={handleSubmit} class="max-w-sm mx-auto mt-20">
  <div class="mb-5">
      <label for="driver-address" class="block  mt-2 text-lg font-medium text-gray-900 dark:text-gray-900">Driver Wallet Address</label>
      <input value={driverAddress} onChange={(e) => setDriverAddress(e.target.value)} type="text" id="driver-address" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
  </div>
  <div class="mb-3">
      <label for="arbiter-address" class="block  mt-2 text-lg font-medium text-gray-900 dark:text-gray-900">Recipient (Arbiter) Address</label>
      <input value={arbiterAddress} onChange={(e) => setArbiterAddress(e.target.value)} type="text" id="arbiter-address" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
  </div>
  <div class="mb-5">
      <label for="amount" class="block  mt-2 text-lg font-medium text-gray-900 dark:text-gray-900">Amount in ETH</label>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} type="text" id="amount" class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
  </div>
  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">Create Escrow</button>
</form>
{loading && (
    <div class="text-center mt-4 text-blue-600 font-semibold">
        Processing transaction...
    </div>
)}
{escrowsubmitted && !loading && (
    <div class="text-center mt-4 text-green-600 font-semibold">
     ✅ Transaction confirmed in block:   <a class="dark:text-blue-500 underline" target="_blank" href={`https://sepolia.etherscan.io/block/${transactionBlockId}`}>{transactionBlockId}</a> 
    </div>
)}
        </div>
    )
}