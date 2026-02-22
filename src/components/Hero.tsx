import Logo from './Logo';

export default function Hero() {
    return(
        <div>
            <div className="glass">
                <div className="p-5 md:p-16">
                    <Logo
                        width={50}
                        height={50}
                    />

                    <div className="md:flex items-center mt-5">
                        <Logo width={20} className="ml-0 m-2"/>
                        <p className="uppercase">Home kit</p>
                    </div>

                    <div className="text-rotate py-2 text-2xl md:text-8xl">
                        <span className="uppercase">
                            <span className="font-black pl-0 p-2">Unigue Stores▶︎▶︎</span>
                        </span>
                    </div>

                    <div className="md:flex gap-10 my-5">
                        <div className="flex bg-base-100 gap-5 p-3 md:p-5">
                            <video 
                                src="null"
                                controls
                                width={100}
                                preload="metadata"
                                height={100}
                                poster="/video-placeholder.jpg"
                            ></video>
                            <div>
                                <p className="capitalize">How to use Unigue Stores</p>
                                <p className="text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae sed quos sint, reiciendis.</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 pt-5 md:p-5 md:w-1/2">
                            <p className='text-xs'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis repellat harum laborum minima, mollitia necessitatibus magnam optio dolorum rem incidunt eos praesentium. Mollitia fugiat itaque aliquam assumenda, atque aperiam? Dolor?</p>
                            <div className="flex justify-between items-center ">
                                <button className='btn btn-neutral'>
                                    Shop now
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                </button>
                                <div className='flex gap-5 md:gap-10'>
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}