import '../App.css'
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
    return(
        <div class=" w-[100%] h-[100%] mx-auto my-5 px-10 flex items-center justify-center">
        <div class="bg-white rounded-2xl w-[100%] h-[100%] shadow-lg p-6  transform transition duration-500 hover:scale-102 hover:shadow-2xl flex flex-col justify-center">
          <h2 class="text-5xl font-bold text-gray-800 mb-10">🚛 Escrow that delivers trust.</h2>
          <p class="w-7/12 mb-15 text-gray-600 mt-2 text-3xl">Secure your delivery chain with smart escrow connections—fast, reliable, and built for trust at every step.</p>
          <button onClick={() => navigate('/createEscrow')} class="mt-4 w-24 px-4 py-2 bg-amber-200 w- text-black rounded hover:cursor-pointer hover:bg-amber-300 transition">
            Try Me
          </button>
        </div>
      </div>
    )
}