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
  z-index: 0;
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

const floatHelium = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(4px, -4px) scale(1.05); }
  50% { transform: translate(-4px, 4px) scale(0.97); }
  75% { transform: translate(2px, -2px) scale(1.03); }
  100% { transform: translate(0, 0) scale(1); }
`;

const moveOutAndFade = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  85% {
    transform: translate(calc(var(--moveX) * 0.95), calc(var(--moveY) * 0.95)) scale(0.9);
    opacity: 0.7;
  }
  100% {
    transform: translate(var(--moveX), var(--moveY)) scale(0.8);
    opacity: 0;
  }
`;

const moveToFuse = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
  }
  80% {
    transform: translate(var(--moveToX), var(--moveToY)) scale(0.9);
    opacity: 1;
  }
  100% {
    transform: translate(var(--moveToX), var(--moveToY)) scale(0.5);
    opacity: 0;
  }
`;

const HeliumAtom = styled.div`
  width: ${props => props.size || 25}px;
  height: ${props => props.size || 25}px;
  background: ${props => props.color || '#4361ee'};
  border-radius: 50%;
  position: absolute;
  opacity: 1;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  animation: ${props => {
    if (props.phase === 'hydrogen' && props.fusing) return moveOutAndFade;
    if (props.phase === 'helium' && props.isFusing) return moveToFuse;
    return floatHelium;
  }} ${props => {
    if (props.phase === 'hydrogen' && props.fusing) return '1.5s';
    if (props.phase === 'helium' && props.isFusing) return '1s';
    return '2.5s';
  }} ${props => (props.fusing || props.isFusing) ? 'forwards' : 'infinite'} ease-in-out;
  --moveX: ${props => props.moveX}px;
  --moveY: ${props => props.moveY}px;
  --moveToX: ${props => props.moveToX}px;
  --moveToY: ${props => props.moveToY}px;
  z-index: 100;
  pointer-events: none;
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
  0% { 
    transform: translate(var(--startX), var(--startY)) scale(1);
    opacity: 1;
  }
  75% { 
    transform: translate(calc(var(--startX) * 0.2), calc(var(--startY) * 0.2)) scale(0.9);
    opacity: 1;
  }
  100% { 
    transform: translate(var(--endX), var(--endY)) scale(0.6);
    opacity: 0;
  }
`;

const fusionGlow = keyframes`
  0% { box-shadow: 0 0 10px var(--glow-color); }
  40% { box-shadow: 0 0 20px var(--glow-color); }
  70% { box-shadow: 0 0 40px var(--glow-color), 0 0 60px var(--glow-color); }
  100% { box-shadow: 0 0 10px var(--glow-color); }
`;

const moveOutAndFadeRed = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--moveX), var(--moveY)) scale(0.8);
    opacity: 0;
  }
`;

const appearAndFade = keyframes`
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  20% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

const FusionParticle = styled.div`
  width: ${props => props.type === 'helium' ? '25px' : props.type === 'carbon' ? '35px' : '30px'};
  height: ${props => props.type === 'helium' ? '25px' : props.type === 'carbon' ? '35px' : '30px'};
  background: ${props => {
    switch(props.type) {
      case 'helium': return '#4361ee';
      case 'carbon': return '#8B4513';
      case 'heavier': return '#ff0000';
      default: return '#FFA500';
    }
  }};
  border-radius: 50%;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  opacity: 1;
  --glow-color: ${props => {
    switch(props.type) {
      case 'helium': return 'rgba(67, 97, 238, 0.6)';
      case 'carbon': return 'rgba(139, 69, 19, 0.6)';
      case 'heavier': return 'rgba(255, 0, 0, 0.6)';
      default: return 'rgba(255, 165, 0, 0.6)';
    }
  }};
  animation: ${props => props.isAppearing ? appearAndFade : props.type === 'helium' ? heliumFusion : carbonFusion} 
    ${props => props.isAppearing ? '1.5s' : '2s'} 
    ${props => props.isAppearing ? 'forwards' : 'infinite'} ease-in-out,
    ${fusionGlow} 2s infinite ease-in-out;
  transition: all 0.3s ease-in-out;
`;

const FusionFlash = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255,165,0,0.9) 0%, rgba(255,165,0,0) 70%);
  border-radius: 50%;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  animation: ${pulseGlow} 1s infinite ease-in-out;
  transform: scale(1.5);
`;

const SupernovaButton = styled.button`
  margin-top: 24px;
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
    transform: scale(1.1);
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
  animation: ${props => props.show ? heliumFusion : 'none'} 3s infinite ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &::after {
    content: '';
    position: absolute;
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(255,165,0,0.3) 0%, rgba(255,165,0,0) 70%);
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

const STAR_SIZE = 540;
const HYDROGEN_CORE_SIZE = 320;
const HELIUM_CORE_SIZE = 0.75 * STAR_SIZE; // 75% of star

const growAndShake = keyframes`
  0% { 
    transform: scale(1); 
  }
  70% { 
    transform: scale(1.15); 
  }
  75% { 
    transform: scale(1.15) translate(8px, -5px); 
  }
  80% { 
    transform: scale(1.15) translate(-7px, 3px); 
  }
  85% { 
    transform: scale(1.15) translate(5px, -2px); 
  }
  90% { 
    transform: scale(1.15) translate(-3px, 1px); 
  }
  95% { 
    transform: scale(1.15) translate(2px, -1px); 
  }
  100% { 
    transform: scale(1.15); 
  }
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
    if (props.isHeliumPhase) return growAndShake;
    if (props.isExpanding) return expandAndShake;
    return 'none';
  }} ${props => props.isHeliumPhase ? '8s' : '3s'} 
    ${props => props.isHeliumPhase ? 'forwards' : props.isExpanding ? 'ease-in-out forwards' : 'ease-out'};
  z-index: 1;
`;

const energyPulse = keyframes`
  0% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
`;

const CoreRegion = styled.div`
  width: ${props => {
    if (props.isHelium) {
      const size = props.hydrogenSize + (props.heliumSize - props.hydrogenSize) * props.expandFactor;
      return size + 'px';
    } else {
      return 320 * (1 - props.shrinkFactor * 0.33) + 'px';
    }
  }};
  height: ${props => {
    if (props.isHelium) {
      const size = props.hydrogenSize + (props.heliumSize - props.hydrogenSize) * props.expandFactor;
      return size + 'px';
    } else {
      return 320 * (1 - props.shrinkFactor * 0.33) + 'px';
    }
  }};
  background: rgba(255, 140, 0, 0.8);
  border-radius: 50%;
  position: relative;
  transition: ${props => props.isHelium
    ? 'width 2s cubic-bezier(0.4,0,0.2,1), height 2s cubic-bezier(0.4,0,0.2,1)'
    : 'all 0.5s cubic-bezier(0.4,0,0.2,1)'};
  overflow: visible;
  z-index: 2;
  animation: ${props => props.showEnergyPulse ? energyPulse : 'none'} 2s infinite ease-in-out;
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

// Generate static background stars outside component
const backgroundStars = [...Array(50)].map((_, i) => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 2
}));

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
  const [coreExpandFactor, setCoreExpandFactor] = useState(0);
  const [selectedHeliumAtoms, setSelectedHeliumAtoms] = useState([]);
  const [showEnergyPulse, setShowEnergyPulse] = useState(false);

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
    setCoreExpandFactor(0);
    setSelectedHeliumAtoms([]);
    setShowEnergyPulse(false);
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
      setCoreExpandFactor(0);
      setTimeout(() => {
        setCoreExpandFactor(1);
      }, 100); // slight delay for smooth transition
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'helium') {
      const sequence = async () => {
        setShowCore(true);
        // Wait for core to expand
        await new Promise(resolve => setTimeout(resolve, 2100));
        
        // Start energy pulse after core expands
        setShowEnergyPulse(true);
        
        const heliumParticles = [];
        const coreRadius = HELIUM_CORE_SIZE / 2;
        
        // Helper function to check if a position is too close to existing particles
        const isTooClose = (x, y, particles) => {
          return particles.some(p => {
            const dx = p.x - x;
            const dy = p.y - y;
            return Math.sqrt(dx * dx + dy * dy) < 35; // Minimum distance between particles
          });
        };

        // Helper function to generate random position within core
        const getRandomPosition = (minRadius, maxRadius, maxAttempts = 50) => {
          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = minRadius + Math.random() * (maxRadius - minRadius);
            const x = coreRadius + Math.cos(angle) * radius;
            const y = coreRadius + Math.sin(angle) * radius;
            
            if (!isTooClose(x, y, heliumParticles)) {
              return { x, y };
            }
          }
          // If no valid position found after max attempts, try with a different radius
          return getRandomPosition(minRadius * 0.9, maxRadius * 1.1, maxAttempts);
        };

        // Create 3 pairs of helium atoms that will fuse
        const fusionPairs = [];
        for (let i = 0; i < 3; i++) {
          // Generate a random base position for the pair
          const basePos = getRandomPosition(coreRadius * 0.3, coreRadius * 0.7);
          const angle = Math.random() * Math.PI * 2;
          const separation = 40; // Fixed separation between pair

          // Calculate positions for the pair
          const pos1 = {
            x: basePos.x + Math.cos(angle) * separation/2,
            y: basePos.y + Math.sin(angle) * separation/2
          };
          
          const pos2 = {
            x: basePos.x - Math.cos(angle) * separation/2,
            y: basePos.y - Math.sin(angle) * separation/2
          };

          // Only add the pair if both positions are valid
          if (!isTooClose(pos1.x, pos1.y, heliumParticles) && 
              !isTooClose(pos2.x, pos2.y, heliumParticles)) {
            fusionPairs.push({
              atom1: pos1,
              atom2: pos2,
              fusionPoint: basePos
            });

            // Add the atoms to heliumParticles
            heliumParticles.push({
              id: Date.now() + i * 2,
              type: 'helium',
              x: pos1.x,
              y: pos1.y,
              isFusing: false,
              pairIndex: i,
              moveToX: basePos.x - pos1.x,
              moveToY: basePos.y - pos1.y
            });

            heliumParticles.push({
              id: Date.now() + i * 2 + 1,
              type: 'helium',
              x: pos2.x,
              y: pos2.y,
              isFusing: false,
              pairIndex: i,
              moveToX: basePos.x - pos2.x,
              moveToY: basePos.y - pos2.y
            });
          }
        }

        // Add random non-fusing helium atoms
        for (let i = 0; i < 8; i++) {
          const pos = getRandomPosition(coreRadius * 0.2, coreRadius * 0.8);
          if (pos) {
            heliumParticles.push({
              id: Date.now() + 100 + i,
              type: 'helium',
              x: pos.x,
              y: pos.y,
              isFusing: false,
              pairIndex: -1 // Won't fuse
            });
          }
        }

        setFusionParticles(heliumParticles);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Fuse each pair one at a time with random delays
        for (let i = 0; i < fusionPairs.length; i++) {
          const pair = fusionPairs[i];
          
          // Random delay between fusions (1.5 to 3 seconds)
          await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

          // Mark the pair as fusing
          setFusionParticles(current =>
            current.map(p =>
              p.pairIndex === i ? { ...p, isFusing: true } : p
            )
          );

          // Wait for atoms to move together
          await new Promise(resolve => setTimeout(resolve, 800));

          // Add fusion flash at the exact fusion point
          setFusionFlashes([{
            id: Date.now(),
            x: pair.fusionPoint.x - coreRadius,
            y: pair.fusionPoint.y - coreRadius
          }]);

          await new Promise(resolve => setTimeout(resolve, 200));

          // Remove fused pair and add red dot at the exact fusion point
          setFusionParticles(current => [
            ...current.filter(p => p.pairIndex !== i),
            {
              id: Date.now(),
              type: 'heavier',
              x: pair.fusionPoint.x,
              y: pair.fusionPoint.y,
              isAppearing: true
            }
          ]);

          setFusionFlashes([]);
          await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for red dot animation
        }

        // Show supernova button after all fusions complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        setShowCarbonCore(true);
        setTimeout(() => {
          setShowSupernova(true);
          setShowEnergyPulse(false);
        }, 1000);
      };

      sequence();
    }
  }, [phase]);

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

      const atom1 = hydrogenAtoms.find(a => a.id === selectedAtoms[0]);
      const atom2 = hydrogenAtoms.find(a => a.id === id);
      
      if (canFuse(atom1, atom2)) {
        setHydrogenAtoms(current => current.map(a =>
          a.id === selectedAtoms[0] || a.id === id ? { ...a, fusing: true } : a
        ));

        setTimeout(() => {
          setHydrogenAtoms(current => current.map(a =>
            a.id === selectedAtoms[0] || a.id === id ? { ...a, isActive: false, fusing: false } : a
          ));

          const originalRadius = 155;
          const currentRadius = 320 * (1 - fusionCount * 0.33) / 2;
          const center = currentRadius;
          const scale = currentRadius / originalRadius;
          
          const x1 = center + atom1.dx * scale;
          const y1 = center + atom1.dy * scale;
          const x2 = center + atom2.dx * scale;
          const y2 = center + atom2.dy * scale;

          const x = (x1 + x2) / 2;
          const y = (y1 + y2) / 2;

          const dirX = x - center;
          const dirY = y - center;
          const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
          const normX = dirX / dirLen;
          const normY = dirY / dirLen;
          const distance = 180;
          const moveX = normX * distance;
          const moveY = normY * distance;

          setFusingHelium({
            id: Date.now(),
            x,
            y,
            moveX,
            moveY
          });

          setTimeout(() => {
            setFusingHelium(null);
            setFusionCount(current => {
              const newCount = current + 1;
              if (newCount === 3) {
                setTimeout(() => {
                  setPhase('helium');
                }, 2000);
              }
              return newCount;
            });
          }, 1500);
        }, 150);
        setSelectedAtoms([]);
      } else {
        setSelectedAtoms([id]);
      }
    }
  };

  // Helper function to check if two helium atoms are close enough to fuse
  const canHeliumFuse = (atom1, atom2) => {
    const dx = atom1.x - atom2.x;
    const dy = atom1.y - atom2.y;
    return Math.sqrt(dx * dx + dy * dy) < 70; // Fusion distance threshold
  };

  // Handler for helium atom clicks
  const handleHeliumClick = (clickedAtom) => {
    if (phase !== 'helium') return;
    
    if (selectedHeliumAtoms.length === 0) {
      setSelectedHeliumAtoms([clickedAtom]);
    } else if (selectedHeliumAtoms.length === 1) {
      if (selectedHeliumAtoms[0].id === clickedAtom.id) {
        setSelectedHeliumAtoms([]);
        return;
      }

      if (canHeliumFuse(selectedHeliumAtoms[0], clickedAtom)) {
        // Calculate fusion point (midpoint between atoms)
        const fusionX = (selectedHeliumAtoms[0].x + clickedAtom.x) / 2;
        const fusionY = (selectedHeliumAtoms[0].y + clickedAtom.y) / 2;

        // Calculate outward direction from core center
        const dirX = fusionX - (HELIUM_CORE_SIZE / 2);
        const dirY = fusionY - (HELIUM_CORE_SIZE / 2);
        const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        const normX = dirX / dirLen;
        const normY = dirY / dirLen;
        const outwardDistance = 400;

        // Remove the fusing atoms and add red dot
        setFusionParticles(particles => {
          const remainingParticles = particles.filter(p => 
            p.id !== selectedHeliumAtoms[0].id && p.id !== clickedAtom.id
          );
          
          return [...remainingParticles, {
            id: Date.now(),
            type: 'heavier',
            x: fusionX,
            y: fusionY,
            moveX: normX * outwardDistance,
            moveY: normY * outwardDistance,
            isFlying: true
          }];
        });

        // Add fusion flash
        setFusionFlashes([{
          id: Date.now(),
          x: fusionX - (HELIUM_CORE_SIZE / 2),
          y: fusionY - (HELIUM_CORE_SIZE / 2)
        }]);

        // Clear selection
        setSelectedHeliumAtoms([]);

        // Clear flash after animation
        setTimeout(() => {
          setFusionFlashes([]);
        }, 1000);
      } else {
        setSelectedHeliumAtoms([clickedAtom]);
      }
    }
  };

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
          isHeliumPhase={phase === 'helium'}
        >
          <CoreRegion 
            shrinkFactor={fusionCount}
            isHelium={phase === 'helium'}
            show={showCore}
            expandFactor={phase === 'helium' ? coreExpandFactor : 0}
            hydrogenSize={HYDROGEN_CORE_SIZE}
            heliumSize={HELIUM_CORE_SIZE}
            showEnergyPulse={showEnergyPulse}
          >
            {/* Hydrogen Phase Atoms */}
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
            {/* Render the fusing helium atom inside CoreRegion (hydrogen phase only) */}
            {phase === 'hydrogen' && fusingHelium && (
              <HeliumAtom
                key={fusingHelium.id}
                size={28}
                color={'#4361ee'}
                phase="hydrogen"
                style={{
                  left: `${fusingHelium.x}px`,
                  top: `${fusingHelium.y}px`,
                  opacity: 1,
                  transform: 'translate(0, 0)',
                  '--moveX': `${fusingHelium.moveX}px`,
                  '--moveY': `${fusingHelium.moveY}px`
                }}
                fusing={true}
              />
            )}
            {phase === 'helium' && <HeliumCore show={true} />}
            {phase === 'helium' && <CarbonCore show={showCarbonCore} />}
            {/* Helium Phase Particles */}
            {phase === 'helium' && fusionParticles.map(particle => (
              particle.type === 'helium' ? (
                <HeliumAtom
                  key={particle.id}
                  x={particle.x}
                  y={particle.y}
                  size={25}
                  color={'#4361ee'}
                  phase="helium"
                  isFusing={particle.isFusing}
                  moveToX={particle.moveToX}
                  moveToY={particle.moveToY}
                />
              ) : (
                <FusionParticle
                  key={particle.id}
                  type={particle.type}
                  x={particle.x}
                  y={particle.y}
                  moveX={particle.moveX}
                  moveY={particle.moveY}
                  isFlying={particle.isFlying}
                  isAppearing={particle.isAppearing}
                />
              )
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
        {phase === 'hydrogen' && showCore && !showSupernova && (
          <Text position="bottom" delay={0}>
            The massive gravity in the center of stars pulls hydrogen atoms together.
            Try it yourself - click two adjacent hydrogen atoms to fuse them!
          </Text>
        )}

        {phase === 'helium' && !showSupernova && (
          <Text position="bottom" delay={0}>
            When the hydrogen fuel in the core runs out, the core expands and begins 
            fusing helium into heavier elements. The core begins to heat rapidly and expand.
          </Text>
        )}

        {/* Supernova button overlays bottom center, replaces text */}
        {showSupernova && (
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 40,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 200
          }}>
            <SupernovaButton onClick={() => setPhase('supernova')}>
              Supernova
            </SupernovaButton>
          </div>
        )}
      </Container>
    </div>
  );
};

export default StellarFusion;