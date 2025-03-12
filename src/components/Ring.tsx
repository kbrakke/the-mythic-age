import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Star, Orbit } from 'lucide-react';

// Define the symbol type to ensure proper indexing
type SymbolName = 'Sun' | 'Moon' | 'Star' | 'Orbit';

// Define proper types for the Ring component props
interface RingProps {
  diameter: number;
  symbols: SymbolName[];
  rotation: number;
  onRotate: () => void;
  isLocked: boolean;
  ringIndex: number;
}

const Ring: React.FC<RingProps> = ({
  diameter,
  symbols,
  rotation,
  onRotate,
  isLocked,
  ringIndex
}) => {
  const radius = diameter / 2;
  const strokeWidth = 2;
  const symbolSize = 24;

  // Function to render the appropriate symbol using Lucide icons
  const renderSymbol = (symbol: SymbolName) => {
    const props = { size: symbolSize, color: "white", strokeWidth: 1.5 };

    switch (symbol) {
      case 'Sun':
        return <Sun {...props} />;
      case 'Moon':
        return <Moon {...props} />;
      case 'Star':
        return <Star {...props} />;
      case 'Orbit':
        return <Orbit {...props} />;
      default:
        return null;
    }
  };


  return (
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      onClick={isLocked ? undefined : onRotate}
      style={{
        width: diameter,
        height: diameter,
        cursor: isLocked ? 'default' : 'pointer',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -diameter / 2,
        marginTop: -diameter / 2,
        // Reverse the z-index so inner rings are on top
        zIndex: 20 + ringIndex
      }}
    >
      {/* Ring circle */}
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        className="absolute top-0 left-0"
      >
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          stroke={isLocked ? "#ffcc00" : "white"}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </svg>

      {/* Symbols positioned around the ring */}
      {symbols.map((symbol, index) => {
        // Calculate position around the circle - 90 degrees apart
        const angle = (index) * (Math.PI / 2);

        let angleXOffset = 0;
        let angleYOffset = 0;

        if (angle == 0) {
          angleXOffset = -2 - symbolSize / 2;
          angleYOffset = -2;
        }

        if (angle == Math.PI / 2) {
          angleYOffset = -symbolSize - 2;
          angleXOffset = -symbolSize - 2;
        }

        if (angle == Math.PI) {
          angleYOffset = -symbolSize * 2;
          angleXOffset = -symbolSize / 2;
        }

        if (angle == 3 * Math.PI / 2) {
          angleYOffset = -symbolSize - 2;
          angleXOffset = symbolSize / 2 - 2;
        }


        // Calculate final position with custom offsets
        const x = radius + Math.sin(angle) * radius + angleXOffset
        const y = radius - Math.cos(angle) * radius + angleYOffset


        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: symbolSize,
              height: symbolSize,
              left: `${x}px`,
              top: `${y}px`,
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {renderSymbol(symbol)}
          </div>
        );
      })}
    </motion.div>
  );
};

export default Ring; 