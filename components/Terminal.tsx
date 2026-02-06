import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

interface TerminalLine {
  type: 'input' | 'output';
  content: string;
  isHtml?: boolean;
}

const COMMANDS: Record<string, string | (() => string)> = {
  help: `
Available commands:
  <span class="text-green-400">help</span>       - Show this help message
  <span class="text-green-400">about</span>      - Learn about me
  <span class="text-green-400">skills</span>     - View my tech stack
  <span class="text-green-400">experience</span> - Work history
  <span class="text-green-400">contact</span>    - Get in touch
  <span class="text-green-400">projects</span>   - View selected work
  <span class="text-green-400">clear</span>      - Clear terminal
  <span class="text-green-400">secret</span>     - ???
`,

  about: `
<span class="text-cyan-400">Hey! I'm Ella.</span>

Product engineer based in New York.
Obsessed with the little details that make
things feel right.

I build with <span class="text-yellow-400">taste, not trends</span> —
turning ideas into tools that feel inevitable.

<span class="text-neutral-500">Type 'skills' to see my tech stack.</span>
`,

  skills: `
<span class="text-cyan-400">Tech Stack</span>

<span class="text-green-400">Languages</span>
  Python     <span class="text-green-500">████████████████████</span> 95%
  TypeScript <span class="text-green-500">██████████████████</span>   90%
  JavaScript <span class="text-green-500">██████████████████</span>   90%

<span class="text-blue-400">Frontend</span>
  React      <span class="text-blue-500">████████████████████</span> 95%
  Next.js    <span class="text-blue-500">████████████████</span>     85%
  Tailwind   <span class="text-blue-500">██████████████████</span>   90%

<span class="text-purple-400">AI/ML</span>
  Claude     <span class="text-purple-500">████████████████████</span> 95%
  OpenAI     <span class="text-purple-500">████████████████████</span> 95%
  LangChain  <span class="text-purple-500">██████████████</span>       80%

<span class="text-orange-400">Backend</span>
  Flask      <span class="text-orange-500">██████████████████</span>   90%
  Node.js    <span class="text-orange-500">████████████████</span>     85%
  PostgreSQL <span class="text-orange-500">████████████████</span>     85%
`,

  experience: `
<span class="text-cyan-400">Experience Timeline</span>

<span class="text-green-400">2024 - Present</span>
  <span class="text-white">Engineering Taste</span> - Founder
  Building tools with taste and writing about
  the details that matter.

<span class="text-blue-400">Previous</span>
  Product & engineering roles across startups
  focused on developer tools and AI applications.

<span class="text-neutral-500">See my full journey on LinkedIn.</span>
`,

  contact: `
<span class="text-cyan-400">Let's Connect!</span>

<span class="text-green-400">Email</span>    <a href="mailto:ella.lesperance@outlook.com" class="text-blue-400 underline">ella.lesperance@outlook.com</a>
<span class="text-green-400">LinkedIn</span> <a href="https://linkedin.com/in/ella-lesperance" target="_blank" class="text-blue-400 underline">linkedin.com/in/ella-lesperance</a>
<span class="text-green-400">GitHub</span>   <a href="https://github.com/codebyellalesperance" target="_blank" class="text-blue-400 underline">github.com/codebyellalesperance</a>
<span class="text-green-400">Substack</span> <a href="https://substack.com/@engineeringtaste" target="_blank" class="text-blue-400 underline">substack.com/@engineeringtaste</a>
`,

  projects: `
<span class="text-cyan-400">Selected Work</span>

<span class="text-yellow-400">1. Taste Swipe</span>
   AI-powered music discovery tool
   <span class="text-neutral-500">Spotify API + AI</span>

<span class="text-yellow-400">2. AI Architect Blueprint Generator</span>
   From 180s to 8s - performance optimization
   <span class="text-neutral-500">Flask + Claude + Gemini</span>

<span class="text-yellow-400">3. Pantry App</span>
   Typo-tolerant search for your kitchen
   <span class="text-neutral-500">React Native + Expo</span>

<span class="text-neutral-500">Scroll up or visit #work for more.</span>
`,

  secret: `
<span class="text-purple-400">Psst...</span> There are more secrets hidden around.

Try the <span class="text-yellow-400">Konami Code</span> somewhere on this page...
Or explore the terminal with commands like:
  <span class="text-green-400">matrix</span>, <span class="text-green-400">party</span>, <span class="text-green-400">coffee</span>, <span class="text-green-400">sudo hire me</span>
`,

  // Easter egg commands
  matrix: 'MATRIX_EFFECT',
  party: 'PARTY_MODE',
  coffee: `
    ( (
     ) )
   .______.
   |      |]
   \\      /
    \`----'

<span class="text-yellow-400">Here's your coffee!</span> Now get back to coding.
`,
  'sudo hire me': `
<span class="text-green-400">Password:</span> ********

<span class="text-green-400">[sudo]</span> Verification successful.

<span class="text-cyan-400">HIRE_ME_v2.0 initialized...</span>
<span class="text-yellow-400">Loading qualifications...</span> Done.
<span class="text-yellow-400">Loading enthusiasm...</span> 100%
<span class="text-yellow-400">Loading availability...</span> Yes!

<span class="text-green-400">Result:</span> I'm available for exciting opportunities!
<span class="text-neutral-500">Run 'contact' to get in touch.</span>
`,
};

const WELCOME_MESSAGE = `
<span class="text-green-400">Welcome to Engineering Taste v1.0</span>
<span class="text-neutral-500">Type 'help' to see available commands.</span>
`;

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: WELCOME_MESSAGE, isHtml: true },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isPartyActive, setIsPartyActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Matrix effect
  useEffect(() => {
    if (!isMatrixActive || !outputRef.current) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
    const interval = setInterval(() => {
      const matrixLine = Array.from({ length: 50 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');

      setHistory((prev) => [
        ...prev.slice(-20),
        { type: 'output', content: `<span class="text-green-500">${matrixLine}</span>`, isHtml: true },
      ]);
    }, 50);

    const timeout = setTimeout(() => {
      setIsMatrixActive(false);
      clearInterval(interval);
      setHistory((prev) => [
        ...prev,
        { type: 'output', content: '\n<span class="text-green-400">Matrix mode deactivated.</span>\n', isHtml: true },
      ]);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isMatrixActive]);

  // Party effect
  useEffect(() => {
    if (!isPartyActive || !terminalRef.current) return;

    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    let colorIndex = 0;

    const interval = setInterval(() => {
      if (terminalRef.current) {
        terminalRef.current.style.borderColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
      }
    }, 100);

    const timeout = setTimeout(() => {
      setIsPartyActive(false);
      clearInterval(interval);
      if (terminalRef.current) {
        terminalRef.current.style.borderColor = '';
      }
      setHistory((prev) => [
        ...prev,
        { type: 'output', content: '\n<span class="text-purple-400">Party mode ended. Back to work!</span>\n', isHtml: true },
      ]);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPartyActive]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    // Add to command history
    if (trimmedCmd) {
      setCommandHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);
    }

    // Add input line to history
    setHistory((prev) => [
      ...prev,
      { type: 'input', content: `$ ${cmd}` },
    ]);

    if (trimmedCmd === 'clear') {
      setHistory([{ type: 'output', content: WELCOME_MESSAGE, isHtml: true }]);
      return;
    }

    if (trimmedCmd === 'matrix') {
      setHistory((prev) => [
        ...prev,
        { type: 'output', content: '<span class="text-green-400">Entering the Matrix...</span>\n', isHtml: true },
      ]);
      setIsMatrixActive(true);
      return;
    }

    if (trimmedCmd === 'party') {
      setHistory((prev) => [
        ...prev,
        { type: 'output', content: '<span class="text-purple-400">Party mode activated!</span>\n', isHtml: true },
      ]);
      setIsPartyActive(true);
      return;
    }

    const output = COMMANDS[trimmedCmd];
    if (output) {
      const content = typeof output === 'function' ? output() : output;
      setHistory((prev) => [
        ...prev,
        { type: 'output', content, isHtml: true },
      ]);
    } else {
      setHistory((prev) => [
        ...prev,
        {
          type: 'output',
          content: `<span class="text-red-400">Command not found: ${cmd}</span>\n<span class="text-neutral-500">Type 'help' for available commands.</span>`,
          isHtml: true,
        },
      ]);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        executeCommand(currentInput);
        setCurrentInput('');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1);
            setCurrentInput('');
          } else {
            setHistoryIndex(newIndex);
            setCurrentInput(commandHistory[newIndex]);
          }
        }
      }
    },
    [currentInput, commandHistory, historyIndex, executeCommand]
  );

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Animate on mount
  useEffect(() => {
    if (terminalRef.current) {
      gsap.fromTo(
        terminalRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white dark:bg-neutral-950 transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-neutral-950 dark:text-white mb-4 transition-colors duration-500">
            About Me
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg transition-colors duration-500">
            An interactive way to learn about what I do.
          </p>
        </div>

        {/* Terminal Window */}
        <div
          ref={terminalRef}
          onClick={focusInput}
          className={`rounded-xl overflow-hidden border-2 border-neutral-800 dark:border-neutral-700 shadow-2xl cursor-text transition-colors duration-300 ${isPartyActive ? 'border-4' : ''}`}
        >
          {/* Title Bar */}
          <div className="bg-neutral-800 dark:bg-neutral-900 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="flex-1 text-center text-sm text-neutral-400 font-mono">
              ella@engineering-taste ~ %
            </span>
          </div>

          {/* Terminal Body */}
          <div className="bg-neutral-950 p-4 font-mono text-sm">
            {/* Output Area */}
            <div
              ref={outputRef}
              className="h-[300px] sm:h-[350px] md:h-[400px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-neutral-700"
            >
              {history.map((line, index) => (
                <div
                  key={index}
                  className={line.type === 'input' ? 'text-green-400' : 'text-neutral-300'}
                >
                  {line.isHtml ? (
                    <pre
                      className="whitespace-pre-wrap font-mono"
                      dangerouslySetInnerHTML={{ __html: line.content }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono">{line.content}</pre>
                  )}
                </div>
              ))}

              {/* Input Line */}
              <div className="flex items-center text-green-400">
                <span>$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-white caret-green-400 ml-1"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="animate-pulse text-green-400">|</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-neutral-400 dark:text-neutral-500 text-sm mt-4">
          Try typing <code className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">help</code> to get started
        </p>
      </div>
    </section>
  );
};
