import React, { useState, useEffect, useRef } from 'react';
// Removed import './App.css';

// --- IMPORTANT ---
// (SOLVABLE_6_DIGIT_NUMBERS list remains the same)
const SOLVABLE_6_DIGIT_NUMBERS = [
  "481295", "345161", "112688", "729153", "655182", "247513", "199273", "841567",
  // Add MANY more verified solvable numbers here
];
// --- END OF IMPORTANT NOTE ---

if (SOLVABLE_6_DIGIT_NUMBERS.length === 0) {
  console.warn("SOLVABLE_6_DIGIT_NUMBERS list is empty! Using a default. Please populate the list.");
  SOLVABLE_6_DIGIT_NUMBERS.push("123456"); // Fallback
}

// --- Helper function to format seconds into HH:MM:SS ---
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

// Renamed component from App to Gameplay
const Gameplay = () => {
  const [number, setNumber] = useState('');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const generateNewNumber = () => {
    const randomIndex = Math.floor(Math.random() * SOLVABLE_6_DIGIT_NUMBERS.length);
    const newSolvableNumber = SOLVABLE_6_DIGIT_NUMBERS[randomIndex];
    setNumber(newSolvableNumber);
    setExpression(newSolvableNumber);
    setResult(null);
    setMessage('');
    setIsCorrect(false);
    setAttempts(0);
    setShowHint(false);
    setElapsedSeconds(0); // Reset timer state
     // --- Reset and restart timer interval ---
    if (intervalRef.current) {
        clearInterval(intervalRef.current); // Clear existing interval
    }
    intervalRef.current = setInterval(() => { // Start a new one
        setElapsedSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    generateNewNumber();
    if (!document.getElementById('confetti-script')) {
      const script = document.createElement('script');
      script.id = 'confetti-script';
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
    // Cleanup timer on unmount (already handled in the timer's useEffect)
  }, []);


  const insertOperator = (operator) => {
    if (inputRef.current) {
      const input = inputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const text = expression;
      const updatedExpression = text.substring(0, start) + operator + text.substring(end);
      setExpression(updatedExpression);
      setTimeout(() => {
        input.focus();
        const newCursorPos = start + operator.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const clearOperators = () => {
    setExpression(number);
    setMessage('');
    setIsCorrect(false);
    setResult(null);
    if (inputRef.current) {
        inputRef.current.focus();
        setTimeout(() => {
            const len = number.length;
            inputRef.current.setSelectionRange(len, len);
        }, 0);
    }
  }

  const checkDigitOrderAndContent = (expr) => {
    const expressionDigits = expr.replace(/[^0-9]/g, '');
    return expressionDigits === number;
  };

  const checkExpression = () => {
    setAttempts(prev => prev + 1);
    if (!checkDigitOrderAndContent(expression)) {
      setMessage('Error: You must use all the original digits in the correct order, and only add operators/parentheses.');
      setIsCorrect(false); setResult(null); return;
    }
    if (expression === number) {
      setMessage('Please insert operators between the digits to form an expression.');
      setIsCorrect(false); setResult(null); return;
    }
    try {
      const sanitizedExpression = expression.replace(/\^/g, '**').replace(/[^0-9.+\-*/()]/g, '');
      if (!sanitizedExpression || /([+\-*/]){2,}/.test(sanitizedExpression) || /^[*/^]/.test(sanitizedExpression) || /[+\-*/^]$/.test(sanitizedExpression) || /\(\)/.test(sanitizedExpression) || /\d\(/.test(sanitizedExpression) || /\)\d/.test(sanitizedExpression)) {
           throw new Error("Invalid mathematical syntax");
      }
      // eslint-disable-next-line no-new-func
      const calculatedResult = Function(`'use strict'; return (${sanitizedExpression})`)();
      if (typeof calculatedResult !== 'number' || !isFinite(calculatedResult)) {
          throw new Error("Calculation resulted in an invalid value (e.g., Infinity)");
      }
      setResult(calculatedResult);
      const tolerance = 0.000001;
      if (Math.abs(calculatedResult - 100) < tolerance) {
        if (intervalRef.current) { // Stop timer *before* setting message
           clearInterval(intervalRef.current);
           intervalRef.current = null;
        }
        setMessage(`GOTCHA! Your expression equals 100! Solved in ${formatTime(elapsedSeconds)}.`);
        setIsCorrect(true);
        if (window.confetti) { window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#fccf03', '#f04d5a', '#3b5ba7', '#78c850', '#00ff00', '#0077cc'] }); }
      } else {
        setMessage(`Result: ${calculatedResult.toFixed(2)}. Not quite 100. Try again!`);
        setIsCorrect(false);
      }
    } catch (error) {
      console.error("Evaluation Error:", error);
      setMessage(`Error: Invalid expression. Check for syntax errors like misplaced operators or parentheses.`);
      setIsCorrect(false); setResult(null);
    }
  };

  const handleExpressionChange = (e) => { setExpression(e.target.value); };
  const handleKeyPress = (e) => { if (e.key === 'Enter') { checkExpression(); } };

  const renderDigits = () => {
    if (!number) return <p className="text-center text-gray-400">Loading number...</p>;
    return number.split('').map((digit, index) => (
      <div key={index}
           className="w-[70px] h-[70px] sm:w-[60px] sm:h-[60px] xs:w-[48px] xs:h-[48px] rounded-full border-[3px] border-[#1a1a1a] text-[#1a1a1a] text-[2rem] sm:text-[1.8rem] xs:text-[1.5rem] font-bold flex items-center justify-center relative shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] transition-transform duration-200 ease-in-out font-['Roboto_Mono'] monospace hover:scale-105 hover:rotate-5"
           style={{ background: 'linear-gradient(to bottom, #f04d5a 0%, #f04d5a 48%, #1a1a1a 48%, #1a1a1a 52%, #ffffff 52%, #ffffff 100%)' }}>
         {digit}
         {/* Inner divs for Pokeball center */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22px] h-[22px] xs:w-[15px] xs:h-[15px] bg-white rounded-full border-[3px] border-[#1a1a1a] z-10"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] xs:w-[6px] xs:h-[6px] bg-white rounded-full border-[2px] border-[#1a1a1a] z-20"></div>
      </div>
    ));
  };

  const toggleGeneralHint = () => setShowHint(prevShowHint => !prevShowHint);
  const handleQuit = () => { window.history.length > 1 ? window.history.back() : alert("Thanks for playing! You can close the tab now."); };

  return (
    // Body Styles Applied Here
    <div className="font-['Poppins'] bg-[#1a1a1a] text-[#f8f9fa] leading-[1.6] min-h-screen flex justify-center items-start p-8 px-4 sm:p-4 sm:px-2 relative"
         style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>

      {/* Scanline Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.02),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-[1000] pointer-events-none opacity-60"></div>

      <div className="w-full max-w-[850px] z-[1]"> {/* Game Page Container */}

        {/* Static Timer Display */}
        <div className="text-center py-[10px] text-[1.6em] font-mono font-bold bg-gray-100 text-gray-800 border-b-2 border-gray-300 mb-5">
          {formatTime(elapsedSeconds)}
        </div>

        {/* Header */}
        <div className="text-center mb-12 sm:mb-8">
          <h1 className="text-[3.2rem] md:text-[2.5rem] xs:text-[2rem] font-extrabold mb-3 tracking-[1px] leading-[1.2] bg-clip-text text-transparent"
              style={{ background: 'linear-gradient(180deg, #adb5bd 20%, #6c757d 60%, #adb5bd 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '-2px -2px 0 #3b5ba7, 2px -2px 0 #3b5ba7, -2px 2px 0 #3b5ba7, 2px 2px 0 #3b5ba7, 4px 4px 0 #1a1a1a' }}>
                {/* xs:text-shadow adjustments needed via style or config */}
            Make it 100!
          </h1>
          <p className="text-[1.1rem] text-[#adb5bd] font-medium uppercase tracking-[1px]">Nostalgic Puzzle Challenge</p>
        </div>

        <div className="flex flex-col gap-10 mb-8"> {/* Game Board */}

          {/* Section 1: The Challenge */}
          <div className="bg-[#2a2a2e] rounded-lg px-8 py-6 sm:px-6 relative border-[3px] border-solid border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)]"
               style={{ borderImage: 'linear-gradient(45deg, #0077cc, #adb5bd) 1' }}>
            <h2 className="text-[1.8rem] mb-6 pb-[0.6rem] font-bold border-b-[3px] border-dashed inline-block pr-4 text-[#f04d5a] border-b-[#fccf03]"
                style={{ textShadow: '1px 1px 0 #1a1a1a' }}>
              Your Challenge: <span className='text-[#fccf03]'>{number}</span> {/* pkmn-yellow class equivalent */}
            </h2>
            <div className="mb-6 leading-[1.7] text-[#f8f9fa]">
              <p className='mb-2'>Insert operators (<span className="font-['Roboto_Mono'] monospace font-bold text-[#f04d5a] bg-[#f04d5a]/15 px-[0.4em] py-[0.1em] rounded-[4px] mx-[0.1em] inline-block border border-[#f04d5a]/50">+ − × ÷ ^</span>) and parentheses (<span className="font-['Roboto_Mono'] monospace font-bold text-[#f04d5a] bg-[#f04d5a]/15 px-[0.4em] py-[0.1em] rounded-[4px] mx-[0.1em] inline-block border border-[#f04d5a]/50">( )</span>) into the number above to make it equal <span className="font-bold text-[#212529] bg-[#fccf03] px-[0.4em] py-[0.1em] rounded-[4px] border border-[#1a1a1a]">100</span>.</p>
              <p className='mb-2'>Use all digits in order. This number is guaranteed to have a solution!</p>
            </div>
            <div className="my-8 p-6 bg-black/20 rounded-lg border-2 border-dashed border-[#4d4d4d]">
              <div className="flex justify-center items-center gap-4 flex-wrap">
                {renderDigits()}
              </div>
            </div>
            {/* General Hint Section */}
            <div className="mt-6">
              {showHint && (
                <div className="bg-[#fccf03]/10 border-2 border-[#fccf03] px-6 py-4 rounded-[5px] text-[#f8f9fa] shadow-[0_2px_5px_rgba(252,207,3,0.2)]">
                   <h3 className="mb-2 font-bold text-[#fccf03]" style={{ textShadow: '1px 1px 0 #1a1a1a' }}>Hint</h3>
                   <p className='mb-1'>Think order of operations (PEMDAS/BODMAS)! Parentheses <code className="font-['Roboto_Mono'] monospace bg-black/30 px-[0.3em] py-[0.1em] rounded-[3px]">()</code> are key. Try grouping operations like <code className="font-['Roboto_Mono'] monospace bg-black/30 px-[0.3em] py-[0.1em] rounded-[3px]">(...)*(...)</code> or <code className="font-['Roboto_Mono'] monospace bg-black/30 px-[0.3em] py-[0.1em] rounded-[3px]">... + (...) / ...</code>.</p>
                   <p className='mb-1'><i>Remember multiplication/division happen before addition/subtraction unless parentheses change the order.</i></p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: The Workspace */}
          <div className="bg-[#2a2a2e] rounded-lg px-8 py-6 sm:px-6 relative border-[3px] border-solid border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)]"
               style={{ borderImage: 'linear-gradient(45deg, #0077cc, #adb5bd) 1' }}>
             <h2 className="text-[1.8rem] mb-6 pb-[0.6rem] font-bold border-b-[3px] border-dashed inline-block pr-4 text-[#00ff00] border-b-[#4d4d4d]"
                 style={{ textShadow: '1px 1px 0 #1a1a1a' }}>
               Workspace <span className='text-[#00ff00]'>(Omnitrix Interface)</span> {/* b10-green class */}
             </h2>
             <div className="bg-[#1a1a1a] p-6 rounded-lg mb-6 border-2 border-[#4d4d4d]">
               <label htmlFor="expression-input" className="block mb-3 font-semibold text-[#00ff00] text-base uppercase tracking-[0.5px]">Your Expression:</label>
               <input
                 type="text" id="expression-input" ref={inputRef} value={expression}
                 onChange={handleExpressionChange} onKeyPress={handleKeyPress}
                 placeholder="Enter your full expression here..."
                 className="w-full py-[0.8rem] px-4 text-[1.4rem] border-2 border-[#4d4d4d] rounded-[5px] font-['Roboto_Mono'] monospace bg-[#4d4d4d] text-[#f8f9fa] transition-colors transition-shadow duration-200 ease-in-out shadow-[inset_2px_2px_2px_rgba(0,0,0,0.3)] placeholder:text-[#adb5bd] placeholder:text-[1.1rem] placeholder:italic focus:outline-none focus:border-[#00ff00] focus:shadow-[0_0_15px_3px_rgba(0,255,0,0.4)]"
                 aria-label="Mathematical expression input"
               />
               <div className="mt-6"> {/* Operators Panel */}
                 <p className="font-semibold text-[#cccccc] mb-3 text-[0.9rem] uppercase">Insert Operator:</p>
                 <div className="grid grid-cols-4 gap-3 sm:gap-2">
                   {['+', '−', '×', '÷', '^', '(', ')'].map(op => (
                     <button key={op}
                             className="h-[50px] sm:h-[45px] xs:h-[40px] text-[1.6rem] sm:text-[1.4rem] xs:text-[1.2rem] border-2 border-[#1a1a1a] rounded-full cursor-pointer transition-all duration-200 ease-in-out font-bold flex items-center justify-center shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_2px_2px_0px_#1a1a1a] relative top-0 left-0 bg-[#4d4d4d] text-[#cccccc] hover:bg-[#00cc00] hover:text-[#1a1a1a] hover:shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),_2px_2px_0px_#1a1a1a,_0_0_15px_3px_rgba(0,255,0,0.4)] active:shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] active:top-[2px] active:left-[2px] active:bg-[#00ff00] active:text-[#1a1a1a]"
                             onClick={() => insertOperator(op === '×' ? '*' : op === '÷' ? '/' : op === '−' ? '-' : op )}> {/* Map display chars to actual operators */}
                        {op}
                     </button>
                   ))}
                   <button className="h-[50px] sm:h-[45px] xs:h-[40px] text-base sm:text-[1.4rem] xs:text-[1.2rem] border-2 border-[#1a1a1a] rounded-full cursor-pointer transition-all duration-200 ease-in-out font-bold flex items-center justify-center shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_2px_2px_0px_#1a1a1a] relative top-0 left-0 bg-[#4d4d4d] text-[#f04d5a] hover:bg-[#00cc00] hover:text-[#1a1a1a] hover:shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),_2px_2px_0px_#1a1a1a,_0_0_15px_3px_rgba(0,255,0,0.4)] active:shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] active:top-[2px] active:left-[2px] active:bg-[#00ff00] active:text-[#1a1a1a]"
                           onClick={clearOperators}>
                       Reset
                   </button>
                 </div>
               </div>
             </div>

             {/* Action Buttons */}
             <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
               <button className="px-4 py-[0.9rem] text-[1.1rem] font-bold border-none rounded-[5px] cursor-pointer transition-all duration-200 ease-in-out text-center relative top-0 left-0 uppercase tracking-[1px] bg-gradient-to-b from-[#00ff00] to-[#00cc00] text-[#1a1a1a] border-2 border-[#00ff00] shadow-[0_0_8px_rgba(0,255,0,0.5),_3px_3px_0_#1a1a1a] hover:bg-gradient-to-b hover:from-[#33ff33] hover:to-[#00ff00] hover:shadow-[0_0_15px_rgba(0,255,0,0.8),_3px_3px_0_#1a1a1a] active:shadow-[inset_3px_3px_4px_rgba(0,0,0,0.4)] active:top-[2px] active:left-[2px]"
                       onClick={checkExpression}>Check Solution</button>
               <button className="px-4 py-[0.9rem] text-[1.1rem] font-bold border-none rounded-[5px] cursor-pointer transition-all duration-200 ease-in-out text-center relative top-0 left-0 uppercase tracking-[1px] bg-gradient-to-b from-[#0077cc] to-[#005a9e] text-white border-2 border-[#0077cc] shadow-[0_0_8px_rgba(0,119,204,0.4),_3px_3px_0_#1a1a1a] hover:bg-gradient-to-b hover:from-[#008ae6] hover:to-[#0077cc] hover:shadow-[0_0_15px_rgba(0,119,204,0.7),_3px_3px_0_#1a1a1a] active:shadow-[inset_3px_3px_4px_rgba(0,0,0,0.4)] active:top-[2px] active:left-[2px]"
                       onClick={generateNewNumber}>New Number</button>
             </div>

             {/* Result Box */}
            {message && (
              <div className={`mt-6 p-5 px-6 rounded-lg flex items-center gap-4 border-[3px] border-solid bg-black/30
                              ${isCorrect
                                ? 'border-[#00ff00] text-[#00ff00] shadow-[inset_0_0_10px_rgba(0,255,0,0.3),_0_0_5px_rgba(0,255,0,0.3)]'
                                : 'border-[#f04d5a] text-[#f04d5a] shadow-[inset_0_0_10px_rgba(240,77,90,0.3),_0_0_5px_rgba(240,77,90,0.3)]'}`
                            }>
                <div className={`text-[1.8rem] shrink-0 ${isCorrect ? 'animate-bounce' : 'animate-shake'}`}>{isCorrect ? '🎉' : '🤔'}</div>
                <div className="text-base font-semibold grow">{message}</div>
              </div>
            )}

             {/* Success Box */}
             {isCorrect && (
               <div className="mt-6 p-6 rounded-lg border-[3px] border-[#ffc300] text-center shadow-[0_0_10px_rgba(255,195,0,0.4)]"
                    style={{ background: 'radial-gradient(circle, rgba(255, 195, 0, 0.2) 0%, rgba(106, 13, 173, 0.1) 100%)' }}>
                 <h3 className="mb-2 text-[1.4rem] font-bold text-[#ffc300]" style={{ textShadow: '1px 1px 0 #6a0dad' }}>Awesome!</h3>
                 {/* Message is now shown in the result box above */}
               </div>
             )}
           </div> {/* End of workspace-section */}
         </div> {/* End of game-board */}

         {/* Footer */}
         <div className="mt-12 text-center pt-6 border-t-2 border-dashed border-[#4d4d4d] text-[#adb5bd]">
           <p className="mb-4 font-medium">Need Help or Finished Playing?</p>
           <div className="flex justify-center gap-4"> {/* Footer Actions */}
             <button className="px-8 py-[0.8rem] text-[1.1rem] font-bold border-2 border-[#1a1a1a] rounded-[5px] cursor-pointer transition-all duration-200 ease-in-out text-white no-underline inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] relative top-0 left-0 uppercase bg-[#f04d5a] hover:bg-[#d43a46] hover:border-[#1a1a1a] active:shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] active:top-[2px] active:left-[2px] active:bg-[#a0323d]" onClick={toggleGeneralHint}>
                 {showHint ? 'Hide Hint' : 'Show Hint'}
             </button>
             <button className="px-8 py-[0.8rem] text-[1.1rem] font-bold border-2 border-[#1a1a1a] rounded-[5px] cursor-pointer transition-all duration-200 ease-in-out text-white no-underline inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,0.6)] relative top-0 left-0 uppercase bg-[#f04d5a] hover:bg-[#d43a46] hover:border-[#1a1a1a] active:shadow-[inset_2px_2px_3px_rgba(0,0,0,0.5)] active:top-[2px] active:left-[2px] active:bg-[#a0323d]" onClick={handleQuit}>
                 Quit Game
             </button>
           </div>
         </div>
       </div> {/* End of Game Page Container */}
     </div> // End of Body Wrapper
  );
};

export default Gameplay; // Export with the new name