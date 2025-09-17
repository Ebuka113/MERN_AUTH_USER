import Header from "../components/Header"
import Navbar from "../components/Navbar"



function Home()  {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f8f9fb] via-[#eae4f9] to-[#dbe2ea]">
     
      <Navbar />
      <Header />
      
      </div>

  )
}

export default Home
