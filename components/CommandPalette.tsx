import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUp, ArrowDown, ArrowUpRight, Sparkles, Globe, FileText, Layers, Loader2 } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    description: string;
    category: 'ai' | 'web' | 'writing';
    tags: string[];
    substackUrl: string;
    imageUrl?: string;
    pubDate?: string;
}

// Fallback static data in case RSS fetch fails
const fallbackProjects: Project[] = [
    {
        id: '1',
        title: 'Taste Swipe',
        description: 'Spotify DJ and Daylist keep fumbling, so I built my own music discovery tool.',
        category: 'ai',
        tags: ['Spotify API', 'AI', 'Music'],
        substackUrl: 'https://engineeringtaste.substack.com/p/taste-swipe-spotify-dj-and-daylist'
    },
    {
        id: '2',
        title: 'AI Architect Blueprint Generator',
        description: 'Flask + Claude + Gemini: From 180s to 8s — a performance deep dive in optimization.',
        category: 'ai',
        tags: ['Flask', 'Claude', 'Gemini', 'Performance'],
        substackUrl: 'https://engineeringtaste.substack.com/p/flask-claude-gemini-building-an-ai'
    },
    {
        id: '3',
        title: 'Pantry App with Typo-Tolerant Search',
        description: 'Solving the "Do we have milk?" problem with three databases and a typo-tolerant search algorithm.',
        category: 'web',
        tags: ['React Native', 'Expo', 'Search'],
        substackUrl: 'https://engineeringtaste.substack.com/p/i-built-a-pantry-app-that-actually'
    },
    {
        id: '4',
        title: 'Whim: Spontaneous Hangout App',
        description: 'React Native + Expo + NativeWind — because coordinating with friends is impossible.',
        category: 'web',
        tags: ['React Native', 'Expo', 'NativeWind'],
        substackUrl: 'https://engineeringtaste.substack.com/p/whim-the-spontaneous-hangout-app'
    },
    {
        id: '5',
        title: 'Local AI That Remembers Me',
        description: 'What worked, what broke, and what I learned building a personal AI with memory.',
        category: 'ai',
        tags: ['Local AI', 'Memory', 'Experiments'],
        substackUrl: 'https://engineeringtaste.substack.com/p/i-built-a-local-ai-that-remembers'
    }
];

// Auto-detect category from title/description
function detectCategory(title: string, description: string): 'ai' | 'web' | 'writing' {
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes('ai') || text.includes('claude') || text.includes('gemini') || text.includes('gpt') || text.includes('llm') || text.includes('machine learning')) {
        return 'ai';
    }
    if (text.includes('react') || text.includes('flask') || text.includes('expo') || text.includes('app') || text.includes('api') || text.includes('web')) {
        return 'web';
    }
    return 'writing';
}

// Extract tags from content
function extractTags(title: string, description: string): string[] {
    const text = `${title} ${description}`;
    const tagPatterns = [
        /react\s*native/gi, /react/gi, /flask/gi, /claude/gi, /gemini/gi, /gpt/gi,
        /spotify/gi, /expo/gi, /nativewind/gi, /ai/gi, /oauth/gi, /python/gi,
        /typescript/gi, /javascript/gi, /three\.js/gi, /webgl/gi
    ];

    const found = new Set<string>();
    tagPatterns.forEach(pattern => {
        const match = text.match(pattern);
        if (match) {
            // Capitalize properly
            const tag = match[0].replace(/\b\w/g, l => l.toUpperCase());
            found.add(tag);
        }
    });

    return Array.from(found).slice(0, 4);
}

const categoryIcons = {
    ai: Sparkles,
    web: Globe,
    writing: FileText
};

const categoryLabels = {
    ai: 'AI',
    web: 'Web',
    writing: 'Writing'
};

export const CommandPalette: React.FC = () => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'web' | 'writing'>('all');
    const [isFocused, setIsFocused] = useState(false);
    const [projects, setProjects] = useState<Project[]>(fallbackProjects);
    const [isLoading, setIsLoading] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Fetch RSS feed on mount
    useEffect(() => {
        const fetchSubstackPosts = async () => {
            try {
                // Use a CORS proxy for client-side fetching
                const corsProxy = 'https://api.allorigins.win/raw?url=';
                const feedUrl = encodeURIComponent('https://engineeringtaste.substack.com/feed');

                const response = await fetch(`${corsProxy}${feedUrl}`);
                if (!response.ok) throw new Error('Failed to fetch');

                const xmlText = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

                const items = xmlDoc.querySelectorAll('item');
                const fetchedProjects: Project[] = [];

                items.forEach((item, index) => {
                    const title = item.querySelector('title')?.textContent || '';
                    const link = item.querySelector('link')?.textContent || '';
                    const description = item.querySelector('description')?.textContent || '';
                    const pubDate = item.querySelector('pubDate')?.textContent || '';

                    // Extract image from enclosure or content
                    const enclosure = item.querySelector('enclosure');
                    let imageUrl = enclosure?.getAttribute('url') || '';

                    // Try to find image in content:encoded if no enclosure
                    if (!imageUrl) {
                        const content = item.getElementsByTagName('content:encoded')[0]?.textContent || '';
                        const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
                        if (imgMatch) imageUrl = imgMatch[1];
                    }

                    // Skip "Coming soon" placeholder posts
                    if (title.toLowerCase().includes('coming soon')) return;

                    // Clean description (remove HTML)
                    const cleanDesc = description
                        .replace(/<[^>]*>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .slice(0, 150) + (description.length > 150 ? '...' : '');

                    fetchedProjects.push({
                        id: String(index + 1),
                        title,
                        description: cleanDesc,
                        category: detectCategory(title, description),
                        tags: extractTags(title, description),
                        substackUrl: link,
                        imageUrl,
                        pubDate
                    });
                });

                if (fetchedProjects.length > 0) {
                    setProjects(fetchedProjects);
                }
            } catch (error) {
                console.log('Using fallback projects - RSS fetch failed:', error);
                // Keep using fallback projects
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubstackPosts();
    }, []);

    // Filter projects based on search query and category
    const filteredProjects = projects.filter(project => {
        const matchesQuery = query === '' ||
            project.title.toLowerCase().includes(query.toLowerCase()) ||
            project.description.toLowerCase().includes(query.toLowerCase()) ||
            project.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

        const matchesCategory = activeCategory === 'all' || project.category === activeCategory;

        return matchesQuery && matchesCategory;
    });

    // Reset selection when filters change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query, activeCategory]);

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current) {
            const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [selectedIndex]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredProjects.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredProjects[selectedIndex]) {
                    window.open(filteredProjects[selectedIndex].substackUrl, '_blank');
                }
                break;
        }
    }, [filteredProjects, selectedIndex]);

    // Global keyboard shortcut (⌘K)
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    const categories = ['all', 'ai', 'web', 'writing'] as const;

    return (
        <section id="work" className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-24 px-6 transition-colors duration-500">
            <div className="max-w-3xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-neutral-950 dark:text-white mb-4 transition-colors duration-500">
                        Selected Work
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-lg transition-colors duration-500">
                        Search or browse projects. Press <kbd className="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-sm">⌘K</kbd> to focus.
                    </p>
                </motion.div>

                {/* Command Palette Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${isFocused
                            ? 'ring-2 ring-neutral-400 dark:ring-neutral-500'
                            : 'ring-1 ring-neutral-200 dark:ring-neutral-800'
                        }`}
                >
                    {/* Background backdrop */}
                    <div className="absolute inset-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl -z-10" />

                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
                        <Search size={20} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Search projects..."
                            className="flex-1 bg-transparent text-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none"
                        />
                        <div className="hidden sm:flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500">
                            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-medium">
                                <ArrowUp size={12} />
                            </kbd>
                            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-xs font-medium">
                                <ArrowDown size={12} />
                            </kbd>
                            <span className="text-xs ml-1">to navigate</span>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-1 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50">
                        {categories.map((cat) => {
                            const Icon = cat === 'all' ? Layers : categoryIcons[cat];
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeCategory === cat
                                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                        }`}
                                >
                                    <Icon size={14} />
                                    {cat === 'all' ? 'All' : categoryLabels[cat]}
                                </button>
                            );
                        })}
                    </div>

                    {/* Results List */}
                    <div ref={listRef} className="max-h-[500px] overflow-y-auto">
                        {isLoading ? (
                            <div className="py-16 text-center text-neutral-400 dark:text-neutral-500">
                                <Loader2 size={32} className="mx-auto mb-3 animate-spin" />
                                <p>Loading articles...</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project, index) => {
                                        const Icon = categoryIcons[project.category];
                                        return (
                                            <motion.a
                                                key={project.id}
                                                href={project.substackUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                className={`block px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 transition-colors duration-150 cursor-pointer group ${selectedIndex === index
                                                        ? 'bg-neutral-100 dark:bg-neutral-800/80'
                                                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Image or Icon */}
                                                    {project.imageUrl ? (
                                                        <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                                            <img
                                                                src={project.imageUrl}
                                                                alt={project.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    // Hide broken images
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className={`p-2.5 rounded-xl flex-shrink-0 transition-colors ${selectedIndex === index
                                                                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                                                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                                                            }`}>
                                                            <Icon size={20} />
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-neutral-900 dark:text-white truncate transition-colors">
                                                                {project.title}
                                                            </h3>
                                                            <ArrowUpRight
                                                                size={16}
                                                                className={`flex-shrink-0 transition-all duration-200 ${selectedIndex === index
                                                                        ? 'opacity-100 translate-x-0 text-neutral-500 dark:text-neutral-400'
                                                                        : 'opacity-0 -translate-x-2'
                                                                    }`}
                                                            />
                                                        </div>
                                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-2">
                                                            {project.description}
                                                        </p>
                                                        <div className="flex gap-1.5 flex-wrap">
                                                            {project.tags.map(tag => (
                                                                <span
                                                                    key={tag}
                                                                    className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.a>
                                        );
                                    })
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-16 text-center text-neutral-400 dark:text-neutral-500"
                                    >
                                        <Search size={32} className="mx-auto mb-3 opacity-50" />
                                        <p>No projects found for "{query}"</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
                        <span>{filteredProjects.length} article{filteredProjects.length !== 1 ? 's' : ''}</span>
                        <div className="hidden sm:flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-medium">↵</kbd>
                                to open
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-medium">esc</kbd>
                                to close
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
