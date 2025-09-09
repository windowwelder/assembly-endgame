import {useState} from "react"
import {languages} from "./languages"
import {getRandomWord} from "./utils"

import ConfettiContainer from "./components/ConfettiContainer"
import Header from './components/Header'
import GameStatus from "./components/GameStatus";
import LanguageChips from "./components/LanguageChips";
import WordLetters from "./components/WordLetters";
import AriaLiveStatus from "./components/AriaLiveStatus";
import Keyboard from "./components/Keyboard";
import NewGameButton from "./components/NewGameButton";


export default function AssemblyEndgame() {
    // State values
    const [currentWord, setCurrentWord] = React.useState<string>( (): string => getRandomWord().toUpperCase())
    const [guessedLetters, setGuessedLetters] = React.useState<string[]>([])

    // Derived values
    const numGuessesLeft:number = languages.length - 1
    const wrongGuessCount:number =
        guessedLetters.filter((letter:string):boolean => !currentWord.includes(letter)).length
    const isGameWon:boolean =
        currentWord.split("").every((letter:string):boolean => guessedLetters.includes(letter))
    const isGameLost:boolean = wrongGuessCount >= numGuessesLeft
    const isGameOver:boolean = isGameWon || isGameLost
    const lastGuessedLetter:string = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect:boolean = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    // Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    function addGuessedLetter(letter:string):void {
        setGuessedLetters((prevLetters:string[]):string[] =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }

    function startNewGame():void {
        setCurrentWord(getRandomWord())
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