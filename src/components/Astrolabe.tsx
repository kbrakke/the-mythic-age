import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Ring from './Ring';
import { Sun, Moon, Star, Orbit } from 'lucide-react';

// Define the symbol type
type SymbolName = 'Sun' | 'Moon' | 'Star' | 'Orbit';

interface RingData {
  id: number;
  symbols: SymbolName[];
  rotation: number;
}

// Define the solution as the correct rotation for each ring
interface AstrolabeProps {
  solution?: number[]; // Array of correct rotations for each ring (in degrees)
}

const Astrolabe: React.FC<AstrolabeProps> = ({ solution = [0, 0, 0] }) => {
  // Define the initial state of the rings
  const [rings, setRings] = useState<RingData[]>([
    { id: 0, symbols: ["Sun", "Orbit", "Moon", "Star"], rotation: 0 },
    { id: 1, symbols: ["Moon", "Orbit", "Sun", "Star"], rotation: 0 },
    { id: 2, symbols: ["Orbit", "Moon", "Star", "Sun"], rotation: 0 }
  ]);

  const [solved, setSolved] = useState(false);
  const [message, setMessage] = useState("");
  const [soundsLoaded, setSoundsLoaded] = useState(false);

  // Use useRef instead of useState for audio objects to avoid hook issues
  const rotationSoundRef = useRef<HTMLAudioElement | null>(null);
  const solvedSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    // Create audio elements
    rotationSoundRef.current = new Audio('/sounds/click.mp3');
    solvedSoundRef.current = new Audio('/sounds/solved.mp3');

    // Preload the sounds
    if (rotationSoundRef.current && solvedSoundRef.current) {
      Promise.all([
        rotationSoundRef.current.load(),
        solvedSoundRef.current.load()
      ]).then(() => {
        setSoundsLoaded(true);
      }).catch(error => {
        console.error("Error loading sounds:", error);
      });
    }

    // Cleanup function
    return () => {
      if (rotationSoundRef.current) {
        rotationSoundRef.current.pause();
        rotationSoundRef.current = null;
      }
      if (solvedSoundRef.current) {
        solvedSoundRef.current.pause();
        solvedSoundRef.current = null;
      }
    };
  }, []);

  // Check if the puzzle is solved
  useEffect(() => {
    // Check if all rings are in the correct position based on the solution
    const isSolved = rings.every((ring, index) =>
      ring.rotation % 360 === solution[index] % 360
    );

    if (isSolved && !solved) {
      setSolved(true);
      setMessage("The astrolabe aligns to reveal: 'Where the delta meets the sea on the new moon'");

      // Play solved sound
      if (solvedSoundRef.current && soundsLoaded) {
        // Reset the audio to the beginning
        solvedSoundRef.current.currentTime = 0;

        // Play the sound with a catch for browsers that require user interaction
        const playPromise = solvedSoundRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Audio playback prevented by browser:", error);
          });
        }
      }
    } else if (!isSolved && solved) {
      setSolved(false);
      setMessage("");
    }
  }, [rings, solved, solution, soundsLoaded]);

  const rotateRing = (ringId: number) => {
    if (solved) return; // Don't allow rotation if puzzle is solved

    // Play rotation sound
    if (rotationSoundRef.current && soundsLoaded) {
      // Reset the audio to the beginning
      rotationSoundRef.current.currentTime = 0;

      // Play the sound with a catch for browsers that require user interaction
      const playPromise = rotationSoundRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Audio playback prevented by browser:", error);
        });
      }
    }

    setRings(rings.map(ring => {
      if (ring.id === ringId) {
        const newRotation = (ring.rotation + 90) % 360;
        return { ...ring, rotation: newRotation };
      }
      return ring;
    }));
  };

  // Calculate ring sizes with consistent spacing
  const containerSize = 400;
  const outerRingDiameter = containerSize - 20; // Leave a small margin
  const ringSpacing = 40; // Consistent spacing between rings

  // Calculate diameters for each ring
  const ringDiameters = [
    outerRingDiameter,
    outerRingDiameter - (ringSpacing * 2),
    outerRingDiameter - (ringSpacing * 4)
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Cadaan Carical's Astrolabe Cipher</h2>
      <p className="text-sm text-slate-300 mb-6">Align the celestial bodies to reveal the location of the astronomer's observation point.</p>

      {/* Main astrolabe container with fixed size */}
      <div className="relative w-[400px] h-[400px] bg-black rounded-full overflow-hidden flex items-center justify-center">
        {rings.map((ring, index) => (
          <div
            key={ring.id}
            className="absolute"
            style={{
              width: containerSize,
              height: containerSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ring
              diameter={ringDiameters[index]}
              symbols={ring.symbols}
              rotation={ring.rotation}
              onRotate={() => rotateRing(ring.id)}
              isLocked={solved}
              ringIndex={index}
            />
          </div>
        ))}

        <motion.div
          className="absolute text-white text-center w-[120px] z-30 pointer-events-none"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: solved ? 0 : 0.7 }}
        >
          {solved ? "" : "Click on a ring to rotate"}
        </motion.div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            className={`mt-6 p-4 rounded-lg ${solved ? 'bg-yellow-100 text-yellow-900' : 'bg-slate-700 text-slate-400'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 text-sm text-slate-400">
        <p>Click on each ring to rotate it clockwise.</p>
        {solved && (
          <motion.p
            className="mt-2 text-yellow-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Puzzle solved! The location has been revealed.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Astrolabe;