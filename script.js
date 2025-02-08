class TicTacToe {
    constructor() {
        this.initializeGameState();
        this.setupEventListeners();
    }

    initializeGameState() {
        this.board = Array(9).fill('');
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.humanPlayer = null;
        this.AIPlayer = null;
    }

    setupEventListeners() {
        // DOM elements
        this.selectionScreen = document.getElementById('selection-screen');
        this.gameContainer = document.getElementById('game-container');
        this.statusElement = document.getElementById('status');
        this.cells = document.querySelectorAll('.cell');
        this.resetButton = document.getElementById('resetBtn');
        this.changeSymbolButton = document.getElementById('changeSymbolBtn');
        this.symbolButtons = document.querySelectorAll('.symbol-btn');

        // Winning combinations
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        // Event listeners
        this.symbolButtons.forEach(button => {
            button.addEventListener('click', () => this.startGame(button.dataset.symbol));
        });

        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
        this.changeSymbolButton.addEventListener('click', () => this.showSymbolSelection());
    }

    startGame(selectedSymbol) {
        this.humanPlayer = selectedSymbol;
        this.AIPlayer = selectedSymbol === 'X' ? 'O' : 'X';
        this.selectionScreen.classList.add('hidden');
        this.gameContainer.classList.remove('hidden');
        this.resetGame();

        // If AI goes first (human selected O)
        if (this.humanPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    showSymbolSelection() {
        this.gameContainer.classList.add('hidden');
        this.selectionScreen.classList.remove('hidden');
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');
        
        if (this.board[index] === '' && 
            this.gameActive && 
            this.currentPlayer === this.humanPlayer) {
            
            this.makeMove(index);
            
            if (this.gameActive) {
                this.gameContainer.classList.add('thinking');
                setTimeout(() => {
                    this.makeAIMove();
                    this.gameContainer.classList.remove('thinking');
                }, 500);
            }
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());
        
        if (this.checkWin()) {
            this.statusElement.textContent = `${this.currentPlayer} wins!`;
            this.gameActive = false;
            return;
        }
        
        if (this.checkDraw()) {
            this.statusElement.textContent = "Game ended in a draw!";
            this.gameActive = false;
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.statusElement.textContent = `${this.currentPlayer}'s turn`;
    }

    makeAIMove() {
        if (!this.gameActive) return;
        
        const bestMove = this.findBestMove();
        if (bestMove !== -1) {
            this.makeMove(bestMove);
        }
    }

    findBestMove() {
        let bestScore = -Infinity;
        let bestMove = -1;
        
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = this.AIPlayer;
                let score = this.minimax(0, false);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }

    minimax(depth, isMaximizing) {
        const winner = this.checkWinningPlayer();
        
        if (winner === this.AIPlayer) return 10 - depth;
        if (winner === this.humanPlayer) return depth - 10;
        if (this.checkDraw()) return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === '') {
                    this.board[i] = this.AIPlayer;
                    bestScore = Math.max(bestScore, this.minimax(depth + 1, false));
                    this.board[i] = '';
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === '') {
                    this.board[i] = this.humanPlayer;
                    bestScore = Math.min(bestScore, this.minimax(depth + 1, true));
                    this.board[i] = '';
                }
            }
            return bestScore;
        }
    }

    checkWinningPlayer() {
        for (let combination of this.winningCombinations) {
            if (
                this.board[combination[0]] !== '' &&
                this.board[combination[0]] === this.board[combination[1]] &&
                this.board[combination[0]] === this.board[combination[2]]
            ) {
                return this.board[combination[0]];
            }
        }
        return null;
    }

    checkWin() {
        return this.checkWinningPlayer() !== null;
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.gameActive = true;
        this.currentPlayer = 'X';
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        
        this.statusElement.textContent = `${this.currentPlayer}'s turn`;
        
        if (this.humanPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});