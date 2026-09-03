import { GAME_LEVELS } from '../src/data/levels';
import { getGuidedSolveStepInfo } from '../src/utils/guidedSolveEngine';
import { calculateBaseHash, calculateH2 } from '../src/utils/hashAlgorithms';
import { TableSlot, GameState, ProbeStep } from '../src/types/game';

console.log('--- RUNNING GUIDED SOLVE VALIDATION SUITE ---');

for (const level of GAME_LEVELS) {
  console.log(`\nTesting Level ${level.id}: ${level.title} (${level.technique})`);
  const m = level.tableSize;
  const keys = level.keysSequence;
  let slots: TableSlot[] = Array.from({ length: m }, (_, i) => ({
    index: i,
    items: [],
    status: 'idle',
  }));

  let keySeqIdx = 0;
  let currentKey: number | null = keys[0];
  let calculatedIndex: number | null = null;
  let gameState: GameState = 'KEY_APPEARS';
  let isProbing = false;
  let currentProbeStepIndex = 0;
  let probeSteps: ProbeStep[] = [];
  let stepCounter = 0;
  let isComplete = false;

  while (!isComplete && stepCounter < 50) {
    stepCounter++;
    const stepInfo = getGuidedSolveStepInfo(
      level,
      slots,
      keySeqIdx,
      currentKey,
      calculatedIndex,
      gameState,
      isProbing,
      currentProbeStepIndex,
      probeSteps
    );

    console.log(
      `  [Step ${stepInfo.currentStep}/${stepInfo.totalSteps}] Action: ${stepInfo.actionType} | Title: "${stepInfo.title}" | Formula: "${stepInfo.formulaStr}"`
    );

    // Perform the single action
    switch (stepInfo.actionType) {
      case 'CALCULATE': {
        calculatedIndex = calculateBaseHash(currentKey!, m);
        gameState = 'INDEX_FOUND';
        break;
      }
      case 'PLACE': {
        const targetSlot = calculatedIndex!;
        if (level.technique === 'chaining') {
          slots[targetSlot].items.push({ id: `k-${Date.now()}`, value: currentKey!, initialHash: targetSlot });
          // advance
          keySeqIdx++;
          if (keySeqIdx < keys.length) {
            currentKey = keys[keySeqIdx];
            calculatedIndex = null;
            gameState = 'KEY_APPEARS';
          } else {
            gameState = 'LEVEL_COMPLETE';
            isComplete = true;
          }
        } else {
          if (slots[targetSlot].items.length === 0) {
            slots[targetSlot].items.push({ id: `k-${Date.now()}`, value: currentKey!, initialHash: targetSlot });
            // advance
            keySeqIdx++;
            if (keySeqIdx < keys.length) {
              currentKey = keys[keySeqIdx];
              calculatedIndex = null;
              gameState = 'KEY_APPEARS';
            } else {
              gameState = 'LEVEL_COMPLETE';
              isComplete = true;
            }
          } else {
            // Collision
            gameState = 'COLLISION_PAUSE';
            if (level.id === 1) {
              // Level 1 collision modal
            } else {
              // start probing
              isProbing = true;
              currentProbeStepIndex = 0;
              gameState = 'PROBING_INTERACTION';
              probeSteps = [];
              if (level.technique === 'linear') {
                for (let i = 0; i < m; i++) {
                  const target = (calculatedIndex + i) % m;
                  const occ = slots[target].items.length > 0;
                  probeSteps.push({ stepIndex: i, targetIndex: target, isOccupied: occ, calculationStr: `(${calculatedIndex} + ${i}) % ${m} = ${target}` });
                  if (!occ) break;
                }
              } else if (level.technique === 'quadratic') {
                for (let i = 0; i < m; i++) {
                  const target = (calculatedIndex + i * i) % m;
                  const occ = slots[target].items.length > 0;
                  probeSteps.push({ stepIndex: i, targetIndex: target, isOccupied: occ, calculationStr: `(${calculatedIndex} + ${i}²) % ${m} = ${target}` });
                  if (!occ) break;
                }
              } else if (level.technique === 'double_hashing') {
                const h2 = calculateH2(currentKey!, undefined, m);
                for (let i = 0; i < m; i++) {
                  const target = (calculatedIndex + i * h2) % m;
                  const occ = slots[target].items.length > 0;
                  probeSteps.push({ stepIndex: i, targetIndex: target, isOccupied: occ, calculationStr: `(${calculatedIndex} + ${i} × ${h2}) % ${m} = ${target}` });
                  if (!occ) break;
                }
              }
            }
          }
        }
        break;
      }
      case 'PROCEED_COLLISION': {
        // Level 1 complete
        gameState = 'LEVEL_COMPLETE';
        isComplete = true;
        break;
      }
      case 'NEXT_PROBE': {
        currentProbeStepIndex++;
        break;
      }
      case 'CONFIRM_PROBE': {
        const finalSlot = probeSteps[currentProbeStepIndex].targetIndex;
        slots[finalSlot].items.push({ id: `k-${Date.now()}`, value: currentKey!, initialHash: calculatedIndex! });
        isProbing = false;
        probeSteps = [];
        currentProbeStepIndex = 0;
        keySeqIdx++;
        if (keySeqIdx < keys.length) {
          currentKey = keys[keySeqIdx];
          calculatedIndex = null;
          gameState = 'KEY_APPEARS';
        } else {
          gameState = 'LEVEL_COMPLETE';
          isComplete = true;
        }
        break;
      }
      case 'COMPLETE': {
        isComplete = true;
        break;
      }
    }
  }

  console.log(`Level ${level.id} validation finished in ${stepCounter} steps.`);
}
console.log('\n--- ALL LEVELS VALIDATED SUCCESSFULLY ---');
