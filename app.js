(function() {
  var DIRECTION, PuzzleBoard, puzzleBoard, root,
    __slice = [].slice;

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.DIRECTION = DIRECTION = {
    UP: {
      x: 0,
      y: 1
    },
    RIGHT: {
      x: -1,
      y: 0
    },
    DOWN: {
      x: 0,
      y: -1
    },
    LEFT: {
      x: 1,
      y: 0
    }
  };

  PuzzleBoard = (function() {
    function PuzzleBoard() {}

    PuzzleBoard.prototype.boardEl = null;

    PuzzleBoard.prototype.boardCtx = null;

    PuzzleBoard.prototype.image = null;

    PuzzleBoard.prototype.size = 0;

    PuzzleBoard.prototype.map = [];

    PuzzleBoard.prototype.setup = function(opts) {
      var piece;
      if (opts == null) {
        opts = {};
      }
      if (opts.el != null) {
        this.boardEl = opts.el;
      }
      if (typeof this.boardEl === 'string') {
        this.boardEl = document.querySelector(this.boardEl);
      }
      if (this.boardEl != null) {
        this.boardCtx = this.boardEl.getContext('2d');
      }
      if (opts.image != null) {
        this.image = opts.image;
      }
      if (opts.n != null) {
        this.size = opts.n;
      }
      if (this.size != null) {
        this.map = this.shuffle((function() {
          var _i, _ref, _results;
          _results = [];
          for (piece = _i = 1, _ref = this.size * this.size; 1 <= _ref ? _i <= _ref : _i >= _ref; piece = 1 <= _ref ? ++_i : --_i) {
            _results.push(piece);
          }
          return _results;
        }).call(this));
      }
      while (this.isFinish()) {
        this.setup();
      }
      return this.drawPuzzle();
    };

    PuzzleBoard.prototype.move = function(dir) {
      var dx, dy, eIndex, ex, ey, sIndex, sx, sy, _ref, _ref1, _ref2;
      dx = dir.x, dy = dir.y;
      if (!((dx != null) && (dy != null))) {
        return;
      }
      _ref = this.getPiecePos(this.size * this.size), ex = _ref.x, ey = _ref.y;
      eIndex = this.xyToIndex(ex, ey);
      if (ex === 0 && ey === 0) {
        return;
      }
      _ref1 = [ex + dx, ey + dy], sx = _ref1[0], sy = _ref1[1];
      sIndex = this.xyToIndex(sx, sy);
      if (!((0 < sx && sx <= this.size))) {
        return;
      }
      if (!((0 < sy && sy <= this.size))) {
        return;
      }
      _ref2 = [this.map[sIndex], this.map[eIndex]], this.map[eIndex] = _ref2[0], this.map[sIndex] = _ref2[1];
      return this.drawPuzzle();
    };

    PuzzleBoard.prototype.getPiecePos = function(piece) {
      var i, notFoundPos, other, _i, _len, _ref;
      _ref = this.map;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        other = _ref[i];
        if (other === piece) {
          return this.indexToXY(i);
        }
      }
      return notFoundPos = {
        x: 0,
        y: 0
      };
    };

    PuzzleBoard.prototype.hasPiece = function() {
      var index, opts, x, y;
      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (opts.length === 1) {
        x = opts.x, y = opts.y;
      } else {
        x = opts[0], y = opts[1];
      }
      index = y * this.size + x + 1;
      return this.map[index] === this.size * this.size;
    };

    PuzzleBoard.prototype.isFinish = function() {
      var i, piece, _i, _len, _ref;
      _ref = this.map;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        piece = _ref[i];
        if (i + 1 !== piece) {
          return false;
        }
      }
      return true;
    };

    PuzzleBoard.prototype.drawPuzzle = function() {
      var board;
      if (!((this.image != null) && (this.boardEl != null))) {
        return;
      }
      board = this;
      return this.loadImage(this.image, function() {
        var ax, ay, count, cx, cy, height, i, n, piece, px, py, qx, qy, width, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _results;
        n = board.size;
        count = n * n;
        width = this.width / n;
        height = this.height / n;
        board.boardEl.setAttribute('width', this.width);
        board.boardEl.setAttribute('height', this.height);
        _ref = board.map;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          piece = _ref[i];
          if (piece === n * n) {
            continue;
          }
          _ref1 = board.pieceToXY(piece), ax = _ref1.x, ay = _ref1.y;
          _ref2 = board.indexToXY(i), cx = _ref2.x, cy = _ref2.y;
          _ref3 = [ax - 1, ay - 1, cx - 1, cy - 1], ax = _ref3[0], ay = _ref3[1], cx = _ref3[2], cy = _ref3[3];
          _ref4 = [ax * width, ay * height, cx * width, cy * height], px = _ref4[0], py = _ref4[1], qx = _ref4[2], qy = _ref4[3];
          _results.push(board.boardCtx.drawImage(this, px, py, width, height, qx, qy, width, height));
        }
        return _results;
      });
    };

    PuzzleBoard.prototype.loadImage = function(src, onload) {
      var img;
      img = new Image;
      img.onload = onload;
      img.src = src;
      return img;
    };

    PuzzleBoard.prototype.xyToIndex = function() {
      var opts, x, y;
      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (opts.length === 1) {
        x = opts.x, y = opts.y;
      } else {
        x = opts[0], y = opts[1];
      }
      return (y - 1) * this.size + x - 1;
    };

    PuzzleBoard.prototype.indexToXY = function(i) {
      var pos;
      pos = {
        x: i % this.size + 1,
        y: (parseInt(i / this.size, 10)) + 1
      };
      return pos;
    };

    PuzzleBoard.prototype.pieceToXY = function(p) {
      return this.indexToXY(p - 1);
    };

    PuzzleBoard.prototype.shuffle = function(arr) {
      return arr.sort(function(a, b) {
        var _ref;
        return (_ref = Math.random() > 0.5) != null ? _ref : {
          a: b
        };
      });
    };

    return PuzzleBoard;

  })();

  puzzleBoard = new PuzzleBoard;

  root.startGame = puzzleBoard.setup.bind(puzzleBoard);

  root.restartGame = puzzleBoard.setup.bind(puzzleBoard);

  root.move = puzzleBoard.move.bind(puzzleBoard);

  root.hasPiece = puzzleBoard.hasPiece.bind(puzzleBoard);

  root.getPiecePos = puzzleBoard.getPiecePos.bind(puzzleBoard);

  root.isFinish = puzzleBoard.isFinish.bind(puzzleBoard);

}).call(this);
