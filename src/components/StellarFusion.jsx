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
  width: 600px;
  height: 600px;
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
  font-size: 20px;
  width: 80%;
  max-width: 500px;
  padding: 14px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  animation: ${fadeIn} 1s ease-in forwards;
  animation-delay: ${props => props.delay}s;
  z-index: 90;
  ${props => props.position === 'top' ? 'top: 20px;' : ''}
  ${props => props.position === 'bottom' ? 'bottom: 30px;' : ''}
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
  width: 540px;
  height: 540px;
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
  width: ${props => 320 * (1 - props.shrinkFactor * 0.33)}px;
  height: ${props => 320 * (1 - props.shrinkFactor * 0.33)}px;
  background: ${props => props.isHelium ? '#FFA500' : 'rgba(255, 140, 0, 0.8)'};
  border-radius: 50%;
  position: relative;
  transition: all 0.8s ease;
  overflow: hidden;
`;

const HydrogenAtom = styled.div`
  width: ${props => 20 * (1 - props.shrinkFactor * 0.33)}px;
  height: ${props => 20 * (1 - props.shrinkFactor * 0.33)}px;
  background: #4ee9f3;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transition: all 0.3s ease;
  box-shadow: 0 0 4px #222;
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
  width: ${props => props.size || 25}px;
  height: ${props => props.size || 25}px;
  background: ${props => props.color || '#FFA500'};
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
  // Restore individual useState hooks
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
  const [hydrogenAtoms, setHydrogenAtoms] = useState([]);
  const [fusionFlashes, setFusionFlashes] = useState([]);
  const [fusingParticles, setFusingParticles] = useState([]);
  const [fusingHelium, setFusingHelium] = useState(null);

  // Reset handler for dev
  const handleReset = () => {
    setCurrentStep(0);
    setPhase('intro');
    setSelectedAtoms([]);
    setFusionCount(0);
    setHeliumAtoms([]);
    setShowCore(false);
    setIsExpanding(false);
    setShowSupernova(false);
    setShowCarbonCore(false);
    setFusionParticles([]);
    setHydrogenAtoms([]);
    setFusionFlashes([]);
    setFusingParticles([]);
    setFusingHelium(null);
  };

  useEffect(() => {
    const timeline = [1000, 3000, 5000, 7000];
    
    timeline.forEach((delay, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
        if (index === timeline.length - 1) {
          setShowCore(true);
          setPhase('hydrogen');
          // Generate random hydrogen atom positions within a circle, avoiding overlap
          const atoms = [];
          const n = 25; // number of atoms
          const coreRadius = 155; // px, fits inside new CoreRegion
          const atomRadius = 14; // px, matches visual size
          const margin = 2; // px, extra margin
          const maxRadius = coreRadius - atomRadius - margin;
          const minDist = 32; // minimum distance between atoms (px)
          let attempts = 0;
          for (let i = 0; i < n; i++) {
            let placed = false;
            for (let tries = 0; tries < 100 && !placed; tries++) {
              let angle = Math.random() * 2 * Math.PI;
              let radius = Math.sqrt(Math.random()) * maxRadius;
              let dx = Math.cos(angle) * radius;
              let dy = Math.sin(angle) * radius;
              // Check for overlap
              let ok = true;
              for (let j = 0; j < atoms.length; j++) {
                let ddx = atoms[j].dx - dx;
                let ddy = atoms[j].dy - dy;
                if (Math.sqrt(ddx * ddx + ddy * ddy) < minDist) {
                  ok = false;
                  break;
                }
              }
              if (ok) {
                atoms.push({ id: i, dx, dy, isActive: true });
                placed = true;
              }
            }
            // If not placed after 100 tries, just skip this atom
          }
          setHydrogenAtoms(atoms);
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
            const firstGroup = fusionParticles.slice(0, 3);
            setFusingParticles(firstGroup.map(p => p.id));
            setFusionFlashes([{ id: Date.now(), x: 0, y: 0 }]);
            setTimeout(() => {
              setFusionParticles([
                ...fusionParticles.filter(p => !firstGroup.find(fg => fg.id === p.id)),
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
            const secondGroup = fusionParticles.slice(3, 6);
            setFusingParticles(secondGroup.map(p => p.id));
            setFusionFlashes([{ id: Date.now() + 1, x: -30, y: 30 }]);
            setTimeout(() => {
              setFusionParticles([
                ...fusionParticles.filter(p => !secondGroup.find(sg => sg.id === p.id)),
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
  }, [phase, fusionParticles]);

  // Distance-based selection for fusion
  const canFuse = (atom1, atom2) => {
    if (!atom1 || !atom2) return false;
    const originalRadius = 155;
    const currentRadius = 320 * (1 - fusionCount * 0.33) / 2;
    const center = currentRadius;
    const scale = currentRadius / originalRadius;
    const x1 = center + atom1.dx * scale;
    const y1 = center + atom1.dy * scale;
    const x2 = center + atom2.dx * scale;
    const y2 = center + atom2.dy * scale;
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy) < 50; // 50px threshold
  };

  const handleAtomClick = (id) => {
    if (phase !== 'hydrogen') return;
    const atomIndex = hydrogenAtoms.findIndex(a => a.id === id);
    if (atomIndex === -1 || !hydrogenAtoms[atomIndex].isActive) return;
    if (selectedAtoms.length === 0) {
      setSelectedAtoms([id]);
    } else if (selectedAtoms.length === 1) {
      if (selectedAtoms[0] === id) {
        setSelectedAtoms([]);
        return;
      }
      // Check if the new atom is close enough to fuse
      const atom1 = hydrogenAtoms.find(a => a.id === selectedAtoms[0]);
      const atom2 = hydrogenAtoms.find(a => a.id === id);
      if (canFuse(atom1, atom2)) {
        // Mark atoms as fusing (white)
        setHydrogenAtoms(hydrogenAtoms.map(a =>
          a.id === selectedAtoms[0] || a.id === id ? { ...a, fusing: true } : a
        ));
        // After 400ms, hide hydrogens and show helium
        setTimeout(() => {
          // Remove the two hydrogens
          setHydrogenAtoms(hydrogenAtoms => hydrogenAtoms.map(a =>
            a.id === selectedAtoms[0] || a.id === id ? { ...a, isActive: false, fusing: false } : a
          ));
          // Calculate actual rendered positions for both hydrogens
          const originalRadius = 155;
          const currentRadius = 320 * (1 - fusionCount * 0.33) / 2;
          const center = currentRadius;
          const scale = currentRadius / originalRadius;
          const x1 = center + atom1.dx * scale;
          const y1 = center + atom1.dy * scale;
          const x2 = center + atom2.dx * scale;
          const y2 = center + atom2.dy * scale;
          // Midpoint
          const x = (x1 + x2) / 2;
          const y = (y1 + y2) / 2;
          // Outward direction: from core center to midpoint
          const dirX = x - center;
          const dirY = y - center;
          const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
          const normX = dirX / dirLen;
          const normY = dirY / dirLen;
          const distance = 180; // how far to animate out
          const moveX = normX * distance;
          const moveY = normY * distance;
          setFusingHelium({
            id: Date.now(),
            x,
            y,
            moveX,
            moveY
          });
          // After animation, remove helium and increment fusion count
          setTimeout(() => {
            setFusingHelium(null);
            setFusionCount(fusionCount => {
              const newCount = fusionCount + 1;
              if (newCount === 3) {
                setTimeout(() => {
                  setPhase('helium');
                }, 2000);
              }
              return newCount;
            });
          }, 1200);
        }, 400);
        setSelectedAtoms([]);
      } else {
        setSelectedAtoms([id]);
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
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
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
            {phase === 'hydrogen' && hydrogenAtoms.map((atom) => {
              if (!atom.isActive && !atom.fusing) return null;
              const originalRadius = 155;
              const currentRadius = 320 * (1 - fusionCount * 0.33) / 2;
              const center = currentRadius;
              const scale = currentRadius / originalRadius;
              const x = center + atom.dx * scale;
              const y = center + atom.dy * scale;
              return (
                <HydrogenAtom
                  key={atom.id}
                  className={selectedAtoms.includes(atom.id) ? 'selected' : ''}
                  onClick={() => handleAtomClick(atom.id)}
                  shrinkFactor={fusionCount}
                  x={x}
                  y={y}
                  style={{ background: atom.fusing ? '#fff' : undefined }}
                />
              );
            })}
            {/* Render the fusing helium atom inside CoreRegion */}
            {fusingHelium && (
              <HeliumAtom
                key={fusingHelium.id}
                moveX={fusingHelium.moveX}
                moveY={fusingHelium.moveY}
                size={28}
                color={'#4361ee'}
                style={{
                  left: `${fusingHelium.x}px`,
                  top: `${fusingHelium.y}px`,
                  opacity: 1,
                  transform: 'translate(0, 0)'
                }}
              />
            )}
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
    </div>
  );
};

export default StellarFusion;