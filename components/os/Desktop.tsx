import React, { useState, useEffect } from 'react';
import { Window } from './Window';
import { X, Terminal, Globe, Box, User, Mail, Github, Linkedin, ArrowUpRight, Play, Pause, SkipForward, SkipBack, Disc } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FinderIcon, FolderIcon, HardDriveIcon, MusicIcon, TrashIcon } from './RichIcons';

interface DesktopProps {
    className?: string;
}

interface AppState {
    id: string;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    defaultPosition: { x: number; y: number };
    content: React.ReactNode;
}

// Widget Card Component (for bento grid)
const WidgetCard: React.FC<{
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onClick: () => void;
    className?: string;
    gradient?: string;
}> = ({ title, subtitle, icon, onClick, className, gradient }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={`relative overflow-hidden rounded-3xl p-8 text-left flex flex-col justify-between group transition-all duration-300 ${className}`}
        style={{
            background: gradient || 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        }}
    >
        <div className="z-10 relative w-full h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                {icon && (
                    <div className="p-3 rounded-2xl bg-white/5 text-white/80 group-hover:bg-white/10 transition-colors">
                        {icon}
                    </div>
                )}
                <ArrowUpRight className="text-white/20 group-hover:text-white/60 transition-colors" size={24} />
            </div>
            <div className="mt-auto">
                <h3 className="text-2xl font-semibold text-white/90 tracking-tight mb-1">{title}</h3>
                {subtitle && <p className="text-sm text-white/50 font-light">{subtitle}</p>}
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.button>
);

// Desktop Icon Component
const DesktopIcon: React.FC<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ label, icon, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors group w-20"
    >
        <div className="filter drop-shadow-lg transition-transform group-hover:scale-105">
            {icon}
        </div>
        <span className="text-xs font-medium text-black px-2 py-0.5 rounded bg-white/70 backdrop-blur-sm text-center leading-tight shadow-sm">
            {label}
        </span>
    </button>
);

// Dock Item Component - macOS Style
const DockItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    isOpen?: boolean;
}> = ({ label, icon, onClick, isOpen }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative flex flex-col items-center justify-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Tooltip */}
            <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/80 backdrop-blur-xl text-white text-xs px-3 py-1.5 rounded-md border border-white/20 whitespace-nowrap pointer-events-none shadow-xl z-50">
                {label}
            </div>

            {/* Icon */}
            <motion.button
                onClick={onClick}
                className="relative flex items-center justify-center cursor-default"
                animate={{
                    scale: isHovered ? 1.5 : 1,
                    y: isHovered ? -20 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                }}
                style={{
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                }}
            >
                <div className="w-[52px] h-[52px] flex items-center justify-center">
                    {icon}
                </div>
            </motion.button>

            {/* Active Indicator Dot */}
            <div className={`absolute -bottom-1 w-1 h-1 rounded-full bg-white/90 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
        </div>
    );
};

// macOS Menu Bar
const MacMenuBar: React.FC = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute top-0 left-0 right-0 h-7 bg-white/40 backdrop-blur-2xl border-b border-black/5 flex items-center justify-between px-4 z-[200] select-none text-xs font-medium text-black/90">
            <div className="flex items-center gap-4">
                <span className="text-base"></span>
                <span className="font-semibold">Portfolio</span>
                <span className="opacity-70">File</span>
                <span className="opacity-70">Edit</span>
                <span className="opacity-70">View</span>
                <span className="opacity-70">Window</span>
                <span className="opacity-70">Help</span>
            </div>
            <div className="flex items-center gap-4 opacity-70">
                <span>{date}</span>
                <span>{time}</span>
            </div>
        </div>
    );
};

export const Desktop: React.FC<DesktopProps> = ({ className = "" }) => {
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [apps, setApps] = useState<AppState[]>([
        {
            id: 'about',
            title: 'About Me',
            isOpen: false,
            isMinimized: false,
            defaultPosition: { x: 100, y: 80 },
            content: (
                <div className="h-full p-8 text-white overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex-shrink-0">
                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                <User size={48} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-medium mb-4 tracking-tight">Software Engineer & Creative Technologist</h2>
                            <p className="text-white/60 leading-relaxed text-lg font-light mb-6">
                                I build digital experiences that sit at the intersection of design and engineering. Currently focused on AI interfaces and spatial computing.
                            </p>
                            <div className="flex gap-3 flex-wrap">
                                {['React', 'TypeScript', 'Next.js', 'Three.js', 'Node.js', 'Python'].map(tech => (
                                    <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'work',
            title: 'Selected Work',
            isOpen: false,
            isMinimized: false,
            defaultPosition: { x: 150, y: 120 },
            content: (
                <div className="h-full p-6 text-white overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: 'Nasdaq AI Sandbox', desc: 'Internal tooling for AI workflow standardization.', icon: Terminal, color: 'blue' },
                            { title: 'Ctrl Create Labs', desc: 'Experimental design and tech publication.', icon: Globe, color: 'purple' },
                            { title: 'Spatial Experiments', desc: 'Three.js and WebGL playground.', icon: Box, color: 'pink' },
                        ].map((project, i) => (
                            <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg bg-${project.color}-500/20 text-${project.color}-400`}>
                                        <project.icon size={24} />
                                    </div>
                                    <ArrowUpRight className="text-white/20 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                                <p className="text-white/50 text-sm">{project.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'contact',
            title: 'Contact',
            isOpen: false,
            isMinimized: false,
            defaultPosition: { x: 200, y: 160 },
            content: (
                <div className="h-full p-8 text-white flex flex-col justify-center">
                    <div className="space-y-4 max-w-md mx-auto w-full">
                        <a href="mailto:hello@example.com" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group">
                            <Mail className="text-white/70 group-hover:text-white transition-colors" />
                            <div>
                                <div className="font-medium text-white/90">Email Me</div>
                                <div className="text-xs text-white/50">hello@example.com</div>
                            </div>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group">
                            <Linkedin className="text-white/70 group-hover:text-white transition-colors" />
                            <div>
                                <div className="font-medium text-white/90">LinkedIn</div>
                                <div className="text-xs text-white/50">Connect professionally</div>
                            </div>
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group">
                            <Github className="text-white/70 group-hover:text-white transition-colors" />
                            <div>
                                <div className="font-medium text-white/90">GitHub</div>
                                <div className="text-xs text-white/50">Check out my code</div>
                            </div>
                        </a>
                    </div>
                </div>
            )
        },
        {
            id: 'music',
            title: 'Music',
            isOpen: false,
            isMinimized: false,
            defaultPosition: { x: 250, y: 100 },
            content: (
                <div className="h-full bg-[#121212] text-white flex flex-col">
                    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-[#222] to-[#121212]">
                        <div className="w-48 h-48 rounded-lg shadow-2xl bg-neutral-800 flex items-center justify-center relative overflow-hidden group">
                            <Disc size={80} className="text-neutral-600" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={48} fill="white" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-[#181818] border-t border-white/5">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">Coding Focus Mix</h3>
                            <p className="text-sm text-white/50">Lo-Fi Beats</p>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full mb-6 relative group cursor-pointer">
                            <div className="absolute left-0 top-0 h-full w-1/3 bg-white rounded-full"></div>
                            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="flex items-center justify-center gap-8">
                            <button className="text-white/70 hover:text-white transition-colors"><SkipBack size={24} /></button>
                            <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                                <Pause size={20} fill="currentColor" />
                            </button>
                            <button className="text-white/70 hover:text-white transition-colors"><SkipForward size={24} /></button>
                        </div>
                    </div>
                </div>
            )
        }
    ]);

    const openApp = (id: string) => {
        setApps(apps.map(app => (app.id === id ? { ...app, isOpen: true, isMinimized: false } : app)));
        setActiveWindowId(id);
    };

    const closeApp = (id: string) => {
        setApps(apps.map(app => (app.id === id ? { ...app, isOpen: false } : app)));
    };

    const minimizeApp = (id: string) => {
        setApps(apps.map(app => (app.id === id ? { ...app, isMinimized: true } : app)));
    };

    const focusApp = (id: string) => {
        setActiveWindowId(id);
        setApps(apps.map(app => (app.id === id ? { ...app, isMinimized: false } : app)));
    };

    return (
        <div className={`relative w-full h-full overflow-hidden font-sans text-black selection:bg-blue-200/50 ${className}`}>

            <MacMenuBar />

            {/* Desktop Wallpaper */}
            <div className="absolute inset-0 bg-[#e8e8e8]">
                <img
                    src="/bigsur-wallpaper.png"
                    alt="Desktop Wallpaper"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Desktop Icons (top right) */}
            <div className="absolute top-10 right-4 flex flex-col gap-4 z-10">
                <DesktopIcon
                    label="Macintosh HD"
                    icon={<img src="/icons/hd.png" alt="Hard Drive" className="w-12 h-12 object-contain" />}
                    onClick={() => { }}
                />
                <DesktopIcon
                    label="Projects"
                    icon={<img src="/icons/folder-blue.png" alt="Projects" className="w-12 h-12 object-contain" />}
                    onClick={() => openApp('work')}
                />
            </div>

            {/* Bento Grid (center) */}
            <div className="absolute inset-0 top-12 bottom-20 px-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-4 max-w-[1600px] mx-auto py-6">
                    <WidgetCard
                        title="About Me"
                        subtitle="Software Engineer"
                        icon={<User size={28} />}
                        onClick={() => openApp('about')}
                        className="md:col-span-2 md:row-span-2"
                        gradient="linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%)"
                    />
                    <WidgetCard
                        title="Work"
                        subtitle="Projects"
                        icon={<Terminal size={28} />}
                        onClick={() => openApp('work')}
                        gradient="linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)"
                    />
                    <WidgetCard
                        title="Contact"
                        subtitle="Get in touch"
                        icon={<Mail size={28} />}
                        onClick={() => openApp('contact')}
                        gradient="linear-gradient(135deg, #e0f0e0 0%, #f0e0e0 100%)"
                    />
                    <WidgetCard
                        title="Music"
                        subtitle="Now Playing"
                        icon={<Disc size={28} />}
                        onClick={() => openApp('music')}
                        className="md:col-span-2"
                        gradient="linear-gradient(135deg, #a8e0b8 0%, #90d0a0 100%)"
                    />
                    <WidgetCard
                        title="GitHub"
                        subtitle="View Code"
                        icon={<Github size={28} />}
                        onClick={() => { }}
                        gradient="linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)"
                    />
                </div>
            </div>

            {/* Windows Layer */}
            <div className="absolute inset-0 overflow-hidden z-50 pointer-events-none">
                {apps.map(app => (
                    app.isOpen && (
                        <div key={app.id} className="pointer-events-auto">
                            <Window
                                id={app.id}
                                title={app.title}
                                isActive={activeWindowId === app.id}
                                isMinimized={app.isMinimized}
                                onFocus={() => focusApp(app.id)}
                                onMinimize={() => minimizeApp(app.id)}
                                onClose={() => closeApp(app.id)}
                                defaultPosition={app.defaultPosition}
                                variant="modern"
                            >
                                {app.content}
                            </Window>
                        </div>
                    )
                ))}
            </div>

            {/* Dock */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-[100]">
                <div className="flex items-end gap-1 px-2 py-1.5 rounded-[20px] bg-white/60 backdrop-blur-3xl border border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)',
                    }}
                >
                    <DockItem
                        label="Finder"
                        icon={<img src="/icons/finder-real.png" alt="Finder" className="w-full h-full object-contain" />}
                        onClick={() => { }}
                        isOpen={true}
                    />
                    <DockItem
                        label="About"
                        icon={<User size={32} className="text-white" />}
                        onClick={() => openApp('about')}
                        isOpen={apps.find(a => a.id === 'about')?.isOpen}
                    />
                    <DockItem
                        label="Work"
                        icon={<img src="/icons/folder-colorful.png" alt="Work" className="w-full h-full object-contain" />}
                        onClick={() => openApp('work')}
                        isOpen={apps.find(a => a.id === 'work')?.isOpen}
                    />
                    <DockItem
                        label="Contact"
                        icon={<img src="/icons/messages.png" alt="Contact" className="w-full h-full object-contain" />}
                        onClick={() => openApp('contact')}
                        isOpen={apps.find(a => a.id === 'contact')?.isOpen}
                    />
                    <DockItem
                        label="Music"
                        icon={<img src="/icons/music.png" alt="Music" className="w-full h-full object-contain" />}
                        onClick={() => openApp('music')}
                        isOpen={apps.find(a => a.id === 'music')?.isOpen}
                    />
                    <DockItem
                        label="Calendar"
                        icon={<img src="/icons/calendar.png" alt="Calendar" className="w-full h-full object-contain" />}
                        onClick={() => { }}
                    />
                    <DockItem
                        label="Apple Music"
                        icon={<img src="/icons/apple-music.png" alt="Apple Music" className="w-full h-full object-contain" />}
                        onClick={() => { }}
                    />
                    <DockItem
                        label="Spotify"
                        icon={<img src="/icons/spotify.png" alt="Spotify" className="w-full h-full object-contain" />}
                        onClick={() => { }}
                    />
                    <DockItem
                        label="FaceTime"
                        icon={<img src="/icons/facetime.png" alt="FaceTime" className="w-full h-full object-contain" />}
                        onClick={() => { }}
                    />
                    <DockItem
                        label="Photos"
                        icon={<img src="/icons/photos.png" alt="Photos" className="w-full h-full object-contain" />}
                        onClick={() => { }}
                    />
                    {/* Divider */}
                    <div className="w-[1px] h-12 bg-black/15 mx-1 self-center"></div>
                    <DockItem
                        label="Trash"
                        icon={<img src="/icons/trash-full.png" alt="Trash" className="w-full h-full object-contain" />}
                        onClick={() => { }}
                    />
                </div>
            </div>
        </div>
    );
};
