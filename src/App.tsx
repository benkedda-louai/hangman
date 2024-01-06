import { useCallback, useEffect, useState } from "react"
import words from './wordList.json'
import './style.css'
import HangmanDrawing from "./HangmanDrawing";
import Keyboard from "./Keyboard";
import HangmanWord from "./HangmanWrod";
function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}
function App() {
  const [wordToGuess,setWordToGuess] = useState(getWord)
  const [guessedLetters,setGuessLetters] = useState<string []>([])

  console.log(wordToGuess)
  const inCorrectLetters = guessedLetters.filter( 
    letter => !wordToGuess.includes(letter)
    )
    const isLoser = inCorrectLetters.length >= 6;
    const isWinner = wordToGuess.split("").every(letter => guessedLetters.includes(letter))

    const addGuessedLetter = useCallback(
      (letter: string) => {
      if(guessedLetters.includes(letter) || isLoser || isWinner) return
      setGuessLetters(currentLetters => [...currentLetters,letter])
    },[guessedLetters,isWinner,isLoser])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if(!key.match(/^[a-z]$/)) return
      e.preventDefault()
      addGuessedLetter(key)

    }
    document.addEventListener("keypress",handler)
    return () => {
      document.removeEventListener("keypress",handler)
    }
  },[guessedLetters])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      if(key !== "Enter") return
      e.preventDefault()
      setGuessLetters([])
      setWordToGuess(getWord())

    }
    document.addEventListener("keypress",handler)
    return () => {
      document.removeEventListener("keypress",handler)
    }
  },[])
  return (
    <div className="container">
      <div className="Text">{isWinner && "Winner! - Refresh to try again"}{isLoser && "NiceTry! - Refresh to try again"}</div>
      <HangmanDrawing numberOfGuesses={inCorrectLetters.length}/>
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess}/>
      <div style={{alignSelf: "stretch"}}>
      <Keyboard
      disabled={isWinner || isLoser}
      activeLetter={guessedLetters.filter(
        letter => wordToGuess.includes(letter)
      )}
      inactiveLetters={inCorrectLetters}
      addGuessedLetter={addGuessedLetter} />
      </div>
    </div>
  )
}

export default App
