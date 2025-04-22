import '../App.css'
import ConnectWallet from './ConnectWalletButton'
import { Link } from 'react-router-dom';

export default function Header() {
    return(
        <div className="flex items-center justify-between py-5 bg-white  w-screen bg-amber-300 px-10">
            <div className='flex'>
            <Link  to="/">
            <h1 className="text-4xl font-mono font-bold text-gray-800 ">EscrowFi</h1>
            </Link>
            <Link to="/createEscrow" className="hover:underline">
            <h3 className="p-2.5 ml-6 font-mono text-gray-700 font-bold">Create Escrow</h3>
            </Link>
            <Link to="/dashboard" className="hover:underline">
            <h3 className="p-2.5 ml-1 font-mono text-gray-700 font-bold">Dashboard</h3>
            </Link>
           
            </div>
            
           
            <ConnectWallet/>
        </div>
    )
}