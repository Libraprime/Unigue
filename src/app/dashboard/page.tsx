import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function DashboardPage() {
    const brands = ["Nike", "Adidas", "Puma", "Reebok", "Gucci", "Prada"];
    const scrollingBrands = [...brands, ...brands]; // Doubles the list for a smooth loop
  
    return (
        <div>
            <Navbar />
            <Hero />
            <div>
                <div className="flex p-5 opacity-50 overflow-hidden whitespace-nowrap">
                    <div className="flex gap-16 md:gap-36 animate-marquee">
                    {scrollingBrands.map((brand, index) => (
                        <div key={index} className="flex-shrink-0">
                        {brand}
                        </div>
                    ))}
                    </div>
                </div>

                <div>
                    <div className="">
                        <div className="p-5 md:px-10">
                            <div>
                                <div className="carousel rounded-box space-x-5">
                                    <div className="carousel-item">
                                        <div className="w-screen md:w-64 md:m-5">
                                            <p className="text-5xl pb-3 text-wrap">New Kids Collection</p>
                                            <p className="text-wrap">We are proud of our new collection and are proud to show them to you.</p>
                                            <div className="flex gap-5 mt-32">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                                </svg>

                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                            </div> 
                                        </div>
                                        
                                    </div>
                                    <div className="carousel-item">
                                        <img
                                        src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
                                        alt="Burger" />
                                    </div>
                                    <div className="carousel-item">
                                        <img
                                        src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
                                        alt="Burger" />
                                    </div>
                                    <div className="carousel-item">
                                        <img
                                        src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
                                        alt="Burger" />
                                    </div>
                                    <div className="carousel-item">
                                        <img
                                        src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
                                        alt="Burger" />
                                    </div>
                                    <div className="carousel-item">
                                        <img
                                        src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
                                        alt="Burger" />
                                    </div>
                                    <div className="carousel-item">
                                        <img
                                        src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
                                        alt="Burger" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
            </div>
            <Footer />
        </div>
    );
}