import Header from "./Header";
import { useState, useEffect } from 'react'
import {ethers} from 'ethers';
import Escrow from '../../artifacts/contracts/Escrow.sol/Escrow.json';

export default function Dashboard(){

    const [createdByUser, setCreatedByUser] = useState([]);
    const [userIsArbiter, setUserIsArbiter] = useState([]);
    const [userIsDriver, setUserIsDriver] = useState([]);
    useEffect(() => {

        const fetchEscrowEvents = async() => {
            const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const contract = await new ethers.Contract(
            "0xFa1994bc4161F0Ff135691EE40Cda9f942A0f570",
                Escrow.abi,
                signer
        )
        const deploymentBlock = 8163756

        const newEscrowEvents = await contract.queryFilter(contract.filters.NewEscrow(), deploymentBlock, 'latest');
        const createdByUser = await contract.queryFilter(contract.filters.NewEscrow(null, userAddress ), deploymentBlock, 'latest');
        const userIsArbiter = await contract.queryFilter(contract.filters.NewEscrow(null, null, userAddress ), deploymentBlock, 'latest');

        const userIsDriver = newEscrowEvents.filter(event => 
           // console.log("inside filter", event.args.driver, userAddress);
             event.args.driver == userAddress );

      
        setCreatedByUser(createdByUser);
        setUserIsArbiter(userIsArbiter);
        setUserIsDriver(userIsDriver);
        console.log(userIsDriver, "user Driver")
        console.log("driver", newEscrowEvents[0].args.driver )
        console.log("userAdd", userAddress);
        console.log("all events", newEscrowEvents);
        console.log(createdByUser, "Created by user");
        console.log(userIsArbiter, "Arbiter user");
        console.log(userIsDriver, "driver user");
        }
        fetchEscrowEvents();


    },[])



    return(
        <div>
            < Header />
            {/* {createdByUser.map(x => {
                <h3>{x.id}</h3>
            })} */}
        </div>
    )
}