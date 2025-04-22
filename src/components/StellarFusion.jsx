import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const zoomIn = keyframes`
  from { transform: scale(0.1); }
  to { transform: scale(1); }
`;

const twinkle = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const moveOut = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(100px, -100px) scale(0.8); opacity: 0; }
`;

const Container = styled.div`
  width: 500px;
  height: 500px;
  background: #000;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const BackgroundStar = styled.div`
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  position: absolute;
  animation: ${twinkle} 2s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
`;

const Text = styled.div`
  color: white;
  position: absolute;
  text-align: center;
  font-size: 18px;
  width: 80%;
  max-width: 400px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  animation: ${fadeIn} 1s ease-in forwards;
  animation-delay: ${props => props.delay}s;
  z-index: 10;
  ${props => props.position === 'top' ? 'top: 20px;' : ''}
  ${props => props.position === 'bottom' ? 'bottom: 20px;' : ''}
  ${props => props.position === 'middle' ? 'top: 50%; transform: translateY(-50%);' : ''}
`;

const PhaseLabel = styled.div`
  color: white;
  position: absolute;
  top: 20px;
  text-align: center;
  font-size: 24px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 10;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-in forwards;
  animation-delay: ${props => props.delay}s;
`;

const Star = styled.div`
  width: 300px;
  height: 300px;
  background: #FFD700;
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  animation: ${props => props.isIntro ? zoomIn : 'none'} 2s ease-out;
  transform: ${props => props.scale ? `scale(${props.scale})` : 'scale(1)'};
`;

const CoreRegion = styled.div`
  width: ${props => 150 * (1 - props.shrinkFactor * 0.33)}px;
  height: ${props => 150 * (1 - props.shrinkFactor * 0.33)}px;
  background: ${props => props.isHelium ? '#FFA500' : 'rgba(255, 140, 0, 0.8)'};
  border-radius: 50%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: ${props => 15 * (1 - props.shrinkFactor * 0.33)}px;
  padding: ${props => 20 * (1 - props.shrinkFactor * 0.33)}px;
  transition: all 0.8s ease;
  place-items: center;
`;

const HydrogenAtom = styled.div`
  width: ${props => 20 * (1 - props.shrinkFactor * 0.33)}px;
  height: ${props => 20 * (1 - props.shrinkFactor * 0.33)}px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
    background: #87CEEB;
  }

  &.selected {
    background: #87CEEB;
    transform: scale(1.2);
  }
`;

const moveOutAndFade = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--moveX), var(--moveY)) scale(0.8);
    opacity: 0;
  }
`;

const HeliumAtom = styled.div`
  width: 25px;
  height: 25px;
  background: #FFA500;
  border-radius: 50%;
  position: absolute;
  opacity: 0;
  --moveX: ${props => props.moveX}px;
  --moveY: ${props => props.moveY}px;
  animation: ${moveOutAndFade} 2s forwards;
`;

const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const HeliumCore = styled.div`
  width: 100%;
  height: 100%;
  background: #FFA500;
  border-radius: 50%;
  position: absolute;
  animation: ${fadeInScale} 1s forwards;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StellarFusion = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState('intro');
  const [selectedAtoms, setSelectedAtoms] = useState([]);
  const [fusionCount, setFusionCount] = useState(0);
  const [heliumAtoms, setHeliumAtoms] = useState([]);
  const [showCore, setShowCore] = useState(false);
  const [hydrogenPositions] = useState(Array(9).fill(null).map((_, i) => ({
    id: i,
    isActive: true
  })));

  useEffect(() => {
    const timeline = [1000, 3000, 5000, 7000];
    
    timeline.forEach((delay, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
        if (index === timeline.length - 1) {
          setShowCore(true);
          setPhase('hydrogen');
        }
      }, delay);
    });
  }, []);

  const isAdjacent = (index1, index2) => {
    const positions = [
      [0, 1], [1, 0], [1, 1],  // Right, Down, Diagonal
      [-1, 0], [0, -1], [-1, -1],  // Left, Up, Diagonal
      [-1, 1], [1, -1]  // Other diagonals
    ];
    
    const row1 = Math.floor(index1 / 3);
    const col1 = index1 % 3;
    const row2 = Math.floor(index2 / 3);
    const col2 = index2 % 3;

    return positions.some(([rowDiff, colDiff]) => {
      const newRow = row1 + rowDiff;
      const newCol = col1 + colDiff;
      return newRow === row2 && newCol === col2 && 
             newRow >= 0 && newRow < 3 && 
             newCol >= 0 && newCol < 3;
    });
  };

  const handleAtomClick = (index) => {
    if (phase !== 'hydrogen' || !hydrogenPositions[index].isActive) return;

    if (selectedAtoms.length === 0) {
      setSelectedAtoms([index]);
    } else if (selectedAtoms.length === 1) {
      if (isAdjacent(selectedAtoms[0], index) && selectedAtoms[0] !== index) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100;
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        const newHeliumAtom = {
          id: Date.now(),
          moveX,
          moveY,
          x: (index % 3) * 30,
          y: Math.floor(index / 3) * 30
        };

        setHeliumAtoms(prev => [...prev, newHeliumAtom]);
        setFusionCount(prev => {
          const newCount = prev + 1;
          if (newCount === 3) {
            setTimeout(() => {
              setPhase('helium');
            }, 2000);
          }
          return newCount;
        });
        
        hydrogenPositions[selectedAtoms[0]].isActive = false;
        hydrogenPositions[index].isActive = false;
        setSelectedAtoms([]);
      } else {
        setSelectedAtoms([index]);
      }
    }
  };

  // Generate random positions for background stars
  const backgroundStars = [...Array(50)].map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2
  }));

  return (
    <Container>
      {/* Background stars */}
      {backgroundStars.map((star, i) => (
        <BackgroundStar
          key={i}
          style={{ top: star.top, left: star.left }}
          delay={star.delay}
        />
      ))}

      {/* Intro text */}
      {currentStep >= 1 && currentStep < 4 && (
        <Text position="middle" delay={0}>
          In our current universe, most elements are made in the center of stars
        </Text>
      )}

      {/* Phase label */}
      {phase !== 'intro' && (
        <PhaseLabel>
          {phase === 'hydrogen' ? 'Hydrogen Fusion' : 'Helium Fusion'}
        </PhaseLabel>
      )}
      
      {/* Main star */}
      <Star isIntro={currentStep === 1} scale={currentStep >= 3 ? 1.5 : 1}>
        <CoreRegion 
          shrinkFactor={fusionCount}
          isHelium={phase === 'helium'}
          show={showCore}
        >
          {phase === 'hydrogen' && hydrogenPositions.map((pos, index) => (
            pos.isActive && (
              <HydrogenAtom
                key={pos.id}
                className={selectedAtoms.includes(index) ? 'selected' : ''}
                onClick={() => handleAtomClick(index)}
                shrinkFactor={fusionCount}
              />
            )
          ))}
          {phase === 'helium' && <HeliumCore />}
        </CoreRegion>
        {heliumAtoms.map(helium => (
          <HeliumAtom
            key={helium.id}
            moveX={helium.moveX}
            moveY={helium.moveY}
            style={{
              left: `${helium.x}px`,
              top: `${helium.y}px`
            }}
          />
        ))}
      </Star>

      {/* Interaction prompt */}
      {phase === 'hydrogen' && showCore && (
        <Text position="bottom" delay={0}>
          The massive gravity in the center of stars pulls hydrogen atoms together.
          Try it yourself - click two adjacent hydrogen atoms to fuse them!
        </Text>
      )}
    </Container>
  );
};

export default StellarFusion;