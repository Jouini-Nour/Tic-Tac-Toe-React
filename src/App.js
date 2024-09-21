import { useState } from 'react';

function Square({ value, onSquareClick,highlight }) {
  return(
    <button className={`square ${highlight}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({size,xIsNext, squares,onPlay}) {
  
  function handleClick(i){
    if(squares[i] || calculateWinner(size,squares)){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X";  
    }else{
      nextSquares[i] = "O";
    }
    
    onPlay(nextSquares)
  }

  const winnerInfo = calculateWinner(size,squares);
  const winner = winnerInfo ? winnerInfo.winner : null ;
  const winningCombo = winnerInfo ? winnerInfo.line : [];

  const draw = isDraw(squares);
  let status;
  if(winner){
    status= "Winner: " +winner;
  }else if (draw){
    status = "It's a draw!";
  }else{
    status= "Next player: " +(xIsNext ? "X": "O")
  }

  function renderSquare(i) {
    const highlight = winningCombo.includes(i) ? "highlight" : '';
    
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        highlight = {highlight}
      />
    );
  }

  const boardSize = size; 
  const board = [];
  
  
  for (let row = 0; row < boardSize; row++) {
    const squareRow = [];
    for (let col = 0; col < boardSize; col++) {
      squareRow.push(renderSquare(row * boardSize + col));
    }
    board.push(
      <div key={row} className="board-row">
        {squareRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game(){
  
  const [history, setHistory] =useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove]=useState(0)
  const xIsNext = currentMove%2 ===0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);
  const [boardSize,setBoardSize] =useState(3);

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0,currentMove+1),nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
    
  }
  function classicBoard(){
    if(boardSize ==3){
      return
    }
    setBoardSize(3);
    resetGame();
  }
  function unOrthodoxBoard(){
    if(boardSize==4){
      return
    }
    setBoardSize(4);
    resetGame();
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }
  function toggleSortOrder(){
    setIsAscending(!isAscending);
  }
  function resetGame(){
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    
    // Conditionally render text for the current move, button for others
    if (move === currentMove) {
      return (
        <li key={move}>
          <span>You are at move #{move}</span>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  const sortedMoves = isAscending ? moves : [...moves].reverse();
  
  return (
    <div className='game'>
      <div className='game-board'>
        <Board size ={boardSize} xIsNext={xIsNext} squares = {currentSquares} onPlay = {handlePlay}/>
      </div>
      
      <div className='game-info'>
      
        <button onClick={classicBoard}>3x3</button>
        <button onClick={unOrthodoxBoard}>4x4</button>
      
        <button onClick={toggleSortOrder}>
          {isAscending ? 'Sort Descending': "Sort Ascending"}
        </button>
        <button onClick={resetGame}>Reset Game</button>
        <ul>
          {sortedMoves}
        </ul>
      </div>
    </div>

  );

}

function calculateWinner(size,squares) {
  let lines;
  if(size ==3){
    lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  }else if(size ==4){
    lines=[
      [0,1,2],
      [1,2,3],
      [4,5,6],
      [5,6,7],
      [8,9,10],
      [9,10,11],
      [12,13,14],
      [13,14,15],
      [0,4,8],
      [4,8,12],
      [1,5,9],
      [5,9,13],
      [2,6,10],
      [6,10,14],
      [3,7,11],
      [7,11,15],
      [0,5,10],
      [5,10,15],
      [4,9,14],
      [1,6,11],
      [2,5,8],
      [7,10,13],
      [3,6,9],
      [6,9,12]
    ]
  }
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner :squares[a],line :[a,b,c]};
    }
  }
  return null;
}
function isDraw(squares){
  return squares.every(square => square !==null);
}
