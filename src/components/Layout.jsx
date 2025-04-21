import Header from './Header'
import Hero from './HeroSection'


export default function Layout(){
    return(
        <div>
        <div class="w-screen flex flex-col h-screen">
        <Header />
        <Hero />
      </div>
      </div>
    )
}