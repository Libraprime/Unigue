import Card from "./Card";
import Image from "next/image";


export default function Main_body() {
    const brands = ["Nike", "Adidas", "Puma", "Reebok", "Gucci", "Prada"];
    const scrollingBrands = [...brands, ...brands]; // Doubles the list for a smooth loop
    const PRODUCTS = [
        { id: 1, name: "Nike Air Max", category: "Footwear", price: "15,000", image: "data:image/..." },
        { id: 2, name: "Adidas Forum", category: "Footwear", price: "18,500", image: "data:image/..." },
        { id: 3, name: "Puma Suede", category: "Footwear", price: "12,000", image: "data:image/..." },
        // Add as many as you want here...
    ];

    const featuresData = [
        {
            imageSrc: 'https://cdn-icons-gif.flaticon.com/6455/6455041.gif',
            alt: 'Quality icon',
            title: 'Best Quality Material',
            description: 'Our product is made from at least 75% recycled polyester fibers'
        },
        {
            imageSrc: 'https://cdn-icons-gif.flaticon.com/6172/6172509.gif',
            alt: 'Payments icon',
            title: 'Secure Payments',
            description: 'Payments with a guaranteed level of security, you don\'t have to worry'
        },
        {
            imageSrc: 'https://cdn-icons-gif.flaticon.com/6172/6172512.gif',
            alt: 'Shipping icon',
            title: 'Free Shipping',
            description: 'Free shipping worldwide with appreciable conditions'
        },
    ];


    return (
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
                        <div className="flex flex-col md:flex-row gap-10">
                            <div className="w-64 md:m-5">
                                <p className="text-5xl pb-3 text-wrap">New Kids Collection</p>
                                <p className="text-wrap p-0.5">We are proud of our new collection and are proud to show them to you.</p>
                                <div className="flex gap-5 mt-32">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </div> 
                            </div>

                            <div className="flex overflow-x-auto gap-5 pb-5 snap-x mandatory scrollbar-hide">
                                {PRODUCTS.map((product) => (
                                    <Card product={product} key={product.id} />
                                ))}
                            </div>       
                        </div>

                        <div className="md:flex py-5 md:p-5">
                            {featuresData.map((feature, index) => (
                                <div key={index} className="flex flex-col items-center justify-center text-center gap-3">
                                    <Image
                                        src={feature.imageSrc}
                                        alt={feature.alt}
                                        width={50}
                                        height={50}
                                    />
                                    <p className='mt-5'>{feature.title}</p>
                                    <p className='px-10'>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
            </div>
            
        </div>
    )
}