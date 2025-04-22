import Header from "./Header";
import { useState, useEffect } from 'react'
import {ethers, formatEther} from 'ethers';
import Escrow from '../../artifacts/contracts/Escrow.sol/Escrow.json';
import Loader from "./Loader";

export default function Dashboard(){
    const [createdByUser, setCreatedByUser] = useState([]);
    const [userIsArbiter, setUserIsArbiter] = useState([]);
    const [userIsDriver, setUserIsDriver] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(new Set());
    const [accountChanged, setAccountChanged] = useState(false);


    useEffect(() => {
        const handleAccountChange = (accounts) => {
            console.log("MetaMask account changed:", accounts[0]);
            setAccountChanged(prev => !prev);   
        }
        
        const fetchEscrowEvents = async() => {
            try {
                
                if(window.ethereum){
                    window.ethereum.on('accountsChanged', handleAccountChange )
                }

                setLoading(true);
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                const contract = await new ethers.Contract(
                    "0xFa1994bc4161F0Ff135691EE40Cda9f942A0f570",
                    Escrow.abi,
                    signer
                );
                const deploymentBlock = 8163756;

                const newEscrowEvents = await contract.queryFilter(contract.filters.NewEscrow(), deploymentBlock, 'latest');
                const userEscrow = await contract.queryFilter(contract.filters.NewEscrow(null, userAddress), deploymentBlock, 'latest');
                
                let byUser = [];
                for(let i = 0; i < userEscrow.length; i++) {
                    let escrow = await contract.escrows(userEscrow[i].args.id);
                    const resultArray = [...escrow];
                    byUser.push(resultArray);
                }
                
                console.log("Fetched escrows:", byUser);
                setCreatedByUser(byUser);

                const arbiterEvents = await contract.queryFilter(contract.filters.NewEscrow(null, null, userAddress), deploymentBlock, 'latest');
                let asArbiter = [];
                for(let i = 0; i < arbiterEvents.length; i++) {
                    let escrow = await contract.escrows(arbiterEvents[i].args.id);
                    const resultArray = [...escrow];
                    resultArray.push(arbiterEvents[i].args.id);
                    asArbiter.push(resultArray);
                }
                console.log(" as arbiter", asArbiter)
                setUserIsArbiter(asArbiter);

                const driverEvents = newEscrowEvents.filter(event => event.args.driver === userAddress);
                let asDriver = [];
                for(let i = 0; i < driverEvents.length; i++) {
                    let escrow = await contract.escrows(driverEvents[i].args.id);
                    const resultArray = [...escrow];
                    resultArray.push(driverEvents[i].args.id);
                    asDriver.push(resultArray);
                }
                console.log("asDriver",asDriver)
                setUserIsDriver(asDriver);
                
            } catch (error) {
                console.error("Error fetching escrow events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEscrowEvents();

        return () => {
            if(window.ethereum){
                window.ethereum.removeListener('accountsChanged', handleAccountChange);
            }
        }
    }, [accountChanged]);

    const getStatusText = (x) => {
        if (!x[4]) return "Yet to be picked";
        if (x[4] && !x[5]) return "On the way";
        if (x[4] && x[5] && !x[6]) return "Delivered";
        if (x[4] && x[5] && x[6]) return "Order completed";
    }
    const getButtonText = (x) => {
        if (!x[4]) return "Mark as Picked up";
        if (x[4] && !x[5]) return "Mark as Delivered";
        if (x[4] && x[5] && !x[6]) return "Release the amount";
        if (x[4] && x[5] && x[6])  return "Order completed";
        
    };

   

    const handleStatusChange = async(id) => {
        setIsDisabled(prev => new Set(prev).add(id));
        try {
            
            const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = await new ethers.Contract(
                    "0xFa1994bc4161F0Ff135691EE40Cda9f942A0f570",
                    Escrow.abi,
                    signer
                );
                const escrow = await contract.escrows(id);
        if(escrow.pickedUp == false){
            const markedPickedUp = await contract.markedPickedUp(id);
            await markedPickedUp.wait();
        }
        if(escrow.pickedUp && !escrow.delivered){
            const markDelivered = await contract.markDelivered(id);
            await markDelivered.wait();
        }
        if(escrow.pickedUp && escrow.delivered && !escrow.released){
            const markReleased = await contract.releaseToDriver(id);
            await markReleased.wait();
        }

        const updatedEscrow = await contract.escrows(id);
        const updatedArray = [...updatedEscrow];
        updatedArray.push(id);
        setUserIsDriver(prev =>
            prev.map(item => item[7] === id ? updatedArray : item)
        );
        setIsDisabled(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
     } catch(err){

            console.log("Transaction Cancel",err)
            setIsDisabled(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    }
    
    if (loading) {
        return (
            <div>
                <Header />
                <div className="flex">
                    <Loader />
                    <Loader />
                    <Loader />
                </div>
        
          </div>
        );
    }

    return(
        <div>
            <Header />
            <div className="w-screen h-screen m-0 p-0 md:flex md:flex-row md:justify-center md:align-middle">
                <div className="md:w-1/3 w-screen">
                    <h1 className="mt-20 text-2xl text-center font-mono font-light">Created by you</h1>
                    {createdByUser.length > 0 ? (
                        createdByUser.map((x, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 transform transition m-10 px-10 duration-500 ">
                                <p className="text-sm break-words">Driver: {x[1]}</p>
                                <p className="text-sm break-words">Recipient: {x[2]}</p>
                                <p className="text-sm break-words">Amount: {ethers.formatEther(x[3])} ETH</p>
                                <p className="text-sm break-words">Status: {getStatusText(x)}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center mt-4">No escrows created by you</div>
                    )}
                </div>

                <div className="md:w-1/3 w-screen">
                    <h1 className="mt-20 text-2xl text-center font-mono font-light">As Drivers</h1>
                    {userIsDriver.length > 0 ? (
                        userIsDriver.map((x) => (

                            <div className="bg-white rounded-2xl shadow-lg p-6 transform transition m-10 px-10 duration-500 ">
                                <p className="text-sm break-words">Customer: {x[0]}</p>
                                <p className="text-sm break-words">Recipient: {x[2]}</p>
                                <p className="text-sm break-words">Amount: {ethers.formatEther(x[3])} ETH</p>
                                <p className="text-sm break-words">Status: {getStatusText(x)}</p>
                                { (x[5]) ? null : <button  class={`${isDisabled.has(x[7]) ? "text-white bg-blue-400 cursor-not-allowed opacity-60 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" : "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"}`} 
                                onClick={() => handleStatusChange(x[7])}>
                                    {getButtonText(x)}
                                </button>}
                                
                            </div>
                        ))
                    ) : (
                        <div className="text-center mt-4">No escrows assigned to you as driver</div>
                    )}
                </div>

                <div className="md:w-1/3 w-screen">
                    <h1 className="mt-20 text-2xl text-center font-mono font-light">As arbiters</h1>
                    {userIsArbiter.length > 0 ? (
                        userIsArbiter.map((x) => (
                            <div className="bg-white rounded-2xl shadow-lg p-6 transform transition m-10 px-10 duration-500 ">
                                <p className="text-sm break-words">Customer: {x[0]}</p>
                                <p className="text-sm break-words">Driver: {x[1]}</p>
                                <p className="text-sm break-words">Amount: {ethers.formatEther(x[3])} ETH</p>
                                <p className="text-sm break-words">Status: {getStatusText(x)}</p>
                                { (x[5]) && !x[6]? <button  class={`${isDisabled.has(x[7]) ? "text-white bg-blue-400 cursor-not-allowed opacity-60 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" : "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"}`} 
                                onClick={() => handleStatusChange(x[7])}>
                                    {getButtonText(x)}
                                </button>: null}
                            </div>
                        ))
                    ) : (
                        <div className="text-center mt-4">No escrows assigned to you as arbiter</div>
                    )}
                </div>
            </div>
        </div>
    );
}