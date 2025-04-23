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
  z-index: 90;
  ${props => props.position === 'top' ? 'top: 20px;' : ''}
  ${props => props.position === 'bottom' ? 'bottom: 100px;' : ''}
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

const expandAndShake = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.5); }
  45% { transform: scale(1.5) translate(5px, 2px); }
  50% { transform: scale(1.5) translate(-4px, -3px); }
  55% { transform: scale(1.5) translate(3px, 2px); }
  60% { transform: scale(1.5) translate(-2px, -1px); }
  65% { transform: scale(1.5) translate(1px, 1px); }
  100% { transform: scale(1.5); }
`;

const pulseGlow = keyframes`
  0% { 
    filter: brightness(1);
    transform: scale(1);
  }
  50% { 
    filter: brightness(1.5);
    transform: scale(1.1);
  }
  100% { 
    filter: brightness(1);
    transform: scale(1);
  }
`;

const heliumFusion = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); filter: brightness(1.3); }
  100% { transform: scale(1); filter: brightness(1); }
`;

const carbonFusion = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); filter: brightness(1.5); }
  100% { transform: scale(1); filter: brightness(1); }
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
  animation: ${props => {
    if (props.isIntro) return zoomIn;
    if (props.isExpanding) return expandAndShake;
    return 'none';
  }} 3s ${props => props.isExpanding ? 'ease-in-out forwards' : 'ease-out'};
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

const moveToCenter = keyframes`
  0% { transform: translate(var(--startX), var(--startY)) scale(1); }
  50% { transform: translate(0, 0) scale(0.8); }
  100% { transform: translate(var(--endX), var(--endY)) scale(1); }
`;

const fusionGlow = keyframes`
  0% { box-shadow: 0 0 10px var(--glow-color); }
  50% { box-shadow: 0 0 30px var(--glow-color), 0 0 50px var(--glow-color); }
  100% { box-shadow: 0 0 10px var(--glow-color); }
`;

const FusionParticle = styled.div`
  width: ${props => props.type === 'helium' ? '15px' : '25px'};
  height: ${props => props.type === 'helium' ? '15px' : '25px'};
  background: ${props => props.type === 'helium' ? '#FFA500' : '#8B4513'};
  border-radius: 50%;
  position: absolute;
  opacity: 1;
  --glow-color: ${props => props.type === 'helium' ? 'rgba(255, 165, 0, 0.6)' : 'rgba(139, 69, 19, 0.6)'};
  --startX: ${props => props.startX}px;
  --startY: ${props => props.startY}px;
  --endX: ${props => props.endX}px;
  --endY: ${props => props.endY}px;
  animation: ${props => props.isFusing ? moveToCenter : props.type === 'helium' ? heliumFusion : carbonFusion} ${props => props.isFusing ? '3s' : '2s'} 
    ${props => props.isFusing ? 'forwards' : 'infinite'} ease-in-out,
    ${fusionGlow} 2s infinite ease-in-out;
  transform: translate(${props => props.x}px, ${props => props.y}px);
`;

const FusionFlash = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(255,165,0,0.8) 0%, rgba(255,165,0,0) 70%);
  border-radius: 50%;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  animation: ${pulseGlow} 1s infinite ease-in-out;
`;

const SupernovaButton = styled.button`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  font-size: 20px;
  background: linear-gradient(45deg, #FF4444, #FF6B6B);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0;
  animation: ${fadeIn} 1s ease-in forwards;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 68, 68, 0.4);
  z-index: 100;
  pointer-events: auto;

  &:hover {
    transform: translateX(-50%) scale(1.1);
    background: linear-gradient(45deg, #FF6666, #FF8888);
    box-shadow: 0 4px 12px rgba(255, 68, 68, 0.6);
  }
`;

const HeliumCore = styled.div`
  width: 100%;
  height: 100%;
  background: #FFA500;
  border-radius: 50%;
  position: absolute;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.5s ease;
  animation: ${props => props.show ? pulseGlow : 'none'} 2s infinite ease-in-out,
             ${props => props.show ? heliumFusion : 'none'} 3s infinite ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &::after {
    content: '';
    position: absolute;
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(255,165,0,0.3) 0%, rgba(255,165,0,0) 70%);
    animation: ${pulseGlow} 2s infinite ease-in-out;
  }
`;

const CarbonCore = styled.div`
  width: 100%;
  height: 100%;
  background: #8B4513;
  border-radius: 50%;
  position: absolute;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.5s ease;
  animation: ${props => props.show ? pulseGlow : 'none'} 2s infinite ease-in-out,
             ${props => props.show ? carbonFusion : 'none'} 3s infinite ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &::after {
    content: '';
    position: absolute;
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(139,69,19,0.3) 0%, rgba(139,69,19,0) 70%);
    animation: ${pulseGlow} 2s infinite ease-in-out;
  }
`;

const StellarFusion = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState('intro');
  const [selectedAtoms, setSelectedAtoms] = useState([]);
  const [fusionCount, setFusionCount] = useState(0);
  const [heliumAtoms, setHeliumAtoms] = useState([]);
  const [showCore, setShowCore] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [showSupernova, setShowSupernova] = useState(false);
  const [showCarbonCore, setShowCarbonCore] = useState(false);
  const [fusionParticles, setFusionParticles] = useState([]);
  const [hydrogenPositions] = useState(Array(9).fill(null).map((_, i) => ({
    id: i,
    isActive: true
  })));
  const [fusionFlashes, setFusionFlashes] = useState([]);
  const [fusingParticles, setFusingParticles] = useState([]);

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

  useEffect(() => {
    if (phase === 'helium') {
      const sequence = async () => {
        // Show helium core
        setShowCore(true);
        
        // Create initial helium particles in two rings
        const heliumParticles = [];
        // Inner ring
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 60;
          heliumParticles.push({
            id: Date.now() + i,
            type: 'helium',
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            isFusing: false
          });
        }
        // Outer ring
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
          const radius = 100;
          heliumParticles.push({
            id: Date.now() + 100 + i,
            type: 'helium',
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            isFusing: false
          });
        }
        setFusionParticles(heliumParticles);

        // Start fusion sequence
        setTimeout(() => {
          setIsExpanding(true);
          
          // Fusion animation sequence
          const fusionSequence = async () => {
            // First fusion group
            await new Promise(resolve => setTimeout(resolve, 1000));
            const firstGroup = heliumParticles.slice(0, 3);
            setFusingParticles(firstGroup.map(p => p.id));
            setFusionFlashes([{ id: Date.now(), x: 0, y: 0 }]);
            
            // Create first carbon
            setTimeout(() => {
              setFusionParticles(prev => [
                ...prev.filter(p => !firstGroup.find(fg => fg.id === p.id)),
                {
                  id: Date.now() + 1000,
                  type: 'carbon',
                  x: 30,
                  y: 30,
                  isFusing: false
                }
              ]);
              setFusionFlashes([]);
            }, 3000);

            // Second fusion group
            await new Promise(resolve => setTimeout(resolve, 4000));
            const secondGroup = heliumParticles.slice(3, 6);
            setFusingParticles(secondGroup.map(p => p.id));
            setFusionFlashes([{ id: Date.now() + 1, x: -30, y: 30 }]);

            // Create second carbon
            setTimeout(() => {
              setFusionParticles(prev => [
                ...prev.filter(p => !secondGroup.find(sg => sg.id === p.id)),
                {
                  id: Date.now() + 2000,
                  type: 'carbon',
                  x: -30,
                  y: -30,
                  isFusing: false
                }
              ]);
              setFusionFlashes([]);
            }, 3000);
          };

          fusionSequence().then(() => {
            // Show carbon core
            setTimeout(() => {
              setShowCarbonCore(true);
              // Show supernova button
              setTimeout(() => {
                setShowSupernova(true);
              }, 1000);
            }, 2000);
          });
        }, 2000);
      };
      
      sequence();
    }
  }, [phase]);

  const isAdjacent = (index1, index2) => {
    if (index1 === index2) return false;
    
    // Convert indexes to grid positions
    const row1 = Math.floor(index1 / 3);
    const col1 = index1 % 3;
    const row2 = Math.floor(index2 / 3);
    const col2 = index2 % 3;

    // Check if atoms are at most one cell apart in any direction
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);

    return rowDiff <= 1 && colDiff <= 1;
  };

  const handleAtomClick = (index) => {
    if (phase !== 'hydrogen') return;
    if (!hydrogenPositions[index].isActive) return;

    if (selectedAtoms.length === 0) {
      // First atom selected
      setSelectedAtoms([index]);
    } else if (selectedAtoms.length === 1) {
      if (selectedAtoms[0] === index) {
        // Clicked same atom twice, deselect it
        setSelectedAtoms([]);
        return;
      }

      // Check if the new atom is adjacent to the first selected atom
      if (isAdjacent(selectedAtoms[0], index)) {
        // Calculate center position for helium
        const row1 = Math.floor(selectedAtoms[0] / 3);
        const col1 = selectedAtoms[0] % 3;
        const row2 = Math.floor(index / 3);
        const col2 = index % 3;
        
        const centerX = ((col1 + col2) / 2) * 40;
        const centerY = ((row1 + row2) / 2) * 40;

        // Random direction for helium movement
        const angle = Math.random() * Math.PI * 2;
        const distance = 100;
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        const newHeliumAtom = {
          id: Date.now(),
          moveX,
          moveY,
          x: centerX,
          y: centerY
        };

        // Update state
        setHeliumAtoms(prev => [...prev, newHeliumAtom]);
        
        // Mark atoms as inactive
        const newPositions = [...hydrogenPositions];
        newPositions[selectedAtoms[0]].isActive = false;
        newPositions[index].isActive = false;

        setFusionCount(prev => {
          const newCount = prev + 1;
          if (newCount === 3) {
            setTimeout(() => {
              setPhase('helium');
            }, 2000);
          }
          return newCount;
        });

        // Clear selection
        setSelectedAtoms([]);
      } else {
        // Not adjacent, select the new atom instead
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
      <Star 
        isIntro={currentStep === 1} 
        isExpanding={isExpanding}
      >
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
          {phase === 'helium' && <HeliumCore show={true} />}
          {phase === 'helium' && <CarbonCore show={showCarbonCore} />}
          {phase === 'helium' && fusionParticles.map(particle => (
            <FusionParticle
              key={particle.id}
              type={particle.type}
              x={particle.x}
              y={particle.y}
              isFusing={fusingParticles.includes(particle.id)}
              startX={particle.x}
              startY={particle.y}
              endX={particle.type === 'helium' ? 0 : particle.x}
              endY={particle.type === 'helium' ? 0 : particle.y}
            />
          ))}
          {fusionFlashes.map(flash => (
            <FusionFlash
              key={flash.id}
              show={true}
              style={{
                transform: `translate(${flash.x}px, ${flash.y}px)`
              }}
            />
          ))}
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

      {/* Text prompts */}
      {phase === 'hydrogen' && showCore && (
        <Text position="bottom" delay={0}>
          The massive gravity in the center of stars pulls hydrogen atoms together.
          Try it yourself - click two adjacent hydrogen atoms to fuse them!
        </Text>
      )}

      {phase === 'helium' && (
        <Text position="bottom" delay={0}>
          When the hydrogen fuel in the core runs out, the core expands and begins 
          fusing helium into heavier elements. The core begins to heat rapidly and expand.
        </Text>
      )}

      {/* Supernova button */}
      {showSupernova && (
        <SupernovaButton onClick={() => setPhase('supernova')}>
          Supernova
        </SupernovaButton>
      )}
    </Container>
  );
};

export default StellarFusion;