import React from 'react';

export const FinderIcon = ({ size = 64 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <defs>
            <linearGradient id="finderFace" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#E6E6E6" />
                <stop offset="100%" stopColor="#B0B0B0" />
            </linearGradient>
            <linearGradient id="finderBlue" x1="0" y1="0" x2="0" y2="100">
                <stop offset="0%" stopColor="#4A90E2" />
                <stop offset="100%" stopColor="#0056b3" />
            </linearGradient>
        </defs>
        {/* Blue Face (Left) */}
        <path d="M10 10 H50 V90 H10 Q5 90 5 85 V15 Q5 10 10 10" fill="url(#finderBlue)" />
        {/* Metal Face (Right) */}
        <path d="M50 10 H90 Q95 10 95 15 V85 Q95 90 90 90 H50 V10" fill="url(#finderFace)" />
        {/* Smile */}
        <path d="M25 65 Q50 85 75 65" stroke="black" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        {/* Eyes */}
        <rect x="25" y="35" width="8" height="20" rx="4" fill="black" opacity="0.8" />
        <rect x="67" y="35" width="8" height="20" rx="4" fill="black" opacity="0.8" />
        {/* Nose/Divider */}
        <path d="M50 10 V90" stroke="black" strokeWidth="2" opacity="0.3" />
    </svg>
);

export const FolderIcon = ({ size = 64 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <defs>
            <linearGradient id="folderBlue" x1="50" y1="0" x2="50" y2="100">
                <stop offset="0%" stopColor="#5AC8FA" />
                <stop offset="100%" stopColor="#007AFF" />
            </linearGradient>
        </defs>
        {/* Back Tab */}
        <path d="M10 25 H40 L45 30 H90 Q95 30 95 35 V85 Q95 90 90 90 H10 Q5 90 5 85 V30 Q5 25 10 25" fill="#0056b3" />
        {/* Front Flap */}
        <path d="M5 40 H95 V85 Q95 90 90 90 H10 Q5 90 5 85 V40" fill="url(#folderBlue)" />
        {/* Highlight */}
        <path d="M5 40 H95 V55 Q50 65 5 55 V40" fill="white" opacity="0.2" />
    </svg>
);

export const HardDriveIcon = ({ size = 64 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <defs>
            <linearGradient id="driveSilver" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#F0F0F0" />
                <stop offset="100%" stopColor="#A0A0A0" />
            </linearGradient>
        </defs>
        {/* Drive Body */}
        <rect x="15" y="20" width="70" height="60" rx="4" fill="url(#driveSilver)" stroke="#888" strokeWidth="1" />
        {/* Label Area */}
        <rect x="25" y="55" width="50" height="20" fill="#333" opacity="0.1" />
        {/* LED */}
        <circle cx="80" cy="70" r="2" fill="#00FF00" opacity="0.8" />
    </svg>
);

export const TerminalIcon = ({ size = 64 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <defs>
            <linearGradient id="termScreen" x1="0" y1="0" x2="0" y2="100">
                <stop offset="0%" stopColor="#333" />
                <stop offset="100%" stopColor="#000" />
            </linearGradient>
        </defs>
        {/* Monitor Frame */}
        <rect x="10" y="15" width="80" height="70" rx="4" fill="#D0D0D0" stroke="#999" strokeWidth="1" />
        {/* Screen */}
        <rect x="15" y="20" width="70" height="60" rx="2" fill="url(#termScreen)" />
        {/* Prompt */}
        <text x="20" y="40" fill="#00FF00" fontFamily="monospace" fontSize="12" fontWeight="bold">&gt;_</text>
        {/* Reflection */}
        <path d="M15 20 H85 V50 Q50 60 15 50 V20" fill="white" opacity="0.1" />
    </svg>
);

export const SafariIcon = ({ size = 64 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <defs>
            <radialGradient id="compassBlue" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#5AC8FA" />
                <stop offset="100%" stopColor="#0056b3" />
            </radialGradient>
        </defs>
        {/* Background */}
        <circle cx="50" cy="50" r="45" fill="white" />
        <circle cx="50" cy="50" r="40" fill="url(#compassBlue)" />
        {/* Ticks */}
        <path d="M50 15 V25 M50 75 V85 M15 50 H25 M75 50 H85" stroke="white" strokeWidth="2" />
        {/* Needle */}
        <polygon points="50,20 60,50 50,80 40,50" fill="red" />
        <polygon points="50,20 60,50 50,80 40,50" fill="white" opacity="0.5" /> {/* Shine */}
    </svg>
);

export const TrashIcon = ({ size = 64 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <defs>
            <linearGradient id="trashMesh" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ccc" />
                <stop offset="10%" stopColor="#fff" />
                <stop offset="20%" stopColor="#ccc" />
                <stop offset="30%" stopColor="#fff" />
                <stop offset="40%" stopColor="#ccc" />
                <stop offset="50%" stopColor="#fff" />
                <stop offset="60%" stopColor="#ccc" />
                <stop offset="70%" stopColor="#fff" />
                <stop offset="80%" stopColor="#ccc" />
                <stop offset="90%" stopColor="#fff" />
                <stop offset="100%" stopColor="#ccc" />
            </linearGradient>
        </defs>
        {/* Bin Body */}
        <path d="M20 20 L25 90 H75 L80 20 H20" fill="url(#trashMesh)" stroke="#999" strokeWidth="1" />
        {/* Rim */}
        <ellipse cx="50" cy="20" rx="30" ry="5" fill="#ddd" stroke="#999" strokeWidth="1" />
        {/* Handle */}
        <path d="M30 20 V15 H70 V20" stroke="#999" strokeWidth="2" fill="none" />
    </svg>
);

export const BoxIcon = ({ size = 64 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <rect x="20" y="20" width="60" height="60" fill="#D4A373" stroke="#8B5E3C" strokeWidth="2" />
        <path d="M20 20 L80 80 M80 20 L20 80" stroke="#8B5E3C" strokeWidth="1" opacity="0.5" />
        <rect x="30" y="15" width="40" height="10" fill="#E6CCB2" stroke="#8B5E3C" />
    </svg>
);

export const MusicIcon = ({ size = 64 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <defs>
            <linearGradient id="musicGradient" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#FB5C74" />
                <stop offset="100%" stopColor="#FA233B" />
            </linearGradient>
        </defs>
        <rect x="10" y="10" width="80" height="80" rx="18" fill="url(#musicGradient)" />
        <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="6" opacity="0.9" />
        <circle cx="50" cy="50" r="10" fill="white" opacity="0.9" />
        <path d="M50 50 L65 35" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
    </svg>
);
