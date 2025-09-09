import Confetti from "react-confetti"

export default function ConfettiContainer({ isGameWon }) {
    if (!isGameWon) {
        return null
    }
    else {
        return (
            <Confetti
                recycle={false}
                numberOfPieces={1000}
            />
        )
    }

}