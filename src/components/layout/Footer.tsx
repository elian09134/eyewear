export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="font-display text-lg font-bold text-white">LUMINA</h3>
                        <p className="mt-2 text-sm text-white/50">
                            Premium eyewear designed for the modern visionary. Experience clarity in style.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-white">Shop</h4>
                        <ul className="mt-4 space-y-2 text-sm text-white/50">
                            <li><a href="#" className="hover:text-white">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-white">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-white">Accessories</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-white">Support</h4>
                        <ul className="mt-4 space-y-2 text-sm text-white/50">
                            <li><a href="#" className="hover:text-white">FAQ</a></li>
                            <li><a href="#" className="hover:text-white">Shipping</a></li>
                            <li><a href="#" className="hover:text-white">Returns</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium text-white">Contact</h4>
                        <ul className="mt-4 space-y-2 text-sm text-white/50">
                            <li>Email: hello@lumina.com</li>
                            <li>WhatsApp: +1 234 567 890</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/30">
                    © {new Date().getFullYear()} Lumina Eyewear. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
