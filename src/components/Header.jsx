import '../App.css'
import ConnectWallet from './ConnectWalletButton'

export default function Header() {
    return(
        <div className="flex items-center justify-between py-5 bg-white  w-screen bg-amber-300 px-10">
            <h1 className="text-4xl font-mono font-bold text-gray-800 ">Escrow Connect</h1>
            <ConnectWallet/>
        </div>
    )
}