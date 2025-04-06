import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_SOLVABLE_NUMBERS } from '../puzzleData';
// Assuming puzzleData.js is in src/data/ or adjust path
// import { ALL_SOLVABLE_NUMBERS } from '../puzzleData'; // Assuming you have this file
// --- MOCK DATA if puzzleData is not available ---

// --- End Mock Data ---

// --- Scoring Rules Configuration ---
const SCORING_RULES = {
    '120': { attempts: { 1: 6, 2: 4, 3: 3, 4: 1 }, penalty: -1, defaultPoints: 0 },
    '85':  { attempts: { 1: 7, 2: 4, 3: 2 }, penalty: -2, defaultPoints: 0 },
    '45':  { attempts: { 1: 9, 2: 5, 3: 3 }, penalty: -5, defaultPoints: 0 },
    'default': { attempts: { 1: 5, 2: 3, 3: 1 }, penalty: -1, defaultPoints: 0 }
};

// --- Helper functions ---
const calculateScore = (timeLimitKey, attemptCount) => {
    const rules = SCORING_RULES[timeLimitKey] || SCORING_RULES['default'];
    return rules.attempts[attemptCount] ?? rules.defaultPoints;
};
const getPenalty = (timeLimitKey) => {
    const rules = SCORING_RULES[timeLimitKey] || SCORING_RULES['default'];
    return rules.penalty;
};
const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
};

// --- Puzzle Distribution ---
const totalPuzzles = ALL_SOLVABLE_NUMBERS.length;
const puzzlesPerLevelApprox = Math.max(1, Math.floor(totalPuzzles / 3));
const puzzlesLevel1 = Math.min(totalPuzzles, puzzlesPerLevelApprox + (totalPuzzles % 3 > 0 ? 1 : 0));
const puzzlesLevel2 = Math.min(totalPuzzles - puzzlesLevel1, puzzlesPerLevelApprox + (totalPuzzles % 3 > 1 ? 1 : 0));
const slicePoint1 = puzzlesLevel1;
const slicePoint2 = puzzlesLevel1 + puzzlesLevel2;
const LEVEL_PUZZLES = {
    '120': ALL_SOLVABLE_NUMBERS.slice(0, slicePoint1),
    '85':  ALL_SOLVABLE_NUMBERS.slice(slicePoint1, slicePoint2),
    '45':  ALL_SOLVABLE_NUMBERS.slice(slicePoint2),
};
const DEFAULT_PUZZLES = ["123456"]; // Fallback if something goes wrong
const DEFAULT_TIME_LIMIT = 120;

// =============================
// Gameplay Component
// =============================
const Gameplay = () => {
    const { timeLimit: timeLimitParam } = useParams();
    const navigate = useNavigate();

    const initialTime = parseInt(timeLimitParam, 10) || DEFAULT_TIME_LIMIT;
    const currentTimeLimitKey = String(initialTime);
    // Ensure currentPuzzleList is always an array
    const currentPuzzleList = LEVEL_PUZZLES[currentTimeLimitKey] && LEVEL_PUZZLES[currentTimeLimitKey].length > 0
                              ? LEVEL_PUZZLES[currentTimeLimitKey]
                              : DEFAULT_PUZZLES;

    // --- State ---
    const [number, setNumber] = useState('');
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [lastPuzzleScore, setLastPuzzleScore] = useState(0);
    const [totalTrophies, setTotalTrophies] = useState(0); // Keep tracking trophies even without sidebar display here
    const inputRef = useRef(null);
    const [gameActive, setGameActive] = useState(true);
    const [remainingSeconds, setRemainingSeconds] = useState(initialTime);
    const intervalRef = useRef(null);

    // --- Effect to Load Total Trophies (still needed for logic) ---
    useEffect(() => {
        const savedTrophies = localStorage.getItem('totalTrophies');
        if (savedTrophies !== null) {
            setTotalTrophies(parseInt(savedTrophies, 10));
        }
    }, []); // Load only once on mount

    // --- Timer Effect ---
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current); // Clear existing interval first
        const shouldBeActive = remainingSeconds > 0 && !isCorrect;
        setGameActive(shouldBeActive);

        if (shouldBeActive) {
            intervalRef.current = setInterval(() => {
                setRemainingSeconds(prevSeconds => {
                    if (prevSeconds <= 1) {
                        clearInterval(intervalRef.current); intervalRef.current = null;
                        setMessage("⏰ Time's Up! No points awarded.");
                        setIsCorrect(false); setGameActive(false);
                        setLastPuzzleScore(0);
                        return 0;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        }

        // Cleanup function to clear interval when component unmounts or dependencies change
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [remainingSeconds, isCorrect]); // Rerun when remainingSeconds or isCorrect changes


    // --- Function to generate a number ---
    const generateNewNumber = () => {
        if (!currentPuzzleList || currentPuzzleList.length === 0) {
            console.error("Error: No puzzles available for time limit:", currentTimeLimitKey);
            setNumber("ERROR"); setExpression("ERROR");
            setMessage("Error loading puzzle."); setGameActive(false); return;
        }
        const randomIndex = Math.floor(Math.random() * currentPuzzleList.length);
        const newSolvableNumber = currentPuzzleList[randomIndex];
        setNumber(newSolvableNumber); setExpression(newSolvableNumber); // Start with the raw number
        setResult(null); setMessage(''); setIsCorrect(false);
        setAttempts(0); setShowHint(false);
        setLastPuzzleScore(0); // Reset score for *this* puzzle

        setRemainingSeconds(initialTime); // Reset timer
        setGameActive(true); // Ensure game is active

        // Focus input only if it exists
        if (inputRef.current) inputRef.current.focus();
    };

    // --- Initial Setup Effect ---
    useEffect(() => {
        // Set initial timer value based on param
        setRemainingSeconds(initialTime);
        // Generate the first number and reset related states
        generateNewNumber();

        // Add confetti script if not already present
        if (typeof window !== 'undefined' && !document.getElementById('confetti-script')) {
           const script = document.createElement('script');
           script.id = 'confetti-script';
           script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
           script.async = true;
           document.body.appendChild(script);
        }

        // Cleanup confetti script on unmount (optional, but good practice)
        return () => {
            const script = document.getElementById('confetti-script');
            // Check if script exists and if body exists before trying to remove
            if (script && document.body) {
              //  document.body.removeChild(script); // Consider if you want to remove it or keep it globally
            }
        };
    }, [initialTime]); // Re-run setup ONLY if initialTime (level/param) changes

    // --- Function to insert operator at cursor position ---
    const insertOperator = (operator) => {
        if (!gameActive || !inputRef.current) return;
        const input = inputRef.current;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const currentValue = expression;
        const newValue = currentValue.substring(0, start) + operator + currentValue.substring(end);
        setExpression(newValue);
        // Set cursor position after the inserted operator
        // Use setTimeout to ensure state update has rendered before setting selection
        setTimeout(() => {
            input.focus();
            input.setSelectionRange(start + operator.length, start + operator.length);
        }, 0);
    };

    // --- Function to clear operators, keeping original digits ---
    const clearOperators = () => {
        if (!gameActive) return;
        setExpression(number); // Reset expression back to the original number
        if (inputRef.current) inputRef.current.focus();
    };

    // --- Function to check if expression uses original digits in order ---
    const checkDigitOrderAndContent = (expr) => {
        // Remove everything that is not a digit
        const expressionDigits = expr.replace(/[^0-9]/g, '');
        // Check if the remaining digits match the original number string
        return expressionDigits === number;
    };

    // --- Function to check the expression (WITH TOTAL TROPHY UPDATE) ---
    const checkExpression = () => {
        if (!gameActive) return; // Don't check if game isn't active
        const currentAttempt = attempts + 1;
        setAttempts(currentAttempt);

        // Helper to update total score state & localStorage
        const applyScoreUpdate = (change) => {
            setTotalTrophies(prevTotal => {
                const newTotal = Math.max(0, prevTotal + change); // Prevent negative total
                localStorage.setItem('totalTrophies', newTotal.toString()); // Still save for other parts of app
                return newTotal;
            });
        };

        // 1. Check Digit Integrity First
        if (!checkDigitOrderAndContent(expression)) {
            const penalty = getPenalty(currentTimeLimitKey);
            setMessage(`Error: Digits must be used in order. (${penalty} 🏆)`);
            setIsCorrect(false); setResult(null);
            applyScoreUpdate(penalty); // Apply penalty
            return; // Stop further checks
        }

        // 2. Check if it's just the original number (no operators added)
        if (expression === number) {
            setMessage('Please insert operators to make 100.');
            setIsCorrect(false); setResult(null);
            // Optionally apply a smaller penalty or no penalty for this case
            // applyScoreUpdate(getPenalty(currentTimeLimitKey)); // Or maybe not penalize this
            return; // Stop further checks
        }

        // 3. Try to Evaluate the Expression
        try {
            // Sanitize: Allow digits, operators, parentheses. Replace ^ with ** for JS eval.
            const sanitizedExpression = expression
                .replace(/[^0-9.+\-*/()^]/g, '')
                .replace(/\^/g, '**');

            // Basic Syntax Checks (prevent common eval errors)
            if (!sanitizedExpression ||                       // Empty after sanitize
                /([+\-*/]){2,}/.test(sanitizedExpression) || // Double operators
                /^[*/^]/.test(sanitizedExpression) ||        // Starts with invalid operator
                /[+\-*/^]$/.test(sanitizedExpression) ||     // Ends with operator
                /\(\)/.test(sanitizedExpression) ||          // Empty parens
                /\d\(/.test(sanitizedExpression) ||          // Number directly before (
                /\)\d/.test(sanitizedExpression) ||          // ) directly before number
                /\)\(/.test(sanitizedExpression))           // ) directly before (
                 {
                throw new Error("Invalid mathematical syntax");
            }

            // Use Function constructor for safer evaluation than direct eval()
            // eslint-disable-next-line no-new-func
            const calculatedResult = Function(`'use strict'; return (${sanitizedExpression})`)();

            // Check if result is a valid finite number
            if (typeof calculatedResult !== 'number' || !isFinite(calculatedResult)) {
                throw new Error("Invalid calculation result (e.g., division by zero)");
            }

            setResult(calculatedResult); // Store the calculated result

            // Check if the result is 100 (using tolerance for floating point)
            const tolerance = 0.000001;
            if (Math.abs(calculatedResult - 100) < tolerance) {
                // --- SUCCESS ---
                if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } // Stop timer
                const score = calculateScore(currentTimeLimitKey, currentAttempt);
                setLastPuzzleScore(score); // Store score for this specific puzzle
                applyScoreUpdate(score);   // Update TOTAL score
                setMessage(`🎉 Correct! You earned +${score} 🏆`);
                setIsCorrect(true); setGameActive(false); // Mark as correct, stop game
                // Trigger confetti
                if (typeof window !== 'undefined' && window.confetti) {
                    window.confetti({
                        particleCount: 150,
                        spread: 90,
                        origin: { y: 0.6 },
                        colors: ['#fccf03', '#f04d5a', '#3b5ba7', '#78c850', '#00ff00', '#0077cc']
                    });
                }
            } else {
                // --- INCORRECT RESULT ---
                const penalty = getPenalty(currentTimeLimitKey);
                setMessage(`Result: ${calculatedResult.toFixed(2)}. Not 100. (${penalty} 🏆)`);
                setIsCorrect(false); // Mark as incorrect
                applyScoreUpdate(penalty); // Apply penalty
            }
        } catch (error) {
            // --- EVALUATION ERROR / INVALID SYNTAX ---
            console.error("Evaluation Error:", error);
            const penalty = getPenalty(currentTimeLimitKey);
            setMessage(`Error: Invalid expression. ${error.message}. (${penalty} 🏆)`);
            setIsCorrect(false); setResult(null); // Mark as incorrect, clear result
            applyScoreUpdate(penalty); // Apply penalty
        }
    };

    // --- Event Handlers ---
    const handleExpressionChange = (e) => {
        if (gameActive) { // Only allow changes if the game is active
            setExpression(e.target.value);
        }
    };

    const handleKeyPress = (e) => {
        // Trigger checkExpression only if Enter key is pressed and game is active
        if (e.key === 'Enter' && gameActive) {
            checkExpression();
        }
    };

    const toggleGeneralHint = () => {
        // Allow toggling hint even if game is inactive (e.g., after time's up)
        setShowHint(prevShowHint => !prevShowHint);
    };

    // --- MODIFIED: Navigates to Homepage ('/') ---
    const handleQuit = () => {
        if (intervalRef.current) clearInterval(intervalRef.current); // Stop timer if running
        navigate('/homepage'); // <-- Navigates to the root path (Homepage)
    };

    // --- Helper to Render Digits (for visual display) ---
    const renderDigits = () => {
        if (!number) return null; // Don't render if number isn't set yet
        return number.split('').map((digit, index) => (
            <span key={index}
                  className="text-[2.5rem] sm:text-[2rem] font-bold text-center w-[40px] h-[60px] sm:w-[35px] sm:h-[50px] flex items-center justify-center bg-[#4d4d4d] rounded-[5px] shadow-[2px_2px_0px_#1a1a1a] mx-1 text-[#fccf03]"
                  style={{ textShadow: '1px 1px 1px #000' }}>
                {digit}
            </span>
        ));
    };


    // --- JSX ---
    return (
        // MODIFIED: Outer container centers content, uses flex-col only
        <div className="font-['Poppins'] bg-[#1a1a1a] text-[#f8f9fa] leading-[1.6] min-h-screen flex flex-col justify-start items-center p-4 sm:p-2 relative overflow-x-hidden"
             style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>

            {/* Scanline Overlay */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.02),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-[1000] pointer-events-none opacity-60"></div>

            {/* MODIFIED: Main Content Area - No right padding for sidebar */}
            <div className="w-full max-w-[850px] z-[1] pt-10 sm:pt-12 px-2"> {/* Removed md:pr-4 */}

                {/* Timer Display */}
                <div className={`text-center py-[8px] px-2 text-[1.6em] sm:text-[1.4em] font-mono font-bold border-b-2 mb-4 rounded-t-lg transition-colors duration-300 shadow-md
                       ${remainingSeconds <= 10 && gameActive ? 'bg-red-200 text-red-800 border-red-400 animate-pulse' : 'bg-gray-100 text-gray-800 border-gray-300'}
                       ${!gameActive && !isCorrect && remainingSeconds <= 0 ? 'bg-gray-400 text-gray-600 border-gray-500' : ''} {/* Specific for Timeout */}
                       ${isCorrect ? 'bg-green-200 text-green-800 border-green-400' : ''}
                       ${!gameActive && !isCorrect && remainingSeconds > 0 ? 'bg-gray-100 text-gray-800 border-gray-300' : ''} /* Keep normal if inactive but time > 0 */
                       `}>
                   ⏳ {formatTime(remainingSeconds)}
                </div>

                {/* Header */}
                <div className="text-center mb-5 sm:mb-3">
                    <h1 className="text-[2.8rem] md:text-[2.4rem] xs:text-[1.8rem] font-extrabold mb-1 tracking-[0.5px] leading-[1.1] bg-clip-text text-transparent"
                        style={{ background: 'linear-gradient(180deg, #adb5bd 20%, #6c757d 60%, #adb5bd 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '-2px -2px 0 #3b5ba7, 2px -2px 0 #3b5ba7, -2px 2px 0 #3b5ba7, 2px 2px 0 #3b5ba7, 4px 4px 0 #1a1a1a' }}>
                        Make it 100!
                    </h1>
                    <p className="text-[0.9rem] text-[#adb5bd] font-medium uppercase tracking-[1px]">
                        Level Challenge ({initialTime}s) | Attempt: {attempts}
                    </p>
                </div>

                {/* Game Board */}
                <div className="flex flex-col gap-5 mb-6">
                    {/* Section 1: The Challenge */}
                    <div className="bg-[#2a2a2e]/80 backdrop-blur-sm rounded-lg px-5 py-4 sm:px-4 sm:py-3 relative border-[3px] border-solid border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)]"
                        style={{ borderImage: 'linear-gradient(45deg, #0077cc, #adb5bd) 1' }}>
                       <h2 className="text-[1.4rem] sm:text-[1.2rem] mb-3 pb-[0.3rem] font-bold border-b-[2px] border-dashed inline-block pr-3 text-[#f04d5a] border-b-[#fccf03]" style={{ textShadow: '1px 1px 0 #1a1a1a' }}>
                           Your Challenge: <span className='text-[#fccf03]'>{number}</span>
                       </h2>
                       <div className="mb-3 text-sm leading-relaxed text-[#f8f9fa]">
                           <p className='mb-1'>Insert operators (<code className="font-bold text-[#fccf03]">+ − × ÷ ^</code>) and parentheses (<code className="font-bold text-[#fccf03]">( )</code>) to make 100.</p>
                           <p className='mb-1'>Use all digits in their original order.</p>
                       </div>
                       <div className="my-4 p-3 bg-black/30 rounded-lg border border-dashed border-[#4d4d4d]">
                           <div className="flex justify-center items-center gap-2 flex-wrap">
                               {renderDigits()}
                           </div>
                       </div>
                       {/* Hint Area Toggler */}
                       <div className="mt-3">
                           {showHint && (
                               <div className="bg-[#fccf03]/10 border border-[#fccf03] px-4 py-3 rounded-[5px] text-[#e0e0e0] shadow-[0_2px_5px_rgba(252,207,3,0.2)] text-xs sm:text-[0.7rem]">
                                   <h3 className="mb-1 font-bold text-[#fccf03]" style={{ textShadow: '1px 1px 0 #1a1a1a' }}>Hint</h3>
                                   <p className='mb-1'>Remember PEMDAS/BODMAS order: Parentheses/Brackets first!</p>
                                   <p className='mb-1'>Try grouping operations like <code className="font-['Roboto_Mono'] monospace bg-black/30 px-[0.3em] py-[0.1em] rounded-[3px]">(a + b) * c</code> or <code className="font-['Roboto_Mono'] monospace bg-black/30 px-[0.3em] py-[0.1em] rounded-[3px]">a / (b - c)</code>.</p>
                               </div>
                           )}
                       </div>
                    </div>

                    {/* Section 2: The Workspace */}
                     <div className={`bg-[#2a2a2e]/80 backdrop-blur-sm rounded-lg px-5 py-4 sm:px-4 sm:py-3 relative border-[3px] border-solid border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] transition-opacity duration-300 ${!gameActive ? 'opacity-75' : ''}`}
                          style={{ borderImage: 'linear-gradient(45deg, #0077cc, #adb5bd) 1' }}>
                        <h2 className="text-[1.4rem] sm:text-[1.2rem] mb-3 pb-[0.3rem] font-bold border-b-[2px] border-dashed inline-block pr-3 text-[#00ff00] border-b-[#4d4d4d]" style={{ textShadow: '1px 1px 0 #1a1a1a' }}>
                            PokeDesk <span className='text-[#00ff00]'>(Workspace)</span>
                        </h2>
                        <div className="bg-[#1a1a1a] p-3 rounded-lg mb-4 border border-[#4d4d4d]">
                            <label htmlFor="expression-input" className="block mb-1.5 font-semibold text-[#00ff00] text-xs uppercase tracking-[0.5px]">Your Expression:</label>
                            <input
                                type="text"
                                id="expression-input"
                                ref={inputRef}
                                value={expression}
                                onChange={handleExpressionChange}
                                onKeyPress={handleKeyPress}
                                placeholder={!gameActive ? (isCorrect ? "Solved!" : (remainingSeconds <= 0 ? "Time's Up!" : "Inactive")) : "Enter expression here..."}
                                className={`w-full py-[0.5rem] px-3 text-[1.1rem] sm:text-[1rem] border-2 rounded-[5px] font-['Roboto_Mono'] monospace bg-[#4d4d4d] text-[#f8f9fa] transition-colors transition-shadow duration-200 ease-in-out shadow-[inset_2px_2px_2px_rgba(0,0,0,0.3)] placeholder:text-[#adb5bd]/70 placeholder:text-sm placeholder:italic focus:outline-none
                                            ${!gameActive ? 'border-gray-600 cursor-not-allowed' : 'border-[#4d4d4d] focus:border-[#00ff00] focus:shadow-[0_0_12px_2px_rgba(0,255,0,0.4)]'}
                                            ${isCorrect ? '!border-green-500 !bg-green-900/30' : ''}
                                            ${!isCorrect && !gameActive && remainingSeconds <= 0 ? '!border-red-600 !bg-red-900/30' : ''}`}
                                aria-label="Mathematical expression input"
                                disabled={!gameActive}
                            />
                          {/* Operator Buttons */}
                          <div className="mt-3">
                              <p className="font-semibold text-[#cccccc] mb-1.5 text-[0.7rem] uppercase">Insert Operator:</p>
                              <div className="grid grid-cols-4 gap-1.5">
                                  {['+', '−', '×', '÷', '^', '(', ')'].map(op => (
                                      <button
                                          key={op}
                                          aria-label={`Insert ${op}`}
                                          className={`h-[36px] text-[1.2rem] border border-[#1a1a1a] rounded-md transition-all duration-150 ease-in-out font-bold flex items-center justify-center shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_2px_2px_0px_#1a1a1a] relative top-0 left-0 bg-[#4d4d4d] text-[#cccccc]
                                                      ${!gameActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#00cc00] hover:text-[#1a1a1a] hover:shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),_2px_2px_0px_#1a1a1a,_0_0_10px_2px_rgba(0,255,0,0.4)] active:shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] active:top-[1px] active:left-[1px] active:bg-[#00ff00] active:text-[#1a1a1a]'}`}
                                          onClick={() => insertOperator(op === '×' ? '*' : op === '÷' ? '/' : op === '−' ? '-' : op )}
                                          disabled={!gameActive}>
                                          {op}
                                      </button>
                                  ))}
                                  {/* Clear/Reset Button */}
                                  <button
                                      aria-label="Reset expression to original number"
                                      className={`h-[36px] text-xs border border-[#1a1a1a] rounded-md transition-all duration-150 ease-in-out font-bold flex items-center justify-center shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_2px_2px_0px_#1a1a1a] relative top-0 left-0 bg-[#4d4d4d] text-[#f04d5a]
                                                  ${!gameActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#f04d5a]/80 hover:text-white active:shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] active:top-[1px] active:left-[1px]'}`}
                                      onClick={clearOperators} disabled={!gameActive}>
                                      Reset
                                  </button>
                              </div>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 mb-4">
                            <button
                                className={`px-4 py-[0.6rem] text-[0.9rem] font-bold border-none rounded-[5px] transition-all duration-200 ease-in-out text-center relative top-0 left-0 uppercase tracking-[1px] bg-gradient-to-b from-[#00ff00] to-[#00cc00] text-[#1a1a1a] border-2 border-[#00ff00]/50 shadow-[0_0_8px_rgba(0,255,0,0.4),_3px_3px_0_#1a1a1a]
                                            ${!gameActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gradient-to-b hover:from-[#33ff33] hover:to-[#00ff00] hover:shadow-[0_0_15px_rgba(0,255,0,0.7),_3px_3px_0_#1a1a1a] active:shadow-[inset_3px_3px_4px_rgba(0,0,0,0.4)] active:top-[2px] active:left-[2px]'}`}
                                onClick={checkExpression}
                                disabled={!gameActive}>
                                Check Solution
                            </button>
                            <button
                                className={`px-4 py-[0.6rem] text-[0.9rem] font-bold border-none rounded-[5px] transition-all duration-200 ease-in-out text-center relative top-0 left-0 uppercase tracking-[1px] bg-gradient-to-b from-[#0077cc] to-[#005a9e] text-white border-2 border-[#0077cc]/50 shadow-[0_0_8px_rgba(0,119,204,0.3),_3px_3px_0_#1a1a1a] cursor-pointer hover:bg-gradient-to-b hover:from-[#008ae6] hover:to-[#0077cc] hover:shadow-[0_0_15px_rgba(0,119,204,0.6),_3px_3px_0_#1a1a1a] active:shadow-[inset_3px_3px_4px_rgba(0,0,0,0.4)] active:top-[2px] active:left-[2px]`}
                                onClick={generateNewNumber}>
                                New Number
                            </button>
                        </div>
                        {/* Message Area */}
                        {message && (
                            <div className={`mt-3 p-2.5 px-3 rounded-lg flex items-center gap-2 border-[2px] border-solid bg-black/40 text-xs font-semibold
                                            ${isCorrect ? 'border-[#00ff00] text-[#00ff00] shadow-[inset_0_0_8px_rgba(0,255,0,0.2),_0_0_4px_rgba(0,255,0,0.2)]'
                                            : (!gameActive && remainingSeconds <= 0) ? 'border-gray-500 text-gray-400 shadow-[inset_0_0_8px_rgba(100,100,100,0.2),_0_0_4px_rgba(100,100,100,0.2)]'
                                            : 'border-[#f04d5a] text-[#f04d5a] shadow-[inset_0_0_8px_rgba(240,77,90,0.2),_0_0_4px_rgba(240,77,90,0.2)]'}`}
                                 role="alert">
                                <div className={`text-[1.3rem] shrink-0 ${isCorrect ? 'animate-bounce' : ''} ${!isCorrect && message.includes('Error:') ? 'animate-shake' : ''}`}>
                                    {isCorrect ? '🎉' : (!gameActive && remainingSeconds <= 0 ? '⏰' : '🤔')}
                                </div>
                                <div className="grow">{message}</div>
                            </div>
                        )}
                         {/* Success Score Display */}
                        {isCorrect && (
                            <div className="mt-3 p-3 rounded-lg border-[2px] border-[#ffc300] text-center shadow-[0_0_8px_rgba(255,195,0,0.3)]"
                                 style={{ background: 'radial-gradient(circle, rgba(255, 195, 0, 0.15) 0%, rgba(106, 13, 173, 0.05) 100%)' }}>
                                <h3 className="mb-0.5 text-[1rem] font-bold text-[#ffc300]" style={{ textShadow: '1px 1px 0 #6a0dad' }}>Challenge Cleared!</h3>
                                <p className="text-xs text-amber-200">Score this round: +{lastPuzzleScore} 🏆</p>
                            </div>
                        )}
                     </div>
                 </div>

                {/* Footer Actions */}
                <div className="mt-6 text-center pt-4 border-t border-dashed border-[#4d4d4d]/50 text-[#adb5bd]">
                    <p className="mb-2 font-medium text-xs">Need Help or Finished Playing?</p>
                    <div className="flex justify-center gap-3 flex-wrap">
                        <button
                            className={`px-5 py-[0.5rem] text-[0.9rem] font-bold border border-[#1a1a1a]/50 rounded-[5px] transition-all duration-200 ease-in-out text-white no-underline inline-block shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] relative top-0 left-0 uppercase bg-[#6c757d] hover:bg-[#5a6268] active:shadow-[inset_2px_2px_3px_rgba(0,0,0,0.4)] active:top-[1px] active:left-[1px]`}
                            onClick={toggleGeneralHint}>
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                        <button
                            className="px-5 py-[0.5rem] text-[0.9rem] font-bold border border-[#1a1a1a]/50 rounded-[5px] cursor-pointer transition-all duration-200 ease-in-out text-white no-underline inline-block shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] relative top-0 left-0 uppercase bg-[#f04d5a] hover:bg-[#d43a46] active:shadow-[inset_2px_2px_3px_rgba(0,0,0,0.4)] active:top-[1px] active:left-[1px]"
                            onClick={handleQuit}> {/* <-- USES UPDATED handleQuit to navigate to '/' */}
                            Quit Level
                        </button>
                    </div>
                </div>

            </div> {/* End of Main Content Area */}

             {/* --- SIDEBAR REMOVED --- */}

        </div> // End of Body Wrapper
    );
};

export default Gameplay;