import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const MAX_IMAGES = 7;

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFiles = (files) => {
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const newImages = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [images]);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const removeImage = (index) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            images.forEach(img => data.append('images', img.file));
            await handleCreateProduct(data);
            navigate('/');
        } catch (err) {
            console.error('Failed to create product', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300 placeholder:text-[#d0c5b5]";
    const inputStyle = { color: '#1b1c1a', borderBottom: '1px solid #d0c5b5', fontFamily: "'Inter', sans-serif" };
    const handleFocus = (e) => { e.target.style.borderBottomColor = '#C9A96E'; };
    const handleBlur = (e) => { e.target.style.borderBottomColor = '#d0c5b5'; };

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="w-full min-h-screen selection:bg-[#C9A96E]/30 py-10 lg:py-16"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                {/* ── SINGLE CENTERED MAIN CONTAINER ── */}
                <div
                    style={{
                        width: 'min(1200px, calc(100% - 80px))',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}
                >
                    {/* ── Header / Navigation ── */}
                    <header className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-lg transition-colors duration-200 leading-none cursor-pointer p-1 -ml-1"
                            style={{ color: '#B5ADA3' }}
                            aria-label="Go back"
                            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                            onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
                        >
                            ←
                        </button>
                        <span
                            className="text-xs font-medium tracking-[0.32em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                        >
                            VESTRO.
                        </span>
                    </header>

                    {/* ── Page Heading ── */}
                    <div style={{ marginTop: '48px', marginBottom: '56px' }}>
                        <h1
                            className="text-4xl lg:text-5xl font-light leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                        >
                            New Listing
                        </h1>
                        <div className="mt-3 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
                    </div>

                    {/* ── Form Container ── */}
                    <form onSubmit={handleSubmit} className="w-full">
                        {/* 2-Column Grid (1fr 1fr, 64px gap) */}
                        <div
                            className="grid grid-cols-1 lg:grid-cols-2 items-start"
                            style={{ gap: '64px' }}
                        >
                            {/* ── LEFT COLUMN: Product Details ── */}
                            <div className="flex flex-col gap-8 w-full">

                                {/* Product Title */}
                                <div className="flex flex-col gap-2 w-full">
                                    <label
                                        htmlFor="cp-title"
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#7A6E63' }}
                                    >
                                        Product Title
                                    </label>
                                    <input
                                        id="cp-title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Oversized Linen Shirt"
                                        className={inputClass}
                                        style={inputStyle}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-2 w-full">
                                    <label
                                        htmlFor="cp-description"
                                        className="text-[10px] uppercase tracking-[0.2em] font-medium"
                                        style={{ color: '#7A6E63' }}
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="cp-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Describe the product — material, fit, details..."
                                        className="w-full bg-transparent outline-none py-3 text-sm transition-colors duration-300 resize-none leading-relaxed placeholder:text-[#d0c5b5]"
                                        style={{ ...inputStyle, minHeight: '180px' }}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                {/* Price Section: 2fr 1fr Grid, 24px Gap */}
                                <div className="flex flex-col gap-2 w-full">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                                        Price
                                    </label>
                                    <div
                                        className="w-full"
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr',
                                            gap: '24px',
                                            alignItems: 'end'
                                        }}
                                    >
                                        {/* Amount */}
                                        <div className="flex flex-col gap-1 w-full">
                                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: '#B5ADA3' }}>Amount</span>
                                            <input
                                                id="cp-priceAmount"
                                                type="number"
                                                name="priceAmount"
                                                value={formData.priceAmount}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className={inputClass}
                                                style={inputStyle}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                            />
                                        </div>
                                        {/* Currency */}
                                        <div className="flex flex-col gap-1 w-full">
                                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: '#B5ADA3' }}>Currency</span>
                                            <select
                                                id="cp-priceCurrency"
                                                name="priceCurrency"
                                                value={formData.priceCurrency}
                                                onChange={handleChange}
                                                className="w-full bg-transparent outline-none py-3 text-sm cursor-pointer appearance-none transition-colors duration-300"
                                                style={inputStyle}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                            >
                                                {CURRENCIES.map(c => (
                                                    <option key={c} value={c} style={{ backgroundColor: '#fbf9f6', color: '#1b1c1a' }}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT COLUMN: Images Upload Section ── */}
                            <div className="flex flex-col gap-3 w-full">
                                <div className="flex items-center justify-between w-full">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                                        Images
                                    </label>
                                    <span className="text-[10px] tracking-wider" style={{ color: '#B5ADA3' }}>
                                        {images.length}/{MAX_IMAGES}
                                    </span>
                                </div>

                                {/* Drop Zone (Exact 380px Height) */}
                                {images.length < MAX_IMAGES && (
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full border border-dashed px-8 py-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 group rounded-none"
                                        style={{
                                            height: '380px',
                                            borderColor: isDragging ? '#C9A96E' : '#d0c5b5',
                                            backgroundColor: isDragging ? 'rgba(201,169,110,0.04)' : 'transparent'
                                        }}
                                    >
                                        {/* Upload Icon */}
                                        <div
                                            className="w-12 h-12 flex items-center justify-center border transition-colors duration-300 group-hover:border-[#C9A96E] group-hover:text-[#C9A96E]"
                                            style={{ borderColor: isDragging ? '#C9A96E' : '#d0c5b5', color: isDragging ? '#C9A96E' : '#B5ADA3' }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                        </div>
                                        <div className="text-center flex flex-col gap-1.5">
                                            <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#7A6E63' }}>
                                                Drop images here or{' '}
                                                <span style={{ color: '#C9A96E', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                                                    tap to upload
                                                </span>
                                            </p>
                                            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#B5ADA3' }}>
                                                UP TO {MAX_IMAGES} IMAGES
                                            </p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                {/* Image Previews */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2 w-full">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square overflow-hidden group border border-[#d0c5b5]/40"
                                                style={{ backgroundColor: '#eae8e5' }}
                                            >
                                                <img
                                                    src={img.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Remove Overlay */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] font-medium tracking-widest uppercase cursor-pointer"
                                                    style={{ backgroundColor: 'rgba(27,24,20,0.65)', color: '#fbf9f6' }}
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    REMOVE
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Publish CTA Button (Inside Main Container, 48px Top Margin) ── */}
                        <div className="w-full" style={{ marginTop: '48px' }}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-13.5 text-[11px] uppercase tracking-[0.28em] font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    backgroundColor: isSubmitting ? '#7A6E63' : '#1b1c1a',
                                    color: '#fbf9f6',
                                    fontFamily: "'Inter', sans-serif"
                                }}
                                onMouseEnter={e => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.backgroundColor = '#C9A96E';
                                        e.currentTarget.style.color = '#1b1c1a';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.backgroundColor = '#1b1c1a';
                                        e.currentTarget.style.color = '#fbf9f6';
                                    }
                                }}
                            >
                                {isSubmitting ? 'PUBLISHING...' : 'PUBLISH LISTING'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;