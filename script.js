// script.js
document.addEventListener('DOMContentLoaded', () => {
    const correctPassword = 'ademyhebyosr'; // Set your password here

    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const errorMessage = document.getElementById('error-message');

    passwordSubmit.addEventListener('click', () => {
        const enteredPassword = passwordInput.value;
        if (enteredPassword !== correctPassword) {
            errorMessage.classList.remove('hidden');
        } else {
            passwordModal.style.display = 'none';
            initializePuzzles();
        }
    });

    function initializePuzzles() {
        const puzzles = [
            { containerId: 'puzzle1-container', imageURL: 'images/adem.jpg', nextPuzzle: 'images/image2.jpg' },
            { containerId: 'puzzle2-container', imageURL: 'images/adem2.jpg', nextPuzzle: 'images/image3.jpg' },
            { containerId: 'puzzle3-container', imageURL: 'images/adem3.jpg', nextPuzzle: null }
        ];

        let currentPuzzleIndex = 0;
        const totalPuzzles = puzzles.length;
        const rows = 4;
        const cols = 4;

        loadPuzzle(puzzles[currentPuzzleIndex]);

        function loadPuzzle(puzzleConfig) {
            const puzzleContainer = document.getElementById(puzzleConfig.containerId);
            puzzleContainer.classList.add('active');
            puzzleContainer.classList.remove('solved');
            initPuzzle(puzzleContainer, puzzleConfig.imageURL, puzzleConfig.nextPuzzle);
        }

        function initPuzzle(puzzleContainer, imageURL, nextPuzzle) {
            let pieces = [];
            let draggedPiece = null;

            const img = new Image();
            img.src = imageURL;
            img.onload = () => {
                pieces = [];
                puzzleContainer.innerHTML = '';
                for (let i = 0; i < rows * cols; i++) {
                    const piece = document.createElement('div');
                    piece.classList.add('puzzle-piece');
                    piece.style.backgroundImage = `url(${imageURL})`;
                    piece.style.backgroundPosition = `${-(i % cols) * 100}% ${-Math.floor(i / cols) * 100}%`;
                    piece.style.order = i;
                    piece.dataset.index = i;
                    piece.draggable = true;
                    piece.addEventListener('dragstart', dragStart);
                    piece.addEventListener('touchstart', touchStart);
                    piece.addEventListener('touchmove', touchMove);
                    piece.addEventListener('touchend', touchEnd);
                    pieces.push(piece);
                    puzzleContainer.appendChild(piece);
                }
                shufflePieces(pieces);
            };

            function shufflePieces(pieces) {
                for (let i = pieces.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [pieces[i].style.order, pieces[j].style.order] = [pieces[j].style.order, pieces[i].style.order];
                }
            }

            function dragStart(event) {
                draggedPiece = event.target;
            }

            function touchStart(event) {
                draggedPiece = event.target;
            }

            function touchMove(event) {
                event.preventDefault();
                const touch = event.touches[0];
                draggedPiece.style.left = touch.clientX - (draggedPiece.offsetWidth / 2) + 'px';
                draggedPiece.style.top = touch.clientY - (draggedPiece.offsetHeight / 2) + 'px';
            }

            function touchEnd(event) {
                const targetPiece = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                if (targetPiece && targetPiece.classList.contains('puzzle-piece')) {
                    [draggedPiece.style.order, targetPiece.style.order] = [targetPiece.style.order, draggedPiece.style.order];
                    draggedPiece.style.left = '';
                    draggedPiece.style.top = '';
                    if (isSolved(pieces)) {
                        puzzleContainer.classList.add('solved');
                        pieces.forEach(piece => {
                            piece.classList.add('solved');
                        });
                        currentPuzzleIndex++;
                        if (currentPuzzleIndex < totalPuzzles) {
                            puzzleContainer.style.display = 'none';
                            loadPuzzle(puzzles[currentPuzzleIndex]);
                        } else {
                            puzzleContainer.style.display = 'none';
                            document.getElementById('message').classList.remove('hidden');
                        }
                    }
                }
            }

            function isSolved(pieces) {
                return pieces.every((piece, index) => parseInt(piece.style.order) === parseInt(piece.dataset.index));
            }
        }
    }
});
