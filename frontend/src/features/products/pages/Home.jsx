import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useAuth } from '../../auth/hook/useAuth';

const Home = () => {
    const products = useSelector(state => state.product.products);
    const user = useSelector(state => state.auth.user);

    const { handleGetAllProducts } = useProduct();
    const { handleGetMe } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        handleGetAllProducts();
        if (!user) {
            handleGetMe();
        }
    }, []);

    const getImageUrl = (product) => {
        if (!product || !product.images || product.images.length === 0) return '/snitch_editorial_warm.png';
        const img = product.images[0];
        if (typeof img === 'string') return img;
        return img?.url || img?.secure_url || img?.preview || '/snitch_editorial_warm.png';
    };

    const formatPrice = (product) => {
        if (!product) return 'INR 0';
        const currency = product.price?.currency || product.priceCurrency || 'INR';
        const amount = product.price?.amount ?? product.priceAmount ?? (typeof product.price === 'number' ? product.price : null);
        if (amount !== null && amount !== undefined) {
            return `${currency} ${Number(amount).toLocaleString()}`;
        }
        return currency;
    };

    const userName = user ? (user.fullname || user.fullName || user.name || user.email) : null;
    const productCount = products?.length || 0;

    // Determine grid columns dynamically based on product count for optimal visual balance
    const getGridClass = () => {
        if (productCount === 1) return "grid grid-cols-1 max-w-[420px] mx-auto gap-8";
        if (productCount === 2) return "grid grid-cols-1 md:grid-cols-2 max-w-[860px] mx-auto gap-8 lg:gap-10";
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10";
    };

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="w-full min-h-screen selection:bg-[#C9A96E]/30 flex flex-col justify-between"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <div>
                    {/* ── 8. Header Navigation (Aligned with 1150px container) ── */}
                    <header className="w-full border-b border-[#e4e2df] py-5 bg-[#fbf9f6]">
                        <div
                            className="flex items-center justify-between gap-6"
                            style={{
                                width: 'min(1150px, calc(100% - 64px))',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                        >
                            {/* Brand Logo */}
                            <span
                                className="text-xl font-medium tracking-[0.32em] uppercase cursor-pointer"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                                onClick={() => navigate('/')}
                            >
                                VESTRO<span style={{ color: '#C9A96E' }}>.</span>
                            </span>

                            {/* User & Seller Actions */}
                            <div className="flex items-center gap-4">
                                {user ? (
                                    <div className="flex items-center gap-4">
                                        {/* User Badge */}
                                        <div className="flex items-center gap-2 px-3 py-1.5 border border-[#d0c5b5] bg-white/60">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                                            <span className="text-[10px] font-medium tracking-wider uppercase text-[#1b1c1a]">
                                                {userName}
                                            </span>
                                        </div>

                                        {/* Seller Hub CTA */}
                                        {(user.isSeller || user.role === 'seller') && (
                                            <button
                                                onClick={() => navigate('/seller/dashboard')}
                                                className="px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-medium border border-[#1b1c1a] text-[#1b1c1a] hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-all duration-300 cursor-pointer"
                                            >
                                                Seller Dashboard
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="text-xs uppercase tracking-[0.18em] font-medium text-[#7A6E63] hover:text-[#1b1c1a] transition-colors cursor-pointer px-2.5 py-1.5"
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            onClick={() => navigate('/register')}
                                            className="px-4 py-2 text-[10px] uppercase tracking-[0.18em] font-medium bg-[#1b1c1a] text-[#fbf9f6] hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all duration-300 cursor-pointer"
                                        >
                                            Register
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* ── Main Content Container (Centered 1150px) ── */}
                    <main
                        className="pt-8 pb-16 lg:pt-12 lg:pb-24 flex flex-col gap-10 lg:gap-14"
                        style={{
                            width: 'min(1150px, calc(100% - 64px))',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    >
                        {/* ── 1. Hero Banner (Compact & Balanced Vertical Spacing) ── */}
                        <section className="text-center flex flex-col items-center gap-3 py-2">
                            <span
                                className="text-[10px] uppercase tracking-[0.3em] font-medium"
                                style={{ color: '#C9A96E' }}
                            >
                                {userName ? `WELCOME BACK, ${userName.toUpperCase()}` : 'CURATED COLLECTION'}
                            </span>
                            <h1
                                className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight max-w-2xl"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                Minimalist Luxury & Quiet Elegance
                            </h1>
                            <p className="max-w-md text-xs text-[#7A6E63] leading-relaxed mt-0.5">
                                Discover our latest archive of essential fashion statements, crafted for effortless sophistication.
                            </p>
                            <div className="w-12 h-px mt-2" style={{ backgroundColor: '#C9A96E' }} />
                        </section>

                        {/* ── 2. Archive Products Section ── */}
                        <section className="flex flex-col gap-6 pb-6">
                            {/* 7. Archive Section Header Bar */}
                            <div className="flex items-center justify-between border-b border-[#e4e2df] pb-3">
                                <span className="text-[10px] uppercase tracking-[0.22em] font-medium text-[#7A6E63]">
                                    Archive Pieces
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.18em] text-[#B5ADA3]">
                                    {productCount} {productCount === 1 ? 'PRODUCT' : 'PRODUCTS'}
                                </span>
                            </div>

                            {/* Product Cards Grid */}
                            {products && products.length > 0 ? (
                                <div className={getGridClass()}>
                                    {products.map(product => {
                                        const imageUrl = getImageUrl(product);
                                        const priceText = formatPrice(product);

                                        return (
                                            <div
                                                key={product._id}
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                className="group cursor-pointer flex flex-col justify-between border border-[#e4e2df] transition-all duration-300 hover:border-[#1b1c1a] bg-white/40 overflow-hidden"
                                            >
                                                <div>
                                                    {/* 3 & 6. Image Container with Corner Price Badge */}
                                                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#eae8e5]">
                                                        <img
                                                            src={imageUrl}
                                                            alt={product.title || 'Product'}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => { e.currentTarget.src = '/snitch_editorial_warm.png'; }}
                                                        />
                                                        {/* 6. Clean Price Badge */}
                                                        <div className="absolute top-3 right-3 bg-[#1b1c1a]/95 text-[#fbf9f6] px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase backdrop-blur-sm border border-[#1b1c1a]">
                                                            {priceText}
                                                        </div>
                                                    </div>

                                                    {/* 4. Product Card Hierarchy (Title & Description) */}
                                                    <div className="p-5 flex flex-col gap-2">
                                                        <h3
                                                            className="text-lg sm:text-xl font-light text-[#1b1c1a] leading-snug truncate group-hover:text-[#C9A96E] transition-colors duration-300"
                                                            style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                                        >
                                                            {product.title || 'Untitled Piece'}
                                                        </h3>
                                                        {product.description && (
                                                            <p className="text-xs text-[#7A6E63] line-clamp-2 leading-relaxed">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* 5. View Piece Full-Width Interactive Button */}
                                                <div className="px-5 pb-5 pt-1">
                                                    <div className="w-full py-3 px-4 flex items-center justify-between border border-[#1b1c1a] bg-[#fbf9f6] text-[#1b1c1a] group-hover:bg-[#1b1c1a] group-hover:text-[#fbf9f6] transition-all duration-300 text-[10px] uppercase tracking-[0.22em] font-medium">
                                                        <span>VIEW PIECE</span>
                                                        <span className="text-xs group-hover:translate-x-1 transition-transform duration-300">
                                                            →
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-20 px-6 text-center border border-dashed border-[#d0c5b5] flex flex-col items-center justify-center gap-3">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#C9A96E]">
                                        Archive Empty
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-light text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                        No pieces currently available
                                    </h2>
                                    <p className="text-xs text-[#7A6E63] max-w-xs leading-relaxed">
                                        Our artisans are preparing our next release. Check back soon.
                                    </p>
                                </div>
                            )}
                        </section>
                    </main>
                </div>

                {/* ── 9. Footer (Proper spacing & alignment) ── */}
                <footer className="w-full border-t border-[#e4e2df] py-12 text-center mt-auto bg-[#f7f4ef]">
                    <div className="flex flex-col items-center gap-3">
                        <span
                            className="text-sm font-medium tracking-[0.35em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                        >
                            VESTRO.
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#B5ADA3]">
                            © {new Date().getFullYear()} VESTRO ARCHIVE. ALL RIGHTS RESERVED.
                        </span>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Home;

