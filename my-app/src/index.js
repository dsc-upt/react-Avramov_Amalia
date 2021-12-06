import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.isHighlight ? "square-highlight" : "square"} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const winner=this.props.winner;
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isHighlight={winner && winner.includes(i)}
            />
        );
    }

    render() {
        let squares=[]
        for(let i=0;i<3;i++){
            let row=[]
            for(let j=0;j<3;j++){
                row.push(this.renderSquare(3*i+j))
            }
            squares.push(<div className="border-row">{row}</div>);
        }

        return (
            <div>
                <div className="board-row">
                    {squares}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            isAscend: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    latestMove: i
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }
    handleSort(){
        this.setState({
                isAscend: !this.state.isAscend
            }
        )
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerLine = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const latestMove=step.latestMove
            const row=latestMove%3+1
            const col=Math.floor(latestMove/3)+1
            const desc = move ?
                'Go to move #' + move + ' (' + col + ',' + row + ')' :
                'Go to game start';
            return (
                <li key={move}>
                    <button className={move===this.state.stepNumber ? "currently-item" : ""} onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        let newMoves=[]
        const isAscend=this.state.isAscend
        if(isAscend===false){
            for(let i=moves.length-1;i>=0;i--){
                newMoves.push(moves[i])
            }
        }

        let status;
        if (winnerLine!=null) {
            status = "Winner: " + current.squares[winnerLine[0]] //+ " " + winnerLine[0]+ " " +winnerLine[1]+ " " + winnerLine[2];
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        winner={winnerLine}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{isAscend===false ? newMoves : moves}</ol>
                    <button onClick={() => this.handleSort()}>
                        {this.state.isAscend===false ? 'Ascending': 'Descending'}
                    </button>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}
