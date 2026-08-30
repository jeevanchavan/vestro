import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useAuth } from '../../auth/hook/useAuth';

// Fallback high-quality editorial fashion images matching Vestro luxury aesthetic
const EDITORIAL_GALLERY_FALLBACKS = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80'
];

const ProductDetail = () => {
    const { productId } = useParams();
    const { handleGetProductDetails } = useProduct();
    const { handleGetMe } = useAuth();
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [addedToCart, setAddedToCart] = useState(false);

    const fetchProductDetail = async () => {
        setLoading(true);
        try {
            const data = await handleGetProductDetails(productId);
            setProduct(data);
        } catch (err) {
            console.error("Failed to fetch product details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetail();
        if (!user) {
            handleGetMe();
        }
    }, [productId]);

    const getImages = (prod) => {
        const productImgs = [];
        if (prod && prod.images && prod.images.length > 0) {
            prod.images.forEach(img => {
                const url = typeof img === 'string' ? img : (img?.url || img?.secure_url || img?.preview);
                if (url) productImgs.push(url);
            });
        }

        // Fill up to 5 distinct images with editorial fallbacks if product has fewer
        const combined = [...productImgs];
        EDITORIAL_GALLERY_FALLBACKS.forEach(fallback => {
            if (combined.length < 5 && !combined.includes(fallback)) {
                combined.push(fallback);
            }
        });

        return combined.length > 0 ? combined : EDITORIAL_GALLERY_FALLBACKS;
    };

    const formatPrice = (prod) => {
        if (!prod) return 'INR 0';
        const currency = prod.price?.currency || prod.priceCurrency || 'INR';
        const amount = prod.price?.amount ?? prod.priceAmount ?? (typeof prod.price === 'number' ? prod.price : null);
        if (amount !== null && amount !== undefined) {
            return `${currency} ${Number(amount).toLocaleString()}`;
        }
        return currency;
    };

    const userName = user ? (user.fullname || user.fullName || user.name || user.email) : null;
    const imagesList = getImages(product);
    const activeImage = imagesList[selectedImageIndex] || imagesList[0];

    const handlePrevImage = () => {
        setSelectedImageIndex(prev => (prev === 0 ? imagesList.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setSelectedImageIndex(prev => (prev === imagesList.length - 1 ? 0 : prev + 1));
    };

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleBuyNow = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        alert(`Proceeding to checkout for ${product?.title || 'Product'}`);
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
                    {/* ── Header Navigation ── */}
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

                            {/* Navigation & User Actions */}
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => navigate('/')}
                                    className="text-xs uppercase tracking-[0.18em] font-medium text-[#7A6E63] hover:text-[#1b1c1a] transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                    <span className="text-sm">←</span> BACK TO ARCHIVE
                                </button>

                                {user ? (
                                    <div className="flex items-center gap-2 px-3 py-1.5 border border-[#d0c5b5] bg-white/60">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                                        <span className="text-[10px] font-medium tracking-wider uppercase text-[#1b1c1a]">
                                            {userName}
                                        </span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-xs uppercase tracking-[0.18em] font-medium text-[#7A6E63] hover:text-[#1b1c1a] transition-colors cursor-pointer px-2 py-1"
                                    >
                                        SIGN IN
                                    </button>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* ── Main Content Container (Centered 1150px) ── */}
                    <main
                        className="pt-8 pb-16 lg:pt-12 lg:pb-24"
                        style={{
                            width: 'min(1150px, calc(100% - 64px))',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    >
                        {loading ? (
                            /* Loading State */
                            <div className="py-28 text-center flex flex-col items-center justify-center gap-4">
                                <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] uppercase tracking-[0.25em] text-[#7A6E63]">
                                    Fetching Archive Piece...
                                </span>
                            </div>
                        ) : !product ? (
                            /* Empty / Not Found State */
                            <div className="py-24 px-6 text-center border border-dashed border-[#d0c5b5] flex flex-col items-center justify-center gap-4">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#C9A96E]">
                                    Piece Not Found
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-light text-[#1b1c1a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    Requested Item Unavailable
                                </h2>
                                <p className="text-xs text-[#7A6E63] max-w-xs leading-relaxed">
                                    The product details could not be loaded or the item has been removed from the archive.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="mt-2 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-medium bg-[#1b1c1a] text-[#fbf9f6] hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all duration-300 cursor-pointer"
                                >
                                    Return to Collection
                                </button>
                            </div>
                        ) : (
                            /* Product Details View */
                            <div className="flex flex-col gap-8">
                                {/* Top Breadcrumb */}
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#B5ADA3]">
                                    <span className="cursor-pointer hover:text-[#C9A96E] transition-colors" onClick={() => navigate('/')}>
                                        Archive
                                    </span>
                                    <span>/</span>
                                    <span className="text-[#7A6E63] font-medium truncate max-w-[200px] sm:max-w-xs">
                                        {product.title || 'Product Detail'}
                                    </span>
                                </div>

                                {/* 2-Column Balanced Layout */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                                    
                                    {/* ── LEFT COLUMN: Product Image & 4-5 Thumbnail Slider ── */}
                                    <div className="lg:col-span-6 flex flex-col gap-4 items-center lg:items-start w-full">
                                        {/* Main Featured Image Container (Bounded max size 520px x 620px) */}
                                        <div className="relative w-full max-w-[520px] aspect-[4/5] max-h-[620px] bg-[#eae8e5] border border-[#e4e2df] overflow-hidden group">
                                            <img
                                                src={activeImage}
                                                alt={product.title || 'Product Image'}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => { e.currentTarget.src = '/snitch_editorial_warm.png'; }}
                                            />
                                            {/* Minimal Corner Badge */}
                                            <div className="absolute top-3 left-3 bg-[#1b1c1a]/90 text-[#fbf9f6] px-2.5 py-1 text-[9px] uppercase tracking-[0.22em] font-medium backdrop-blur-sm">
                                                Archive Piece
                                            </div>
                                        </div>

                                        {/* Image Slider / Gallery Navigation (4-5 Distinct Thumbnails) */}
                                        <div className="w-full max-w-[520px] flex items-center justify-between gap-2 pt-1">
                                            {/* Previous Button */}
                                            <button
                                                onClick={handlePrevImage}
                                                className="w-8 h-8 flex items-center justify-center text-xs border border-[#e4e2df] text-[#1b1c1a] bg-white/60 hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-colors cursor-pointer flex-shrink-0"
                                                aria-label="Previous Image"
                                            >
                                                ←
                                            </button>

                                            {/* Thumbnail Track */}
                                            <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-1 no-scrollbar justify-center w-full">
                                                {imagesList.map((imgUrl, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedImageIndex(idx)}
                                                        className={`relative aspect-square w-16 h-16 flex-shrink-0 overflow-hidden border transition-all duration-200 cursor-pointer bg-[#eae8e5] ${
                                                            selectedImageIndex === idx
                                                                ? 'border-[#1b1c1a] ring-1 ring-[#1b1c1a]'
                                                                : 'border-[#e4e2df] opacity-60 hover:opacity-100'
                                                        }`}
                                                    >
                                                        <img
                                                            src={imgUrl}
                                                            alt={`Thumbnail ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.currentTarget.src = '/snitch_editorial_warm.png'; }}
                                                        />
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Next Button */}
                                            <button
                                                onClick={handleNextImage}
                                                className="w-8 h-8 flex items-center justify-center text-xs border border-[#e4e2df] text-[#1b1c1a] bg-white/60 hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-colors cursor-pointer flex-shrink-0"
                                                aria-label="Next Image"
                                            >
                                                →
                                            </button>
                                        </div>
                                    </div>

                                    {/* ── RIGHT COLUMN: Clean Product Information Panel ── */}
                                    <div className="lg:col-span-6 flex flex-col gap-6 w-full text-left items-start">
                                        
                                        {/* Product Title & Price Block */}
                                        <div className="flex flex-col gap-1.5 w-full">
                                            <span className="text-[10px] uppercase tracking-[0.28em] font-medium text-[#C9A96E]">
                                                VESTRO ARCHIVE EDITION
                                            </span>
                                            <h1
                                                className="text-3xl lg:text-4xl font-light text-[#1b1c1a] leading-tight"
                                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                            >
                                                {product.title || 'Untitled Product'}
                                            </h1>
                                            <div className="text-xl font-medium text-[#1b1c1a] mt-1 tracking-wide">
                                                {formatPrice(product)}
                                            </div>
                                        </div>

                                        {/* Small Divider */}
                                        <div className="w-12 h-px bg-[#C9A96E]" />

                                        {/* Description Block */}
                                        <div className="flex flex-col gap-1.5 w-full">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                                                DESCRIPTION
                                            </span>
                                            <p className="text-xs text-[#7A6E63] leading-relaxed whitespace-pre-line">
                                                {product.description || 'No description provided for this item.'}
                                            </p>
                                        </div>

                                        {/* SELECT SIZE Block */}
                                        <div className="flex flex-col gap-2 w-full pt-1">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                                                SELECT SIZE
                                            </span>
                                            <div className="flex items-center gap-2.5">
                                                {['S', 'M', 'L', 'XL'].map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`w-11 h-11 text-xs font-medium uppercase transition-all duration-200 cursor-pointer flex items-center justify-center border ${
                                                            selectedSize === size
                                                                ? 'bg-[#1b1c1a] text-[#fbf9f6] border-[#1b1c1a]'
                                                                : 'bg-transparent text-[#1b1c1a] border-[#d0c5b5] hover:border-[#1b1c1a]'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* QUANTITY Block */}
                                        <div className="flex flex-col gap-2 w-full">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#7A6E63]">
                                                QUANTITY
                                            </span>
                                            <div className="inline-flex items-center border border-[#d0c5b5] bg-white/50 h-11">
                                                <button
                                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                    className="w-11 h-full text-sm text-[#1b1c1a] hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-colors cursor-pointer flex items-center justify-center"
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span className="w-12 text-center text-xs font-medium text-[#1b1c1a]">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() => setQuantity(prev => prev + 1)}
                                                    className="w-11 h-full text-sm text-[#1b1c1a] hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-colors cursor-pointer flex items-center justify-center"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* ADD TO CART & BUY NOW Buttons */}
                                        <div className="flex flex-col gap-3 w-full pt-2">
                                            {/* Add To Cart Button */}
                                            <button
                                                onClick={handleAddToCart}
                                                className="w-full h-12 text-[11px] uppercase tracking-[0.24em] font-medium border border-[#1b1c1a] bg-[#fbf9f6] text-[#1b1c1a] hover:bg-[#1b1c1a] hover:text-[#fbf9f6] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                {addedToCart ? '✓ ADDED TO CART' : 'ADD TO CART'}
                                            </button>

                                            {/* Buy Now Button */}
                                            <button
                                                onClick={handleBuyNow}
                                                className="w-full h-12 text-[11px] uppercase tracking-[0.24em] font-medium bg-[#1b1c1a] text-[#fbf9f6] hover:bg-[#C9A96E] hover:text-[#1b1c1a] transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-center"
                                            >
                                                BUY NOW
                                            </button>
                                        </div>

                                        {/* TRUST FEATURES (3 Equal Columns with minimal SVG icons) */}
                                        <div className="grid grid-cols-3 gap-3 w-full text-center pt-6 border-t border-[#e4e2df] mt-2">
                                            <div className="flex flex-col items-center gap-1.5 p-1">
                                                <svg className="w-4 h-4 text-[#C9A96E]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium">100% AUTHENTIC</span>
                                            </div>

                                            <div className="flex flex-col items-center gap-1.5 p-1">
                                                <svg className="w-4 h-4 text-[#C9A96E]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.676v6.676" />
                                                </svg>
                                                <span className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium">EXPRESS DELIVERY</span>
                                            </div>

                                            <div className="flex flex-col items-center gap-1.5 p-1">
                                                <svg className="w-4 h-4 text-[#C9A96E]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
                                                </svg>
                                                <span className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63] font-medium">VESTRO GUARANTEE</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>

                {/* ── Footer ── */}
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

export default ProductDetail;

