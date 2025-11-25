import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { Minus, Square, X, Maximize2 } from 'lucide-react';

interface WindowProps {
    id: string;
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    isMinimized: boolean;
    onFocus: () => void;
    onMinimize: () => void;
    onClose: () => void;
    defaultPosition?: { x: number; y: number };
    className?: string;
    variant?: 'default' | 'finder' | 'glass' | 'modern';
    sidebar?: React.ReactNode;
    toolbar?: React.ReactNode;
    statusBar?: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
    id,
    title,
    children,
    isActive,
    isMinimized,
    onFocus,
    onMinimize,
    onClose,
    defaultPosition = { x: 0, y: 0 },
    className = "",
    variant = 'default',
    sidebar,
    toolbar,
    statusBar
}) => {
    const dragControls = useDragControls();
    const [isMaximized, setIsMaximized] = useState(false);

    // Prevent drag when interacting with content
    const handleContentPointerDown = (e: React.PointerEvent) => {
        e.stopPropagation();
    };

    const metalTexture = {
        backgroundColor: '#dcdcdc',
        backgroundImage: `
            linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(0,0,0,0.05) 100%),
            repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 1px,
                rgba(0,0,0,0.06) 2px,
                rgba(0,0,0,0.06) 3px
            )
        `,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9)'
    };

    const glassTexture = {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)',
        borderRadius: '24px'
    };

    const modernTexture = {
        background: 'rgba(20, 20, 20, 0.85)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.2)',
        borderRadius: '20px'
    };

    return (
        <AnimatePresence>
            {!isMinimized && (
                <motion.div
                    drag={!isMaximized}
                    dragControls={dragControls}
                    dragMomentum={false}
                    dragListener={false} // Only drag from title bar
                    initial={{
                        x: defaultPosition.x,
                        y: defaultPosition.y,
                        opacity: 0,
                        scale: 0.95,
                        filter: 'blur(8px)'
                    }}
                    animate={{
                        x: isMaximized ? 0 : undefined,
                        y: isMaximized ? 0 : undefined,
                        width: isMaximized ? "100%" : undefined,
                        height: isMaximized ? "100%" : undefined,
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)',
                        zIndex: isActive ? 50 : 10
                    }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)', transition: { duration: 0.2 } }}
                    onPointerDown={onFocus}
                    className={`absolute flex flex-col overflow-hidden ${isMaximized ? 'inset-0 !rounded-none' : 'w-[90vw] md:w-[600px] h-[400px] md:h-[500px]'} ${className}`}
                    style={{
                        position: isMaximized ? 'fixed' : 'absolute',
                        touchAction: 'none',
                        ...(variant === 'modern' ? modernTexture : (variant === 'glass' ? glassTexture : (variant === 'finder' ? metalTexture : {})))
                    }}
                >
                    {/* Title Bar */}
                    <div
                        onPointerDown={(e) => {
                            onFocus();
                            dragControls.start(e);
                        }}
                        className={`h-[48px] relative flex items-center justify-between px-5 select-none cursor-grab active:cursor-grabbing ${variant === 'finder' ? 'border-b border-[#999]' : ''}`}
                        style={{
                            background: variant === 'finder' ? 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)' : 'transparent'
                        }}
                    >
                        {variant === 'modern' ? (
                            <>
                                <div className="flex items-center gap-2 z-10">
                                    {/* Traffic Lights */}
                                    <div className="flex items-center gap-2 group/lights">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                                            className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center overflow-hidden"
                                        >
                                            <X size={8} className="text-black/50 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                                            className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center overflow-hidden"
                                        >
                                            <Minus size={8} className="text-black/50 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
                                            className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center overflow-hidden"
                                        >
                                            <Maximize2 size={8} className="text-black/50 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
                                        </button>
                                    </div>
                                </div>
                                <span className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-white/90 tracking-wide pointer-events-none">{title}</span>
                            </>
                        ) : variant === 'glass' ? (
                            <>
                                <div className="flex items-center gap-2 z-10">
                                    <div className="w-2 h-2 rounded-full bg-white/40"></div>
                                    <span className="text-sm font-medium text-white/80 tracking-wide">{title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                                        <Minus size={14} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                                        <X size={14} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Retro Header Content
                            <>
                                <div className="flex items-center gap-1.5 z-10 pl-1">
                                    {/* Red Gem */}
                                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3 h-3 rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.4)] relative overflow-hidden group border border-[#b00]"
                                        style={{ background: 'radial-gradient(circle at 35% 35%, #ff9999, #cc0000)' }}>
                                        <div className="absolute top-[1px] left-[2px] w-1.5 h-1 bg-white opacity-70 rounded-full blur-[0.3px]"></div>
                                        <X size={8} className="text-black opacity-0 group-hover:opacity-60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </button>
                                    {/* Yellow Gem */}
                                    <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-3 h-3 rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.4)] relative overflow-hidden group border border-[#b80]"
                                        style={{ background: 'radial-gradient(circle at 35% 35%, #ffff99, #ffcc00)' }}>
                                        <div className="absolute top-[1px] left-[2px] w-1.5 h-1 bg-white opacity-70 rounded-full blur-[0.3px]"></div>
                                        <Minus size={8} className="text-black opacity-0 group-hover:opacity-60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </button>
                                    {/* Green Gem */}
                                    <button onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }} className="w-3 h-3 rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.4)] relative overflow-hidden group border border-[#080]"
                                        style={{ background: 'radial-gradient(circle at 35% 35%, #99ff99, #00cc00)' }}>
                                        <div className="absolute top-[1px] left-[2px] w-1.5 h-1 bg-white opacity-70 rounded-full blur-[0.3px]"></div>
                                        {isMaximized ? <Minus size={8} className="text-black opacity-0 group-hover:opacity-60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> : <Maximize2 size={8} className="text-black opacity-0 group-hover:opacity-60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                    </button>
                                </div>

                                <span className="text-[13px] font-bold text-[#222] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] z-10 tracking-tight absolute left-1/2 -translate-x-1/2" style={{ fontFamily: '"Lucida Grande", "Lucida Sans Unicode", sans-serif' }}>
                                    {title}
                                </span>

                                {/* Right Pill Button (Tiger Style) */}
                                <div className="w-8 h-3.5 rounded-full border border-[#888] bg-gradient-to-b from-white to-[#ccc] shadow-sm"></div>
                            </>
                        )}
                    </div>

                    {/* Toolbar Area */}
                    {toolbar && (
                        <div className="px-3 py-2 border-b border-[#999] flex items-center gap-4" onPointerDown={handleContentPointerDown}>
                            {toolbar}
                        </div>
                    )}

                    {/* Content Area */}
                    <div
                        className={`flex-1 overflow-hidden relative flex ${variant === 'glass' || variant === 'modern' ? 'bg-transparent' : 'bg-white'}`}
                        onPointerDown={handleContentPointerDown}
                    >
                        {sidebar && (
                            <div className="w-[160px] bg-[#e8e8e8] border-r border-[#ccc] h-full overflow-y-auto shadow-inner">
                                {sidebar}
                            </div>
                        )}
                        <div className="flex-1 h-full overflow-auto">
                            {children}
                        </div>
                    </div>

                    {/* Status Bar */}
                    {statusBar && (
                        <div className="h-[22px] border-t border-[#999] flex items-center justify-center text-[11px] text-[#444] font-medium select-none"
                            style={{ fontFamily: '"Lucida Grande", sans-serif', ...metalTexture }}>
                            {statusBar}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
