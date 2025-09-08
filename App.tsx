import React from "react"
import { languages } from "./languages"
import { clsx } from "clsx"
import { useWindowSize } from 'react-use'
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"


export default function AssemblyEndgame() {
    const [currentWord, setCurrentWord] = React.useState( () => getRandomWord().toUpperCase())
    const [guessedLetters, setGuessedLetters] = React.useState([])

    let wrongGuessCount = guessedLetters.map(
        letter => currentWord.includes(letter) ? true : false
        ).filter( el => !el ).length;

    const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length - 1
    const isGameOver = isGameWon || isGameLost

    const isWrongGuess = guessedLetters.length > 0 ? !currentWord.includes(guessedLetters[guessedLetters.length - 1]) : false

    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1] || ""
    const numGuessesLeft = languages.length - 1 - wrongGuessCount

    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    const { width, height } = useWindowSize()

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }

    const languagesChips = languages.map( (el,index) => 
        {
            const isLanguageLost = index < wrongGuessCount
            const classNameLang = clsx("chip", isLanguageLost && "lost"
    );
        return (
                <span
                    key={index} 
                    className={classNameLang}  
                    style={{
                        backgroundColor: el.backgroundColor,
                        color: el.color
                    }}>
            {el.name}
                </span>)
        }
    )

    const word = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const classNameLetters = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={classNameLetters}>
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
            )
        }
    )
         
    const letters = alphabet.toUpperCase().split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })
        
        return (
            <button
                className={className}
                key={letter}
                onClick={() => addGuessedLetter(letter)}
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isWrongGuess
    })

    function renderGameStatus() {
        if (!isGameOver && !isWrongGuess) {
            return (
                <>
                    {null}
                </>
            )
        }
        else if (!isGameOver && isWrongGuess) {
            return (
                <>
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
                </>
                )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2><p>Well done! 🎉</p>
                </>
            )
        } else {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }
    }

    function resetGame() {
        setCurrentWord(getRandomWord().toUpperCase())
        setGuessedLetters([])
    }

    

    return (
        <main>
            {isGameWon && 
            <Confetti 
                recycle={false}
                numberOfPieces={1000}
                width={window.innerWidth}
                height={document.documentElement.scrollHeight}
            />}
            <header>
                <h1>Assembly: Endgame</h1>
                <p className="description">Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
            </header>
            {
                <section className={gameStatusClass}>
                    {renderGameStatus()}
                </section> 
            }
            <section className="chips-container">
                {languagesChips}
            </section>
            <section className="word">
                {word}
            </section>

            <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter => 
                guessedLetters.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            
            </section>

            <section className="keyboard">
                {letters}
            </section>
            {isGameOver && <button className="new-game" onClick={resetGame}>New Game</button>}
        </main>
    )
}