import { Component } from '@angular/core';
export class Move {
  score : number ;
  index : number ;
}
@Component({
  selector: 'app-imbattable',
  templateUrl: './imbattable.page.html',
  styleUrls: ['./imbattable.page.scss'],
})
export class ImbattablePage {

  origBoard =  [0,1,2,3,4,5,6,7,8] ;
  huPlayer = 'O';
  aiPlayer = 'X';
  winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ] ;

  win = [] ;
  winPlayer = "" ;
  continueGame = true ;

  constructor() {}


  restart(){
    this.origBoard =  [0,1,2,3,4,5,6,7,8] ;
    this.continueGame = true ;
    this.win = [] ;
    this.winPlayer = "" ;
  }

  turnClick(id){
    if(typeof this.origBoard[id] == 'number'){
      this.turn(id, this.huPlayer)
      if (!this.checkTie()) {
        this.turn(this.bestSpot(), this.aiPlayer);
      }
    }

  }

  turn(squareId, player) {
    if(this.continueGame){
      this.origBoard[squareId] = player;

      let gameWon = this.checkWin(this.origBoard, player)
      if (gameWon) this.gameOver(gameWon)
    }

  }


  checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of this.winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = {index: index, player: player};
        break;
      }
    }
    return gameWon;
  }

  gameOver(gameWon) {
    this.win = this.winCombos[gameWon.index] ;
    this.winPlayer = gameWon.player ;
    this.continueGame = false ;
  }

  getClass(col){
    if (this.emptySquares().length == 0){
      return 'Tie' ;
    }
    else if(this.win.indexOf(col) > -1 && this.winPlayer == this.huPlayer ){
      return 'Iwin' ;
    }
    else if(this.win.indexOf(col) > -1 && this.winPlayer == this.aiPlayer ){
      return 'AIwin' ;
    }
    else  return '' ;
  }

  emptySquares(){
    return this.origBoard.filter(s => typeof s == 'number');
  }

  checkTie(){
    return this.emptySquares().length == 0;

  }

  bestSpot(){
    return this.minimax(this.origBoard, this.aiPlayer).index;
  }


  minimax(newBoard, player) {
    var availSpots = this.emptySquares();


    if (this.checkWin(newBoard, this.huPlayer)) {
      return {score: -1};
    } else if (this.checkWin(newBoard, this.aiPlayer)) {
      return {score: 1};
    } else if (availSpots.length === 0) {
      return {score: 0};
    }

    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      var move = new Move;
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == this.aiPlayer) {
        var result = this.minimax(newBoard, this.huPlayer);
        move.score = result.score;
      } else {
        var result = this.minimax(newBoard, this.aiPlayer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    var bestMove;
    if(player === this.aiPlayer) {
      var bestScore = -10000;
      for(var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      var bestScore = 10000;
      for(var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }


}
