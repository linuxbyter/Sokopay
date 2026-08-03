'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const FRUITS = ['🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🫐', '🥝', '🍌', '🥭', '🍍', '🍑'];
const BASKET = '🧺';

interface Fruit {
  id: number;
  emoji: string;
  x: number;
  y: number;
  speed: number;
  wobble: number;
  scale: number;
}

interface FruitGameProps {
  onExit?: () => void;
}

export default function FruitGame({ onExit }: FruitGameProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [basketX, setBasketX] = useState(50);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const fruitIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const animFrameRef = useRef<number>();
  const lastSpawnRef = useRef(0);
  const gameActiveRef = useRef(false);
  const comboRef = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem('Sokopay_fruit_high_score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setStarted(true);
    setFruits([]);
    setParticles([]);
    setBasketX(50);
    setCombo(0);
    comboRef.current = 0;
    gameActiveRef.current = true;
    lastSpawnRef.current = Date.now();
  };

  const moveBasket = useCallback((direction: 'left' | 'right') => {
    setBasketX(prev => {
      const next = direction === 'left' ? prev - 8 : prev + 8;
      return Math.max(5, Math.min(95, next));
    });
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') moveBasket('left');
      if (e.key === 'ArrowRight' || e.key === 'd') moveBasket('right');
    };

    const handleTouch = (e: TouchEvent) => {
      const x = e.touches[0]?.clientX;
      if (x !== undefined && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const pct = ((x - rect.left) / rect.width) * 100;
        setBasketX(Math.max(5, Math.min(95, pct)));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchmove', handleTouch, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, [started, gameOver, moveBasket]);

  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      setFruits(prev => {
        const now = Date.now();
        let updated = prev.map(f => ({
          ...f,
          y: f.y + f.speed,
          wobble: f.wobble + 0.05,
          x: f.x + Math.sin(f.wobble) * 0.15,
        }));

        const caught: number[] = [];
        const missed: number[] = [];
        updated.forEach(f => {
          if (f.y >= 88 && f.y <= 98) {
            if (Math.abs(f.x - basketX) < 12) {
              caught.push(f.id);
            }
          }
          if (f.y > 100) {
            missed.push(f.id);
          }
        });

        if (caught.length > 0) {
          setScore(s => s + caught.length);
          comboRef.current += caught.length;
          setCombo(comboRef.current);

          setParticles(prev => {
            const newParticles = caught.map(id => {
              const fruit = updated.find(f => f.id === id);
              if (!fruit) return null;
              return {
                id: particleIdRef.current++,
                x: fruit.x,
                y: fruit.y,
                emoji: '✨',
              };
            }).filter(Boolean);
            return [...prev, ...newParticles] as typeof prev;
          });

          setTimeout(() => {
            setParticles(prev => prev.filter(p => !caught.includes(p.id)));
          }, 500);
        }
        if (missed.length > 0) {
          comboRef.current = 0;
          setCombo(0);
          setLives(l => {
            const newLives = l - missed.length;
            if (newLives <= 0) {
              gameActiveRef.current = false;
              setGameOver(true);
              return 0;
            }
            return newLives;
          });
        }

        updated = updated.filter(f => f.y <= 100 && !caught.includes(f.id));

        const difficulty = Math.min(2000, 800 + (10 - Math.min(score, 50)) * 60);
        if (now - lastSpawnRef.current > difficulty) {
          const count = score > 30 ? 2 : 1;
          for (let i = 0; i < count; i++) {
            updated.push({
              id: fruitIdRef.current++,
              emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)],
              x: 5 + Math.random() * 90,
              y: -5,
              speed: 0.6 + Math.random() * 0.8 + Math.min(score * 0.01, 0.5),
              wobble: Math.random() * Math.PI * 2,
              scale: 0.8 + Math.random() * 0.4,
            });
          }
          lastSpawnRef.current = now;
        }

        return updated;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [started, gameOver, basketX, score]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('Sokopay_fruit_high_score', score.toString());
    }
  }, [gameOver, score, highScore]);

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="text-6xl mb-2 animate-bounce">🧺</div>
        <h3 className="text-xl font-bold text-text-primary">Fruit Basket</h3>
        <p className="text-text-secondary text-sm text-center max-w-xs">
          Catch falling fruits in your basket! Use arrow keys or touch to move.
        </p>
        <div className="flex gap-4 text-2xl my-2">
          {FRUITS.slice(0, 6).map((f, i) => (
            <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>{f}</span>
          ))}
        </div>
        <button
          onClick={startGame}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary-hover transition-all accent-glow"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-4 select-none">
      {/* Score bar */}
      <div className="flex items-center justify-between w-full max-w-sm px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧺</span>
          <span className="font-bold text-text-primary">{score}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-lg transition-all ${i < lives ? 'scale-100' : 'opacity-20 scale-75'}`}>❤️</span>
          ))}
        </div>
        {highScore > 0 && (
          <span className="text-xs text-text-tertiary">Best: {highScore}</span>
        )}
      </div>

      {/* Combo indicator */}
      {combo > 2 && (
        <div className="text-xs font-bold text-copper-400 animate-pulse">
          {combo}x Combo!
        </div>
      )}

      {/* Game canvas */}
      <div
        ref={canvasRef}
        className="relative w-full max-w-sm h-80 bg-gradient-to-b from-primary/5 to-surface rounded-2xl overflow-hidden border border-border"
      >
        {/* Fruits */}
        {fruits.map(fruit => (
          <div
            key={fruit.id}
            className="absolute text-3xl transition-none"
            style={{
              left: `${fruit.x}%`,
              top: `${fruit.y}%`,
              transform: `translate(-50%, -50%) scale(${fruit.scale})`,
            }}
          >
            {fruit.emoji}
          </div>
        ))}

        {/* Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute text-xl animate-ping"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {p.emoji}
          </div>
        ))}

        {/* Basket */}
        <div
          className="absolute text-4xl transition-none"
          style={{ left: `${basketX}%`, bottom: '4%', transform: 'translateX(-50%)' }}
        >
          {BASKET}
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-copper-400/30" />
      </div>

      {/* Controls hint */}
      <p className="text-xs text-text-tertiary">← → Arrow keys or swipe to move</p>

      {/* Game Over overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-2xl">
          <div className="bg-surface rounded-2xl p-6 text-center shadow-elevated border border-border max-w-xs">
            <div className="text-4xl mb-2">🧺</div>
            <h4 className="text-xl font-bold text-text-primary mb-1">Game Over!</h4>
            <p className="text-text-secondary mb-1">Score: <span className="font-bold text-primary">{score}</span></p>
            {score >= highScore && score > 0 && (
              <p className="text-copper-400 text-sm font-medium mb-3">🎉 New High Score!</p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={startGame}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors"
              >
                Play Again
              </button>
              {onExit && (
                <button
                  onClick={onExit}
                  className="flex-1 bg-surface-hover text-text-secondary py-2.5 rounded-lg font-medium hover:bg-surface transition-colors"
                >
                  Exit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
