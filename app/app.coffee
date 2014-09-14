# Puzzle map coordinate
#
#         x
#       y   1     2    3    4    5
#         +----+----+----+----+----+
#       1 |    |    |    |    |    |
#         |    |    |    |    |    |
#         +----+----+----+----+----+
#       2 |    |    |    |    |    |
#         |    |    |    |    |    |
#         +----+----+----+----+----+
#       3 |    |    |    |    |    |
#         |    |    |    |    |    |
#         +----+----+----+----+----+
#       4 |    |    |    |    |    |
#         |    |    |    |    |    |
#         +----+----+----+----+----+
#       5 |    |    |    |    |    |
#         |    |    |    |    |    |
#         +----+----+----+----+----+
#
#
# Piece ordering
#
#         (x, y) -> order
#         (1, 1) -> 1
#         (2, 1) -> 2
#         (3, 1) -> 3
#         ...
#         (N, 1) -> N
#         (1, 2) -> N + 1
#         ...
#         (N, N) -> N * N
#
#
# Move direction
#
#                     UP
#                     |
#                LEFT-+-RIGHT
#                     |
#                    DOWN

root = exports ? window

root.DIRECTION = DIRECTION =
  UP    : {x : 0, y  : 1}
  RIGHT : {x : -1, y  : 0}
  DOWN  : {x : 0, y  : -1}
  LEFT  : {x : 1, y : 0}


class PuzzleBoard
  # Drawing canvas & context.
  boardEl: null
  boardCtx: null

  # Image source.
  image: null

  # Puzzle size.
  size: 0

  # Pieces index.
  map: []

  setup: (opts) ->
    opts = {} unless opts?

    @boardEl = opts.el if opts.el?
    if typeof @boardEl is 'string'
      @boardEl = document.querySelector @boardEl
    @boardCtx = @boardEl.getContext('2d') if @boardEl?

    @image = opts.image if opts.image?

    @size = opts.n if opts.n?
    @map = (@shuffle (piece for piece in [1..@size*@size])) if @size?
    
    # Insure the game board is shuffled.
    @setup() while @isFinish()
    
    @drawPuzzle()

  # Move a piece
  move: (dir) ->
    {x: dx, y: dy} = dir
    return unless dx? and dy?
    
    # Empty piece's position.
    {x: ex, y: ey} = @getPiecePos @size * @size
    eIndex = @xyToIndex ex, ey
    return if ex == 0 and ey == 0

    # Target piece's position.
    [sx, sy] = [ex + dx, ey + dy]
    sIndex = @xyToIndex sx, sy
    return unless 0 < sx <= @size
    return unless 0 < sy <= @size

    [@map[eIndex], @map[sIndex]] = [@map[sIndex], @map[eIndex]]

    @drawPuzzle()

  # Get a piece's x-y position.
  getPiecePos: (piece) ->
    for other, i in @map
      if other == piece
        return @indexToXY i

    notFoundPos =
      x: 0
      y: 0

  # Check if there a piece in the position.
  hasPiece: (opts...) ->
    if opts.length == 1
      {x: x, y: y} = opts
    else
      [x, y] = opts

    index = y * @size + x + 1
    @map[index] == @size * @size

  # Check if game is finish.
  isFinish: ->
    for piece, i in @map
      return false if i + 1 != piece

    true

  # Draw puzzle
  drawPuzzle: ->
    return unless @image? and @boardEl?

    board = @

    @loadImage @image, ->
      n = board.size
      count = n * n
      width = @width / n
      height = @height / n

      board.boardEl.setAttribute 'width', @width
      board.boardEl.setAttribute 'height', @height

      for piece, i in board.map
        # Skip the last piece
        continue if piece == n * n

        {x: ax, y: ay} = board.pieceToXY piece
        {x: cx, y: cy} = board.indexToXY i
        # Not zero base index
        [ax, ay, cx, cy] = [ax - 1, ay - 1, cx - 1, cy - 1]
        [px, py, qx, qy] = [ax * width, ay * height, cx * width, cy * height]
        board.boardCtx.drawImage @, px, py, width, height, qx, qy, width, height

  # Load an image.
  loadImage: (src, onload) ->
    img = new Image
    img.onload = onload
    img.src = src
    img

  # Convert x-y coordinate to array index
  xyToIndex: (opts...) ->
    if opts.length == 1
      {x: x, y: y} = opts
    else
      [x, y] = opts

    (y - 1) * @size + x - 1

  # Convert array index to x-y coordinate
  indexToXY: (i) ->
    pos =
      x: i % @size + 1
      y: (parseInt i / @size, 10) + 1

    pos

  # Convert piece to x-y coordinate
  pieceToXY: (p) ->
    @indexToXY p - 1

  # Shuffle an array
  shuffle: (arr) ->
    arr.sort (a, b) -> Math.random() > 0.5 ? a : b


puzzleBoard = new PuzzleBoard


# Exposed API
root.startGame = puzzleBoard.setup.bind puzzleBoard
root.restartGame = puzzleBoard.setup.bind puzzleBoard
root.move = puzzleBoard.move.bind puzzleBoard
root.hasPiece = puzzleBoard.hasPiece.bind puzzleBoard
root.getPiecePos = puzzleBoard.getPiecePos.bind puzzleBoard
root.isFinish = puzzleBoard.isFinish.bind puzzleBoard
