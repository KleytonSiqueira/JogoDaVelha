/**
 * Código desenvolvido por: Kleyton Rafael da Silva Siqueira - 176803
 * 
 * Obs: Realizei um "teste de portabilidade", e na versão do meu internet explorer não dá suporte para o forEach em arrays
 * Como alternativa, implementei a função eachImplements para ter comportamento semelhante.
 * 
 * Tendo em vista a portabilidade também, no explorer não oferecia suporte para arrow functions
 * Então substituí por funções anônimas (acredito que esse seja o nome correto)
 * 
 * Aparentemente em todos os navegadores rodaram corretamente.
 * 
 * Sugestões de melhoria no código ou na implementação são bem-vindas.
 * 
 */
var _boardEl = document.getElementById("gameContent");
var _playerWaveLabelEl = document.getElementById("wave");
var _player1El = document.getElementById("player1");
var _player2El = document.getElementById("player2");
var _board = [0,0,0,0,0,0,0,0,0];
var _wave = 1;
var _winner = 0;
var _finish = false;

function choosePosition(index){
    if(_board[index] == 0){
        _board[index] = _wave;
        return true;
    }
    return false;
}

// Responsável por indicar ao usuário qual jogador está jogando
function changeWaiter(){
    var playerWave = 'player';
    var waiter = playerWave + ' waiter';
    if(_winner==0){
        if(_finish){
            _player2El.className = waiter;
            _player1El.className = waiter;
        }
        else if(_wave===1){
            _player2El.className = waiter;
            _player1El.className = playerWave;
        }
        else{
            _player1El.className = waiter;
            _player2El.className = playerWave;
        }
    }
}

function setPlayerWave(){
    if(!_finish){
        _playerWaveLabelEl.innerText = "Vez do jogador " + ((_wave===1) ? 1: 2);
    }
    else{
        _playerWaveLabelEl.innerText = "Partida finalizada!";
    }
    changeWaiter();
}

// Criar os elementos do tabuleiro
function fillBoard(){
    _boardEl.innerHTML = "";
    var row;
    for(var iterator = 0; iterator<9; iterator++){
        if(iterator%3==0){
            row  = document.createElement('div');
            if(iterator==3) row.setAttribute('class','middle');
        }
        var cell = document.createElement('div');
        cell.setAttribute('class','cell empty');
        row.appendChild(cell);
        if(iterator%3==2) _boardEl.appendChild(row);
    }

}

// Alternativa para forEach
function eachImplements(arrayObject, callback){
    let arrLength = arrayObject.length;
    for(let i = 0; i < arrLength; i++){
        callback(arrayObject[i], i);
    }
}

// Adicionando escuta de evento click no tabuleiro
// Implementei o evento de click assim para impedir que alterações manuais no HTML interfiram na execução do script
function addPositionAction(){
    eachImplements(_boardEl.childNodes, function(itemRow, indexRow){
        eachImplements(itemRow.childNodes, function(itemCell, indexCell){

            itemCell.addEventListener('click', function(clickEvent) {
                if(_winner == 0 && choosePosition( (3 * indexRow) + indexCell )){
                    _winner = checkWinner(_wave, indexRow, indexCell);
                    _wave = -_wave;
                    itemCell.innerText = (_wave==-1)? 'X': 'O';
                    itemCell.setAttribute('class','cell');
                    if(_winner!=0 || getEmptyPositionCount()==0){
                        _finish=true;
                        setPlayerWave();
                        setFinishState();
                    }else{
                        setPlayerWave();
                    }
                }
                else if(_finish){
                    setFinishState();
                }
            });
        });
    });
}

function getEmptyPositionCount(){
    return _board.filter( function(value) { return value==0}).length;
}

// Verificar situação de jogo (alguém já venceu?)
function checkWinner(player, row, column){

    let zeroLength = getEmptyPositionCount();

    // Verificando se marcou ponto
    if(zeroLength < 5){
        // Checando se o jogador marcou ponto em uma linha
        if(_board[(row*3)+0] === _board[(row*3)+1] && _board[(row*3)+1] === _board[(row*3)+2])
            return player;

        // Checando se o jogador marcou ponto em uma coluna
        if(_board[0+column] === _board[3+column] && _board[3+column] === _board[6+column])
            return player;

        // Checando se o jogador marcou ponto na primeira diagonal
        if((row+column) === 2 && _board[6] === _board[4] && _board[4] === _board[2])
            return player;
            
        // Checando se o jogador marcou ponto na segunda diagonal
        if((row + column) === 2*row && _board[8] === _board[4] && _board[4] === _board[0])
            return player;
    }
    // Ninguém ganhou ainda ou o jogo ficou empatado
    return 0;
}

// Controlador do modal de fim de jogo
function setFinishState(){
    // Linhas 151 - 153 é uma solução para caso o usuário remova o elemento da página ou altere ele para tentar clicar no tabuleiro
    var lastEl = _boardEl.lastElementChild;
    if(_boardEl.childNodes.length == 4 || lastEl.classList.contains('modal-finished'))
        _boardEl.removeChild(lastEl);
    _boardEl.appendChild(finishModalGame());
}

// Criar os elementos do modal
function finishModalGame(){
    var finishModal = document.createElement('div');
    finishModal.setAttribute('class','modal-finished')
    var restartButton = document.createElement('button');
    if(_winner===0){
        finishModal.innerHTML = 
            "<p>Empatou!</p>" + 
            "<p>Muito bem jogado!</p>";
    }
    else{
        let temp = "<p>Jogador ";
        temp += (_winner === 1)? 1: 2;
        temp += " venceu!</p>";
        finishModal.innerHTML = "<p>Parabéns!</p>" + temp;
    }
    restartButton.innerText = "Jogar novamente";
    restartButton.addEventListener('click', function(clickEvent) {
        gameInit();
    });
    finishModal.appendChild(restartButton);
    return finishModal;
}

// Inicializa/Reinicia o game
function gameInit(){
    _finish = false;
    _board = [0,0,0,0,0,0,0,0,0];
    _winner = 0;
    _wave = 1;
    fillBoard();
    addPositionAction();
    setPlayerWave();
}

gameInit();