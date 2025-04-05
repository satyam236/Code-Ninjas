import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import { useNavigate } from 'react-router-dom';

// Start with an empty trainer list
const initialFriends = [];
// Define the background image URL
const pageBackgroundImageUrl = 'https://wallpapers.com/images/hd/pokemon-characters-evolution-j1ljresf8yofuwbf.jpg';

function Playwithfriend() {
  const navigate = useNavigate();

  const [trainers, setTrainers] = useState(initialFriends);
  const [newTrainerUsername, setNewTrainerUsername] = useState('');
  const [addTrainerMessage, setAddTrainerMessage] = useState('');

  const [selectedTrainerId, setSelectedTrainerId] = useState(null);
  const [isInBattle, setIsInBattle] = useState(false);
  const [currentOpponent, setCurrentOpponent] = useState(null);

  // --- Apply/Remove Body Background Style ---
  useEffect(() => {
    // Store original styles to restore them later
    const originalStyles = {
      backgroundImage: document.body.style.backgroundImage,
      backgroundSize: document.body.style.backgroundSize,
      backgroundPosition: document.body.style.backgroundPosition,
      backgroundAttachment: document.body.style.backgroundAttachment,
      backgroundRepeat: document.body.style.backgroundRepeat,
      // Optional: Store background color too if needed
      // backgroundColor: document.body.style.backgroundColor,
    };

    console.log("Applying body background style"); // For debugging

    // Apply new styles directly to the body element
    document.body.style.backgroundImage = `url('${pageBackgroundImageUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundRepeat = 'no-repeat';
    // Optional: Set a fallback background color
    // document.body.style.backgroundColor = '#f5f7fa';

    // Return a cleanup function to run when the component unmounts
    return () => {
      console.log("Restoring original body background style"); // For debugging
      // Restore the original styles
      document.body.style.backgroundImage = originalStyles.backgroundImage;
      document.body.style.backgroundSize = originalStyles.backgroundSize;
      document.body.style.backgroundPosition = originalStyles.backgroundPosition;
      document.body.style.backgroundAttachment = originalStyles.backgroundAttachment;
      document.body.style.backgroundRepeat = originalStyles.backgroundRepeat;
      // Optional: Restore background color
      // document.body.style.backgroundColor = originalStyles.backgroundColor;
    };
  }, []); // Empty dependency array means this effect runs only on mount and cleanup on unmount

  // --- Simulate Trainer Status Changes (remains the same) ---
  useEffect(() => {
    if (trainers.length > 0) {
      const interval = setInterval(() => {
        setTrainers(currentTrainers =>
          currentTrainers.map(trainer => ({
            ...trainer,
            isOnline: trainer ? (Math.random() > 0.3 ? trainer.isOnline : !trainer.isOnline) : false,
          }))
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [trainers.length]);

  const selectedTrainer = trainers.find(t => t.id === selectedTrainerId);

  // --- Event Handlers (remain the same) ---
  const handleAddTrainer = (event) => {
    event.preventDefault();
    const usernameToAdd = newTrainerUsername.trim();
    setAddTrainerMessage('');

    if (!usernameToAdd) {
      setAddTrainerMessage('Please enter a Trainer name.');
      return;
    }
    const alreadyExists = trainers.some(t => t.name.toLowerCase() === usernameToAdd.toLowerCase());
    if (alreadyExists) {
      setAddTrainerMessage(`${usernameToAdd} is already registered.`);
      setNewTrainerUsername('');
      return;
    }

    console.log(`Registering Trainer: ${usernameToAdd}`);
    const newTrainer = {
      id: Date.now(),
      name: usernameToAdd,
      isOnline: Math.random() > 0.5,
    };
    setTrainers(prevTrainers => [...prevTrainers, newTrainer]);
    setAddTrainerMessage(`Trainer ${usernameToAdd} registered!`);
    setNewTrainerUsername('');
    setTimeout(() => setAddTrainerMessage(''), 3000);
  };

  const handleSelectTrainer = (trainerId) => {
    if (isInBattle) return;
    setSelectedTrainerId(prevId => (prevId === trainerId ? null : trainerId));
  };

  const handleStartBattle = () => {
    if (!selectedTrainer || !selectedTrainer.isOnline || isInBattle) {
      return;
    }
    console.log(`Starting Battle with ${selectedTrainer.name}!`);
    setIsInBattle(true);
    setCurrentOpponent(selectedTrainer);
    setSelectedTrainerId(null);
  };

  const handleEndBattle = () => {
    if (!isInBattle) return;
    console.log(`Battle with ${currentOpponent?.name} ended.`);
    setIsInBattle(false);
    setCurrentOpponent(null);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // --- Render Logic (remains the same) ---
  const getMessageClass = (message) => {
    const baseClass = "mt-2.5 p-2 px-3 rounded border text-sm font-medium text-center";
    if (!message) return "";
    if (message.includes('registered') || message.includes('Successfully')) {
      return `${baseClass} bg-green-100 border-green-300 text-green-700`; // Success
    } else {
      return `${baseClass} bg-red-100 border-red-300 text-red-700`; // Error
    }
  };

  const renderBattleArea = () => {
    if (isInBattle) {
      return (
        <div className="mt-2.5 p-5 rounded-md border-2 border-gray-700 flex flex-col items-center justify-center gap-4 min-h-[150px] text-center bg-gradient-to-r from-pkmn-green via-pkmn-grey to-pkmn-orange text-white shadow-md">
          <span className="text-4xl mb-2 filter drop-shadow-md">⚡</span>
          <span className="font-bold text-xl mb-3">Battling {currentOpponent?.name}!</span>
          <button
            onClick={handleEndBattle}
            className="inline-flex items-center gap-2 px-4 py-2 rounded border-2 border-pkmn-grey-dark bg-pkmn-grey text-white font-semibold text-sm shadow-sm hover:bg-pkmn-grey-dark active:translate-y-px active:border-pkmn-grey disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span className='text-lg'>🛑</span> Flee Battle
          </button>
        </div>
      );
    }

    let statusMessage = "Select an available Friend from the list to challenge.";
    const canStartBattle = selectedTrainer && selectedTrainer.isOnline && !isInBattle;
    let statusBgClass = 'bg-gray-200 border-gray-400'; // Idle
    let statusTextClass = 'text-gray-700';

    if (selectedTrainer) {
      if (selectedTrainer.isOnline) {
        statusMessage = `Ready to challenge ${selectedTrainer.name}?`;
        statusBgClass = 'bg-green-100 border-pkmn-green'; // Ready
        statusTextClass = 'text-green-800 font-semibold';
      } else {
        statusMessage = `${selectedTrainer.name} is healing at the Pokémon Center.`;
        statusBgClass = 'bg-red-100 border-pkmn-red'; // Offline Selected
        statusTextClass = 'text-red-800 italic';
      }
    }

    return (
      <div className={`mt-2.5 p-5 rounded-md border-2 flex flex-col items-center justify-center gap-4 min-h-[150px] text-center transition-colors duration-200 ${statusBgClass}`}>
        <p className={`font-medium mb-2.5 ${statusTextClass}`}>{statusMessage}</p>
        <button
          onClick={handleStartBattle}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded border-2 border-pkmn-yellow-dark bg-pkmn-yellow text-gray-800 font-bold text-base shadow-sm hover:bg-pkmn-yellow-dark active:translate-y-px active:border-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:border-gray-400 disabled:text-gray-500 transition-all duration-200 w-4/5 max-w-[250px]"
          disabled={!canStartBattle}
          title={canStartBattle ? `Battle ${selectedTrainer?.name}!` : (selectedTrainer ? "Cannot battle an offline Trainer" : "Select an available Trainer")}
        >
          <span className='text-lg'>▶️</span> Start Battle!
        </button>
      </div>
    );
  };

  // Base classes (Remain the same)
  const cardClasses = "bg-white/95 p-5 rounded-lg shadow-card border-2 border-gray-300 flex flex-col";
  const cardHeaderClasses = "flex items-center gap-2.5 -mx-5 -mt-5 mb-5 px-5 py-2.5 bg-gray-100 border-b-2 border-gray-300 text-gray-800 text-lg font-semibold rounded-t-lg";
  const buttonBaseClasses = "inline-flex items-center gap-2 px-3 py-1.5 rounded border-2 font-semibold text-sm shadow-sm active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200";

  // --- Component Return JSX (remains the same) ---
  return (
    // App Container - Sits ON TOP of the body background
    <div className="font-sans max-w-5xl mx-auto bg-white/95 rounded-lg shadow-card overflow-hidden flex flex-col border-3 border-gray-400 relative z-10 my-8">
      {/* Header */}
      <header className="bg-gradient-to-br from-pkmn-blue to-blue-600 text-white p-5 text-center border-b-4 border-pkmn-yellow relative">
        <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2 py-1 rounded border border-white/50 bg-white/20 text-white text-xs font-medium hover:bg-white/40 hover:border-white/80 transition-colors duration-200"
            title="Go Back"
         >
            <span className='text-sm'>⬅️</span> Back
        </button>
        <svg height="60" viewBox="-5 -5 110 110" className="mx-auto h-14 w-14 filter drop-shadow-md mb-2">
            <circle cx="50" cy="50" r="48" fill="#f04b4c"/>
            <path d="M 50 50 A 48 48 0 0 0 2 50 H 98 A 48 48 0 0 0 50 50 Z" fill="#ffffff"/>
            <path d="M 2 50 A 48 48 0 0 0 98 50 H 2 Z" stroke="#303030" strokeWidth="6" fill="none"/>
            <circle cx="50" cy="50" r="18" fill="#ffffff" stroke="#303030" strokeWidth="6"/>
            <circle cx="50" cy="50" r="10" fill="#303030"/>
        </svg>
        <h1 className="text-2xl md:text-3xl font-bold mt-1 mb-1">Epic Mathematical Battle Stadium</h1>
        <p className="text-base md:text-lg opacity-90 font-medium">Challenge fellow Friends!</p>
      </header>

      {/* Main Content */}
      <main className="bg-blue-100/90 grid grid-cols-1 md:grid-cols-[minmax(300px,_1fr)_1.2fr] gap-5 p-5 flex-grow">
        {/* Left Column */}
        <div className="flex flex-col gap-5">
          {/* Add Trainer Card */}
          <section className={cardClasses}>
            <h2 className={cardHeaderClasses}>
               <span className='text-base'>➕</span> Add Friends
            </h2>
            <form onSubmit={handleAddTrainer} className="flex gap-2 mb-3.5">
              <input
                type="text"
                value={newTrainerUsername}
                onChange={(e) => setNewTrainerUsername(e.target.value)}
                placeholder="Enter Trainer name"
                className="flex-grow p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-pkmn-blue focus:ring-1 focus:ring-pkmn-blue text-sm"
                aria-label="Trainer's name"
              />
              <button
                 type="submit"
                 className={`${buttonBaseClasses} border-pkmn-red-light bg-pkmn-red text-white hover:bg-pkmn-red-dark`}
                 >
                 <span className='text-xs'>➕</span> Add
              </button>
            </form>
            {addTrainerMessage && <p className={getMessageClass(addTrainerMessage)}>{addTrainerMessage}</p>}
          </section>

          {/* Trainers List Card */}
          <section className={cardClasses}>
            <h2 className={cardHeaderClasses}>
              <span className='text-base'>👥</span> Friends ({trainers.length})
            </h2>
            <ul className="list-none max-h-[350px] overflow-y-auto -mx-2.5 -mb-2.5 pr-1">
              {trainers.length > 0 ? (
                trainers.map(trainer => (
                  <li
                    key={trainer.id}
                    className={`
                      flex items-center justify-between px-4 py-2.5 border-b border-gray-200 last:border-b-0
                      transition-colors duration-150 cursor-pointer group
                      focus:outline-none focus:ring-2 focus:ring-pkmn-blue focus:ring-offset-1 rounded-sm
                      ${isInBattle ? 'cursor-default opacity-70' : ''}
                      ${trainer.isOnline ? 'hover:bg-gray-100' : 'text-pkmn-grey italic cursor-default'}
                      ${selectedTrainerId === trainer.id && !isInBattle ? 'bg-pkmn-yellow-light border-l-4 border-pkmn-yellow font-semibold pl-3' : 'border-l-4 border-transparent'}
                    `}
                    onClick={() => handleSelectTrainer(trainer.id)}
                    tabIndex={isInBattle || !trainer.isOnline ? -1 : 0}
                    onKeyPress={(e) => e.key === 'Enter' && !isInBattle && trainer.isOnline && handleSelectTrainer(trainer.id)}
                  >
                    <div className="flex items-center gap-2.5 flex-grow mr-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border border-black/20 shadow-inner-light
                          ${trainer.isOnline ? 'bg-pkmn-green' : 'bg-pkmn-grey'}
                        `}
                        title={trainer.isOnline ? 'Available' : 'Unavailable'}
                      ></span>
                      <span className="trainer-name truncate">{trainer.name}</span>
                    </div>
                    {selectedTrainerId === trainer.id && !isInBattle && <span className="text-pkmn-yellow-dark text-lg ml-2.5">✨</span>}
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-600 mt-4 p-2.5 text-sm">No Friends registered yet.</p>
              )}
            </ul>
          </section>
        </div>

        {/* Right Column: Battle Zone */}
        <div className="flex flex-col">
          <section className={`${cardClasses} bg-pkmn-grey-light/90`}>
             <h2 className={`${cardHeaderClasses} bg-pkmn-yellow text-gray-800 border-b-pkmn-yellow-dark`}>
                <span className='text-lg'>⚡</span> Battle Zone
             </h2>
             {renderBattleArea()}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-3.5 bg-gray-200 border-t-2 border-gray-300 text-sm text-gray-600 font-medium mt-auto">
        Epic Mathematical Duel!
      </footer>
    </div>
  );
}

export default Playwithfriend;