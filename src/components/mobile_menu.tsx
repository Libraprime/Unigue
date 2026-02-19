export default function MobileMenu() {
    return (
        <div>
            <div>
                <p>Menu</p>

            </div>

            <div>

            </div>

            <div>
                <label htmlFor="search" className="input">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input id="search" type="search" required placeholder="Search" />
                </label>
                
            </div>
        </div>
    )
}