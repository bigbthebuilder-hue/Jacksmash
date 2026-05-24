import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { RotateCcw, Trophy, Sparkles, Flame } from "lucide-react";
import "./style.css";

const BOARD_SIZE = 8;
const COLORS = ["c-yellow", "c-pink", "c-blue", "c-green", "c-purple", "c-orange", "c-teal"];
const VISUALS = ["gloss", "gem", "stripe", "pulse", "spark", "chunky"];
const BONUS_LIMITS = { hammer: 2, bomb: 1, blaster: 1, shuffle: 1 };

const SHAPES = [
  { id: "line3h", name: "3 Line", group: "line", cells: [[0, 0], [1, 0], [2, 0]] },
  { id: "line3v", name: "3 Tall", group: "line", cells: [[0, 0], [0, 1], [0, 2]] },
  { id: "line4h", name: "4 Line", group: "line", cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },
  { id: "line4v", name: "4 Tall", group: "line", cells: [[0, 0], [0, 1], [0, 2], [0, 3]] },
  { id: "line5h", name: "5 Line", group: "line", cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] },
  { id: "line5v", name: "5 Tall", group: "line", cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
  { id: "sq2", name: "2 Box", group: "square", cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { id: "sq3", name: "3 Box", group: "square", cells: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]] },

  { id: "l3a", name: "Small L", group: "corner", cells: [[0, 0], [0, 1], [1, 1]] },
  { id: "l3b", name: "Small L", group: "corner", cells: [[1, 0], [0, 1], [1, 1]] },
  { id: "l3c", name: "Small L", group: "corner", cells: [[0, 0], [1, 0], [0, 1]] },
  { id: "l3d", name: "Small L", group: "corner", cells: [[0, 0], [1, 0], [1, 1]] },

  { id: "l4a", name: "Medium L", group: "corner", cells: [[0, 0], [0, 1], [0, 2], [1, 2]] },
  { id: "l4b", name: "Medium L", group: "corner", cells: [[1, 0], [1, 1], [1, 2], [0, 2]] },
  { id: "l4c", name: "Medium L", group: "corner", cells: [[0, 0], [1, 0], [2, 0], [0, 1]] },
  { id: "l4d", name: "Medium L", group: "corner", cells: [[0, 0], [1, 0], [2, 0], [2, 1]] },

  { id: "l5a", name: "Big L", group: "corner", cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] },
  { id: "l5b", name: "Big L", group: "corner", cells: [[2, 0], [2, 1], [0, 2], [1, 2], [2, 2]] },
  { id: "l5c", name: "Big L", group: "corner", cells: [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2]] },
  { id: "l5d", name: "Big L", group: "corner", cells: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]] },

  { id: "t4a", name: "T", group: "special", cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  { id: "t4b", name: "T", group: "special", cells: [[1, 0], [0, 1], [1, 1], [1, 2]] },
  { id: "t4c", name: "T", group: "special", cells: [[1, 0], [0, 1], [1, 1], [2, 1]] },
  { id: "t4d", name: "T", group: "special", cells: [[0, 0], [0, 1], [1, 1], [0, 2]] },
  { id: "z4a", name: "Zig", group: "special", cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { id: "z4b", name: "Zig", group: "special", cells: [[1, 0], [0, 1], [1, 1], [0, 2]] },
  { id: "bar3x2", name: "Brick", group: "chunk", cells: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]] },
  { id: "bar2x3", name: "Brick", group: "chunk", cells: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]] },
];

const LINE_SHAPES = SHAPES.filter((shape) =>
  ["line3h", "line3v", "line4h", "line4v", "line5h", "line5v"].includes(shape.id)
);

const BIG_SQUARE_SHAPES = SHAPES.filter((shape) =>
  ["sq3"].includes(shape.id)
);

const SQUARE_BRICK_SHAPES = SHAPES.filter((shape) =>
  ["sq2", "sq3", "bar3x2", "bar2x3"].includes(shape.id)
);

const SMALL_L_SHAPES = SHAPES.filter((shape) =>
  ["l3a", "l3b", "l3c", "l3d"].includes(shape.id)
);

const MEDIUM_L_SHAPES = SHAPES.filter((shape) =>
  ["l4a", "l4b", "l4c", "l4d"].includes(shape.id)
);

const BIG_L_SHAPES = SHAPES.filter((shape) =>
  ["l5a", "l5b", "l5c", "l5d"].includes(shape.id)
);

const SPECIAL_SHAPES = SHAPES.filter((shape) =>
  ["t4a", "t4b", "t4c", "t4d", "z4a", "z4b"].includes(shape.id)
);

const EASY_SHAPES = SHAPES.filter((shape) =>
  ["line3h", "line3v", "line4h", "line4v", "sq2", "bar3x2", "bar2x3", "l4a", "l4b", "l4c", "l4d"].includes(shape.id)
);

const MEDIUM_SHAPES = SHAPES.filter((shape) =>
  ["line3h", "line3v", "line4h", "line4v", "line5h", "line5v", "sq2", "sq3", "t4a", "t4b", "t4c", "t4d", "z4a", "z4b", "bar3x2", "bar2x3", "l4a", "l4b", "l4c", "l4d"].includes(shape.id)
);

const CLEARING_SHAPES = SHAPES.filter((shape) =>
  ["line4h", "line4v", "line5h", "line5v", "sq2", "sq3", "l5a", "l5b", "l5c", "l5d", "bar3x2", "bar2x3"].includes(shape.id)
);

const HARD_SHAPES = SHAPES.filter((shape) =>
  ["line5h", "line5v", "sq3", "l5a", "l5b", "l5c", "l5d", "bar3x2", "bar2x3"].includes(shape.id)
);

function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function emptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

function getPieceBounds(cells) {
  const maxX = Math.max(...cells.map(([x]) => x));
  const maxY = Math.max(...cells.map(([, y]) => y));
  return { width: maxX + 1, height: maxY + 1 };
}

function makePieceFromShape(shape, index = 0) {
  const color = COLORS[(Math.floor(Math.random() * COLORS.length) + index) % COLORS.length];
  const visual = VISUALS[Math.floor(Math.random() * VISUALS.length)];
  return {
    uid: `${shape.id}-${Date.now()}-${Math.random()}`,
    ...shape,
    color,
    visual,
    tileClass: `${color} v-${visual}`,
  };
}

function randomPiece(index = 0, pool = SHAPES) {
  return makePieceFromShape(randomChoice(pool), index);
}

function randomWeightedPiece(index = 0, weightedPools) {
  const total = weightedPools.reduce((sum, item) => sum + item.weight, 0);
  let pick = Math.random() * total;

  for (const item of weightedPools) {
    pick -= item.weight;
    if (pick <= 0) {
      return makePieceFromShape(randomChoice(item.pool), index);
    }
  }

  return makePieceFromShape(randomChoice(weightedPools[0].pool), index);
}

function countEmptyCells(board) {
  return board.flat().filter((cell) => !cell).length;
}

function getPiecePoolForBoard(board) {
  const empty = countEmptyCells(board);

  // Open board: boost 3x3 squares strongly and add the new medium L pieces.
  if (empty >= 48) {
    return {
      first: [
        { pool: BIG_SQUARE_SHAPES, weight: 4 },
        { pool: LINE_SHAPES, weight: 3 },
        { pool: SQUARE_BRICK_SHAPES, weight: 3 },
        { pool: MEDIUM_L_SHAPES, weight: 2 },
        { pool: SPECIAL_SHAPES, weight: 1 },
        { pool: SMALL_L_SHAPES, weight: 1 },
      ],
      second: [
        { pool: BIG_SQUARE_SHAPES, weight: 4 },
        { pool: CLEARING_SHAPES, weight: 4 },
        { pool: LINE_SHAPES, weight: 3 },
        { pool: MEDIUM_L_SHAPES, weight: 2 },
        { pool: SPECIAL_SHAPES, weight: 1 },
        { pool: SMALL_L_SHAPES, weight: 1 },
      ],
      third: [
        { pool: BIG_SQUARE_SHAPES, weight: 4 },
        { pool: HARD_SHAPES, weight: 4 },
        { pool: CLEARING_SHAPES, weight: 3 },
        { pool: BIG_L_SHAPES, weight: 1 },
        { pool: MEDIUM_L_SHAPES, weight: 1 },
      ],
    };
  }

  if (empty >= 30) {
    return {
      first: [
        { pool: EASY_SHAPES, weight: 5 },
        { pool: MEDIUM_L_SHAPES, weight: 2 },
        { pool: SPECIAL_SHAPES, weight: 2 },
        { pool: SMALL_L_SHAPES, weight: 1 },
      ],
      second: [
        { pool: MEDIUM_SHAPES, weight: 4 },
        { pool: LINE_SHAPES, weight: 3 },
        { pool: SQUARE_BRICK_SHAPES, weight: 2 },
        { pool: MEDIUM_L_SHAPES, weight: 2 },
        { pool: SMALL_L_SHAPES, weight: 1 },
      ],
      third: [
        { pool: CLEARING_SHAPES, weight: 4 },
        { pool: MEDIUM_SHAPES, weight: 2 },
        { pool: MEDIUM_L_SHAPES, weight: 1 },
        { pool: BIG_L_SHAPES, weight: 1 },
      ],
    };
  }

  return {
    first: [
      { pool: EASY_SHAPES, weight: 5 },
      { pool: MEDIUM_L_SHAPES, weight: 2 },
      { pool: SMALL_L_SHAPES, weight: 1 },
    ],
    second: [
      { pool: EASY_SHAPES, weight: 4 },
      { pool: MEDIUM_SHAPES, weight: 2 },
      { pool: MEDIUM_L_SHAPES, weight: 2 },
      { pool: SMALL_L_SHAPES, weight: 1 },
    ],
    third: [
      { pool: MEDIUM_SHAPES, weight: 4 },
      { pool: LINE_SHAPES, weight: 2 },
      { pool: MEDIUM_L_SHAPES, weight: 2 },
      { pool: SMALL_L_SHAPES, weight: 1 },
    ],
  };
}

function canPlace(board, piece, row, col) {
  if (!piece) return false;
  return piece.cells.every(([x, y]) => {
    const r = row + y;
    const c = col + x;
    return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && !board[r][c];
  });
}

function getAllPlacements(board, piece) {
  const placements = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (canPlace(board, piece, row, col)) placements.push({ row, col });
    }
  }
  return placements;
}

function placePiece(board, piece, row, col) {
  const next = board.map((r) => [...r]);
  piece.cells.forEach(([x, y]) => {
    next[row + y][col + x] = piece.tileClass;
  });
  return next;
}

function getFullLines(board) {
  const rows = [];
  const cols = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (board[r].every(Boolean)) rows.push(r);
  }

  for (let c = 0; c < BOARD_SIZE; c++) {
    let full = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (!board[r][c]) {
        full = false;
        break;
      }
    }
    if (full) cols.push(c);
  }

  return { rows, cols };
}

function clearLines(board) {
  const fullLines = getFullLines(board);
  if (!fullLines.rows.length && !fullLines.cols.length) {
    return { board, cleared: 0, rows: [], cols: [] };
  }

  const next = board.map((r) => [...r]);
  fullLines.rows.forEach((r) => {
    for (let c = 0; c < BOARD_SIZE; c++) next[r][c] = null;
  });
  fullLines.cols.forEach((c) => {
    for (let r = 0; r < BOARD_SIZE; r++) next[r][c] = null;
  });

  return {
    board: next,
    cleared: fullLines.rows.length + fullLines.cols.length,
    rows: fullLines.rows,
    cols: fullLines.cols,
  };
}

function simulatePlacement(board, piece, row, col) {
  return clearLines(placePiece(board, piece, row, col));
}

function isSolvableSet(board, pieces) {
  const available = pieces.filter(Boolean);
  if (!available.length) return true;

  for (let i = 0; i < available.length; i++) {
    const piece = available[i];
    const placements = getAllPlacements(board, piece);
    for (const placement of placements) {
      const result = simulatePlacement(board, piece, placement.row, placement.col);
      const remaining = available.filter((_, idx) => idx !== i);
      if (isSolvableSet(result.board, remaining)) return true;
    }
  }

  return false;
}

function generateFairPieces(board) {
  const pools = getPiecePoolForBoard(board);

  for (let attempt = 0; attempt < 2000; attempt++) {
    const pieces = [
      randomWeightedPiece(0, pools.first),
      randomWeightedPiece(1, pools.second),
      randomWeightedPiece(2, pools.third),
    ];

    const groups = new Set(pieces.map((piece) => piece.group));
    const smallLCount = pieces.filter((piece) => piece.id.startsWith("l3")).length;

    if (groups.size < 2) continue;
    if (smallLCount > 1) continue;

    if (isSolvableSet(board, pieces)) return pieces;
  }

  for (let attempt = 0; attempt < 800; attempt++) {
    const pieces = [
      randomPiece(0, EASY_SHAPES),
      randomPiece(1, EASY_SHAPES.concat(MEDIUM_SHAPES)),
      randomPiece(2, MEDIUM_SHAPES),
    ];
    const smallLCount = pieces.filter((piece) => piece.id.startsWith("l3")).length;
    if (smallLCount > 1) continue;
    if (isSolvableSet(board, pieces)) return pieces;
  }

  return [
    makePieceFromShape(SHAPES.find((s) => s.id === "line3h"), 0),
    makePieceFromShape(SHAPES.find((s) => s.id === "line3v"), 1),
    makePieceFromShape(SHAPES.find((s) => s.id === "sq2"), 2),
  ];
}

function scoreMove(piece, cleared, currentCombo) {
  const placePoints = piece.cells.length * 5;
  const linePoints = cleared === 0 ? 0 : 50 * cleared + 25 * Math.max(0, cleared - 1) * cleared;
  const nextCombo = cleared > 0 ? currentCombo + 1 : 0;
  const comboPoints = cleared > 0 ? nextCombo * 25 : 0;
  return { gained: placePoints + linePoints + comboPoints, nextCombo };
}

function getRawBoardCellFromPointer(boardRef, clientX, clientY) {
  const boardEl = boardRef.current;
  if (!boardEl) return null;

  const rect = boardEl.getBoundingClientRect();
  const cellWidth = rect.width / BOARD_SIZE;
  const cellHeight = rect.height / BOARD_SIZE;

  const col = Math.floor((clientX - rect.left) / cellWidth);
  const row = Math.floor((clientY - rect.top) / cellHeight);

  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return null;
  return { row, col };
}

function getAnchoredBoardPosition(boardRef, piece, clientX, clientY) {
  const rawCell = getRawBoardCellFromPointer(boardRef, clientX, clientY);
  if (!rawCell || !piece) return null;

  const bounds = getPieceBounds(piece.cells);
  return {
    row: rawCell.row - bounds.height + 1,
    col: rawCell.col - bounds.width + 1,
  };
}

function clearSingleCell(board, row, col) {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return board;
  const next = board.map((r) => [...r]);
  next[row][col] = null;
  return next;
}

function clearBombArea(board, row, col) {
  const next = board.map((r) => [...r]);
  const cells = [];
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        next[r][c] = null;
        cells.push(`${r}-${c}`);
      }
    }
  }
  return { board: next, cells };
}

function clearLine(board, index, orientation) {
  const next = board.map((r) => [...r]);
  const cells = [];
  if (orientation === "row") {
    for (let c = 0; c < BOARD_SIZE; c++) {
      next[index][c] = null;
      cells.push(`${index}-${c}`);
    }
  } else {
    for (let r = 0; r < BOARD_SIZE; r++) {
      next[r][index] = null;
      cells.push(`${r}-${index}`);
    }
  }
  return { board: next, cells };
}

function hasAnyMove(board, pieces) {
  return pieces.filter(Boolean).some((piece) => getAllPlacements(board, piece).length > 0);
}

function hasAnyBonus(bonuses) {
  return Object.values(bonuses).some((count) => count > 0);
}

function getLineEffectStyle(effect) {
  if (!effect || !effect.rect) return {};
  const { rect, index, orientation } = effect;
  const cell = rect.width / BOARD_SIZE;
  if (orientation === "row") {
    return {
      left: `${rect.left}px`,
      top: `${rect.top + cell * index + cell * 0.18}px`,
      width: `${rect.width}px`,
      height: `${cell * 0.64}px`,
    };
  }
  return {
    left: `${rect.left + cell * index + cell * 0.18}px`,
    top: `${rect.top}px`,
    width: `${cell * 0.64}px`,
    height: `${rect.height}px`,
  };
}

function PieceShape({ piece, scale = "normal" }) {
  if (!piece) return null;
  const bounds = getPieceBounds(piece.cells);

  return (
    <div
      className={`piece-grid ${scale === "drag" ? "drag-piece-grid" : ""}`}
      style={{
        gridTemplateColumns: `repeat(${bounds.width}, 1fr)`,
        gridTemplateRows: `repeat(${bounds.height}, 1fr)`,
      }}
    >
      {Array.from({ length: bounds.width * bounds.height }).map((_, idx) => {
        const x = idx % bounds.width;
        const y = Math.floor(idx / bounds.width);
        const filled = piece.cells.some(([cx, cy]) => cx === x && cy === y);
        return <div key={idx} className={`mini-cell ${filled ? piece.tileClass : "cell-clear"}`} />;
      })}
    </div>
  );
}

function PiecePreview({ piece, selected, onPointerDown, disabled, shake }) {
  if (!piece) return <div className="piece empty-piece" />;

  return (
    <button
      onPointerDown={onPointerDown}
      disabled={disabled}
      className={`piece ${selected ? "piece-selected" : ""} ${disabled ? "piece-disabled" : ""} ${shake ? "shake" : ""}`}
      aria-label={piece.name}
    >
      <PieceShape piece={piece} />
    </button>
  );
}

function BonusButton({ emoji, label, count, active, onClick, max, detail }) {
  const ready = count > 0;
  return (
    <button className={`bonus-btn ${active ? "bonus-active" : ""} ${ready ? "bonus-ready" : "bonus-empty"}`} onClick={onClick}>
      <span className="bonus-emoji" aria-hidden="true">{emoji}</span>
      <span className="bonus-meta">
        <b>{label}</b>
        <small>{detail}</small>
      </span>
      <span className="bonus-count">{count}/{max}</span>
    </button>
  );
}

function App() {
  const boardRef = useRef(null);

  const [board, setBoard] = useState(emptyBoard);
  const [pieces, setPieces] = useState(() => generateFairPieces(emptyBoard()));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("jacksmashBest") || 0));
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState("Drag a block. Medium L added. Open boards get more 3×3 squares.");
  const [gameOver, setGameOver] = useState(false);

  const [bonuses, setBonuses] = useState({ hammer: 0, bomb: 0, blaster: 0, shuffle: 0 });
  const [activeBonus, setActiveBonus] = useState(null);
  const [blasterMode, setBlasterMode] = useState("row");

  const [drag, setDrag] = useState(null);
  const [preview, setPreview] = useState(null);
  const [placedFlash, setPlacedFlash] = useState([]);
  const [clearFlash, setClearFlash] = useState({ rows: [], cols: [] });
  const [effectCells, setEffectCells] = useState([]);
  const [burstLevel, setBurstLevel] = useState(null);
  const [screenEffect, setScreenEffect] = useState(null);
  const [earnedBonus, setEarnedBonus] = useState(null);
  const [lineEffect, setLineEffect] = useState(null);
  const [shakeIndex, setShakeIndex] = useState(null);
  const [scorePop, setScorePop] = useState(null);

  const occupiedCount = useMemo(() => board.flat().filter(Boolean).length, [board]);

  const bonusDisplay = {
    hammer: { emoji: "🔨", label: "Hammer Earned!" },
    bomb: { emoji: "💣", label: "Bomb Earned!" },
    blaster: { emoji: "⚡", label: "Blaster Earned!" },
    shuffle: { emoji: "🔀", label: "Shuffle Earned!" },
  };

  useEffect(() => {
    localStorage.setItem("jacksmashBest", String(best));
  }, [best]);

  useEffect(() => {
    if (!drag || activeBonus) return;

    function buildPreview(clientX, clientY) {
      const boardPos = getAnchoredBoardPosition(boardRef, drag.piece, clientX, clientY);
      if (!boardPos) return null;

      const isValid = canPlace(board, drag.piece, boardPos.row, boardPos.col);
      if (!isValid) return null;

      const simulated = placePiece(board, drag.piece, boardPos.row, boardPos.col);
      const fullLines = getFullLines(simulated);

      return {
        row: boardPos.row,
        col: boardPos.col,
        valid: true,
        rowsToClear: fullLines.rows,
        colsToClear: fullLines.cols,
        cells: drag.piece.cells.map(([x, y]) => [boardPos.col + x, boardPos.row + y]),
      };
    }

    function handlePointerMove(event) {
      event.preventDefault();
      setDrag((current) => current ? { ...current, x: event.clientX, y: event.clientY } : current);
      setPreview(buildPreview(event.clientX, event.clientY));
    }

    function handlePointerUp(event) {
      event.preventDefault();
      const currentDrag = drag;
      const boardPos = getAnchoredBoardPosition(boardRef, currentDrag.piece, event.clientX, event.clientY);

      setDrag(null);
      setPreview(null);

      if (!boardPos || !currentDrag || !canPlace(board, currentDrag.piece, boardPos.row, boardPos.col)) {
        setMessage("No fit there.");
        setShakeIndex(currentDrag?.pieceIndex ?? null);
        setTimeout(() => setShakeIndex(null), 420);
        return;
      }

      placeSelectedPiece(currentDrag.pieceIndex, currentDrag.piece, boardPos.row, boardPos.col);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp, { passive: false });
    window.addEventListener("pointercancel", handlePointerUp, { passive: false });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [drag, board, combo, activeBonus]);

  function restart() {
    const freshBoard = emptyBoard();
    setBoard(freshBoard);
    setPieces(generateFairPieces(freshBoard));
    setSelectedIndex(0);
    setScore(0);
    setBest((value) => value);
    setCombo(0);
    setMessage("Fresh run. Bigger pieces, bigger clears.");
    setGameOver(false);
    setBonuses({ hammer: 0, bomb: 0, blaster: 0, shuffle: 0 });
    setActiveBonus(null);
    setBlasterMode("row");
    setDrag(null);
    setPreview(null);
    setPlacedFlash([]);
    setClearFlash({ rows: [], cols: [] });
    setEffectCells([]);
    setBurstLevel(null);
    setScreenEffect(null);
    setLineEffect(null);
    setScorePop(null);
    setShakeIndex(null);
    setEarnedBonus(null);
  }

  function awardBonus(type, reasonText) {
    setBonuses((current) => {
      const nextValue = Math.min(BONUS_LIMITS[type], current[type] + 1);

      if (nextValue !== current[type]) {
        const display = bonusDisplay[type];
        setMessage(reasonText);
        setEarnedBonus({ type, emoji: display.emoji, label: display.label, id: Date.now() });
        setScreenEffect({ type: "earned", label: display.label.toUpperCase(), density: 18 });
        setTimeout(() => setEarnedBonus(null), 1250);
        setTimeout(() => setScreenEffect(null), 900);
      }

      return { ...current, [type]: nextValue };
    });
  }

  function checkForNoMoves(nextBoard, nextPieces) {
    if (hasAnyMove(nextBoard, nextPieces)) {
      setGameOver(false);
      return;
    }
    if (hasAnyBonus(bonuses)) {
      setMessage("No piece fits. Use a bonus to break through.");
      setGameOver(false);
      return;
    }
    setGameOver(true);
    setMessage("Game over. No piece fits and no bonuses remain.");
  }

  function triggerBurst(cleared, comboCount) {
    if (cleared <= 0) return;
    const level = cleared >= 4 || comboCount >= 4 ? "mega" : cleared >= 2 || comboCount >= 2 ? "big" : "small";
    setBurstLevel(level);
    setTimeout(() => setBurstLevel(null), level === "mega" ? 1100 : 850);
  }

  function handleBonusAwards(cleared, previousScore, nextScore, nextCombo) {
    // Rebalanced after play testing:
    // Bonuses are still earned, but not so rarely that they disappear from normal play.
    if (cleared === 2) {
      awardBonus("hammer", "Hammer earned for clearing 2 lines.");
    } else if (cleared === 3) {
      awardBonus("bomb", "Bomb earned for clearing 3 lines.");
    } else if (cleared >= 4) {
      awardBonus("blaster", "Line Blaster earned for a huge clear.");
      awardBonus("bomb", "Bomb earned for a huge clear.");
    }

    if (nextCombo >= 4) {
      awardBonus("hammer", "Hammer earned for a combo streak.");
    }

    const oldStep = Math.floor(previousScore / 1500);
    const newStep = Math.floor(nextScore / 1500);
    if (newStep > oldStep) {
      awardBonus("shuffle", "Shuffle earned for reaching a score milestone.");
    }
  }

  function placeSelectedPiece(pieceIndex, piece, row, col) {
    const placedBoard = placePiece(board, piece, row, col);
    const clearResult = clearLines(placedBoard);
    const scoring = scoreMove(piece, clearResult.cleared, combo);
    const nextScore = score + scoring.gained;

    const placedCells = piece.cells.map(([x, y]) => `${row + y}-${col + x}`);
    setPlacedFlash(placedCells);
    setTimeout(() => setPlacedFlash([]), 420);

    if (clearResult.cleared > 0) {
      setClearFlash({ rows: clearResult.rows, cols: clearResult.cols });
      setTimeout(() => setClearFlash({ rows: [], cols: [] }), 520);
      setScreenEffect({ type: "smash", label: clearResult.cleared >= 4 ? "MEGA SMASH!" : clearResult.cleared >= 2 ? "BIG SMASH!" : "SMASH!", density: clearResult.cleared >= 4 ? 36 : clearResult.cleared >= 2 ? 24 : 14 });
      setTimeout(() => setScreenEffect(null), 900);
    }

    triggerBurst(clearResult.cleared, scoring.nextCombo);

    setScorePop(clearResult.cleared > 0 ? `SMASH +${scoring.gained}` : `+${scoring.gained}`);
    setTimeout(() => setScorePop(null), 700);

    handleBonusAwards(clearResult.cleared, score, nextScore, scoring.nextCombo);

    let nextPieces = [...pieces];
    nextPieces[pieceIndex] = null;

    if (nextPieces.every((p) => !p)) {
      nextPieces = generateFairPieces(clearResult.board);
      setSelectedIndex(0);
      setMessage(
        clearResult.cleared
          ? `SMASH! Cleared ${clearResult.cleared}. Combo ${scoring.nextCombo}. New fair set.`
          : "New fair set."
      );
    } else {
      const nextSelectable = nextPieces.findIndex(Boolean);
      setSelectedIndex(nextSelectable);
      setMessage(
        clearResult.cleared
          ? `SMASH! Cleared ${clearResult.cleared}. Combo ${scoring.nextCombo}.`
          : "Block placed."
      );
    }

    setBoard(clearResult.board);
    setPieces(nextPieces);
    setScore(nextScore);
    setCombo(scoring.nextCombo);
    setBest((b) => Math.max(b, nextScore));

    setTimeout(() => {
      if (hasAnyMove(clearResult.board, nextPieces)) {
        setGameOver(false);
      } else if (hasAnyBonus(bonuses)) {
        setGameOver(false);
        setMessage("No piece fits. Use a bonus to break through.");
      } else {
        setGameOver(true);
        setMessage("Game over. No piece fits and no bonuses remain.");
      }
    }, 60);
  }

  function startDrag(event, pieceIndex) {
    if (gameOver || !pieces[pieceIndex] || activeBonus) return;
    event.preventDefault();

    const piece = pieces[pieceIndex];
    setSelectedIndex(pieceIndex);
    setDrag({ piece, pieceIndex, x: event.clientX, y: event.clientY });
    setMessage("Release when the ghost preview is where you want it.");
  }

  function useShuffle() {
    if (bonuses.shuffle <= 0) return;
    const nextPieces = generateFairPieces(board);
    setPieces(nextPieces);
    setActiveBonus(null);
    setBonuses((current) => ({ ...current, shuffle: current.shuffle - 1 }));
    setScreenEffect({ type: "shuffle", label: "SHUFFLE!", density: 22 });
    setTimeout(() => setScreenEffect(null), 900);
    setMessage("Pieces rerolled.");
    setGameOver(false);
  }

  function handleBonusButton(type) {
    if (type === "shuffle") {
      useShuffle();
      return;
    }

    if (bonuses[type] <= 0) return;

    if (type === "blaster") {
      if (activeBonus === "blaster") {
        setBlasterMode((mode) => (mode === "row" ? "col" : "row"));
        setMessage(`Line Blaster set to ${blasterMode === "row" ? "column" : "row"}. Tap a cell.`);
        return;
      }
      setBlasterMode("row");
      setActiveBonus("blaster");
      setMessage("Line Blaster ready. Tap a cell to clear a row. Tap again to switch row/column.");
      return;
    }

    setActiveBonus((current) => current === type ? null : type);
    const messages = {
      hammer: "Hammer ready. Tap one filled cell to smash it.",
      bomb: "Bomb ready. Tap a cell to detonate a 3×3 area.",
    };
    setMessage(activeBonus === type ? "Bonus cancelled." : messages[type]);
  }

  function consumeBonus(type) {
    setBonuses((current) => ({ ...current, [type]: Math.max(0, current[type] - 1) }));
    setActiveBonus(null);
  }

  function performBoardBonus(row, col) {
    if (!activeBonus || gameOver) return;

    if (activeBonus === "hammer") {
      if (!board[row][col]) {
        setMessage("Pick a filled block to smash.");
        return;
      }
      const nextBoard = clearSingleCell(board, row, col);
      setBoard(nextBoard);
      setEffectCells([`${row}-${col}`]);
      setScreenEffect({ type: "hammer", label: "CRACK!", density: 10 });
      setTimeout(() => setScreenEffect(null), 700);
      setTimeout(() => setEffectCells([]), 500);
      consumeBonus("hammer");
      setMessage("Hammer smashed a block.");
      setGameOver(false);
      return;
    }

    if (activeBonus === "bomb") {
      const result = clearBombArea(board, row, col);
      setBoard(result.board);
      setEffectCells(result.cells);
      setScreenEffect({ type: "bomb", label: "BOOM!", density: 26 });
      setTimeout(() => setScreenEffect(null), 1000);
      setTimeout(() => setEffectCells([]), 650);
      consumeBonus("bomb");
      setMessage("Bomb cleared a 3×3 area.");
      setGameOver(false);
      return;
    }

    if (activeBonus === "blaster") {
      const result = clearLine(board, blasterMode === "row" ? row : col, blasterMode);
      const rect = boardRef.current?.getBoundingClientRect();
      setBoard(result.board);
      setEffectCells(result.cells);
      setLineEffect({ orientation: blasterMode, index: blasterMode === "row" ? row : col, rect });
      setScreenEffect({ type: "blaster", label: blasterMode === "row" ? "ROW BLAST!" : "COLUMN BLAST!", density: 20 });
      setTimeout(() => setLineEffect(null), 700);
      setTimeout(() => setScreenEffect(null), 900);
      setTimeout(() => setEffectCells([]), 700);
      consumeBonus("blaster");
      setMessage(blasterMode === "row" ? "Row vaporized." : "Column vaporized.");
      setGameOver(false);
    }
  }

  function isPreviewCell(r, c) {
    if (!preview) return false;
    return preview.cells.some(([cellCol, cellRow]) => cellRow === r && cellCol === c);
  }

  function isPreviewClearLine(r, c) {
    if (!preview) return false;
    return preview.rowsToClear.includes(r) || preview.colsToClear.includes(c);
  }

  function isClearFlashCell(r, c) {
    return clearFlash.rows.includes(r) || clearFlash.cols.includes(c);
  }

  function isEffectCell(key) {
    return effectCells.includes(key);
  }

  return (
    <main className="app-shell">
      <section className="game-wrap">
        <header className="top-bar">
          <div>
            <div className="title-row">
              <div className="logo-bubble">
                <Sparkles size={22} />
              </div>
              <h1>Jacksmash</h1>
            </div>
            <p>Smash combos. Clear lines. Earn powers.</p>
          </div>

          <button className="reset-btn" onClick={restart}>
            <RotateCcw size={18} />
            Reset
          </button>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <Trophy size={26} />
            <div>
              <span>Score</span>
              <strong>{score}</strong>
            </div>
            {scorePop && <b className="score-pop">{scorePop}</b>}
          </div>
          <div className="stat-card">
            <Flame size={25} />
            <div>
              <span>Combo</span>
              <strong>{combo}</strong>
            </div>
          </div>
        </div>

        <div className="bonus-tray">
          <BonusButton emoji="🔨" label="Hammer" detail="Clear 1 block" count={bonuses.hammer} max={BONUS_LIMITS.hammer} active={activeBonus === "hammer"} onClick={() => handleBonusButton("hammer")} />
          <BonusButton emoji="💣" label="Bomb" detail="Clear 3×3" count={bonuses.bomb} max={BONUS_LIMITS.bomb} active={activeBonus === "bomb"} onClick={() => handleBonusButton("bomb")} />
          <BonusButton emoji="⚡" label={blasterMode === "row" && activeBonus === "blaster" ? "Blaster • Row" : blasterMode === "col" && activeBonus === "blaster" ? "Blaster • Col" : "Blaster"} detail="Clear row/col" count={bonuses.blaster} max={BONUS_LIMITS.blaster} active={activeBonus === "blaster"} onClick={() => handleBonusButton("blaster")} />
          <BonusButton emoji="🔀" label="Shuffle" detail="Reroll pieces" count={bonuses.shuffle} max={BONUS_LIMITS.shuffle} active={false} onClick={() => handleBonusButton("shuffle")} />
        </div>

        <div className={`board-card ${burstLevel ? "board-impact" : ""}`}>
          <div className="board" ref={boardRef}>
            {board.map((rowItems, r) =>
              rowItems.map((cell, c) => {
                const key = `${r}-${c}`;
                const previewCell = isPreviewCell(r, c);
                const previewClear = isPreviewClearLine(r, c);
                const flashCell = placedFlash.includes(key);
                const clearCell = isClearFlashCell(r, c);
                const effectCell = isEffectCell(key);
                return (
                  <button
                    key={key}
                    className={`board-cell ${cell || ""} ${previewCell ? `${drag?.piece.tileClass || ""} preview-valid` : ""} ${previewClear ? "preview-clear-line" : ""} ${flashCell ? "placed-pop" : ""} ${clearCell ? "clear-flash" : ""} ${effectCell ? "effect-cell" : ""} ${activeBonus ? "bonus-targeting" : ""}`}
                    aria-label={`row ${r + 1}, column ${c + 1}`}
                    onPointerDown={(event) => {
                      if (!activeBonus) return;
                      event.preventDefault();
                      performBoardBonus(r, c);
                    }}
                  />
                );
              })
            )}
          </div>
        </div>

        {lineEffect && (
          <div
            className={`line-strike ${lineEffect.orientation === "row" ? "strike-row" : "strike-col"}`}
            style={getLineEffectStyle(lineEffect)}
            aria-hidden="true"
          />
        )}

        {(burstLevel || screenEffect) && (
          <div className={`burst-layer burst-${burstLevel || "small"} effect-${screenEffect?.type || "smash"}`} aria-hidden="true">
            <div className="burst-word">{screenEffect?.label || (burstLevel === "mega" ? "MEGA SMASH!" : burstLevel === "big" ? "BIG SMASH!" : "SMASH!")}</div>
            {Array.from({ length: screenEffect?.density || (burstLevel === "mega" ? 34 : burstLevel === "big" ? 24 : 14) }).map((_, idx) => (
              <i
                key={idx}
                className={`burst-bit bit-${idx % 8}`}
                style={{
                  "--x": `${Math.cos((idx / (screenEffect?.density || 24)) * Math.PI * 2) * ((screenEffect?.type === "bomb") ? 220 : (screenEffect?.type === "blaster") ? 190 : 150)}px`,
                  "--y": `${Math.sin((idx / (screenEffect?.density || 24)) * Math.PI * 2) * ((screenEffect?.type === "bomb") ? 200 : (screenEffect?.type === "blaster") ? 170 : 120)}px`,
                  "--r": `${idx * 31}deg`,
                }}
              />
            ))}
            {screenEffect?.type === "bomb" && <div className="shock-ring" />}
            {screenEffect?.type === "hammer" && <div className="crack-flash" />}
            {screenEffect?.type === "shuffle" && <div className="shuffle-swirl" />}
          </div>
        )}

        {earnedBonus && (
          <div className={`earned-bonus earned-${earnedBonus.type}`} key={earnedBonus.id} aria-hidden="true">
            <div className="earned-orb">{earnedBonus.emoji}</div>
            <div>
              <b>{earnedBonus.label}</b>
              <span>Power added</span>
            </div>
          </div>
        )}

        <div className="message-bar">
          <span>{message}</span>
          <small>Best: {best}</small>
        </div>

        {gameOver && (
          <div className="game-over">
            <strong>No more moves</strong>
            <span>Final score: {score}</span>
            <button onClick={restart}>Play again</button>
          </div>
        )}

        <div className="piece-tray">
          {pieces.map((piece, idx) => (
            <PiecePreview
              key={piece?.uid || idx}
              piece={piece}
              selected={selectedIndex === idx}
              onPointerDown={(event) => startDrag(event, idx)}
              disabled={gameOver || !piece || !!activeBonus}
              shake={shakeIndex === idx}
            />
          ))}
        </div>

        {drag && !activeBonus && (
          <div
            className="drag-float"
            style={{
              transform: `translate3d(${drag.x}px, ${drag.y}px, 0) translate(-100%, -100%)`,
            }}
          >
            <PieceShape piece={drag.piece} scale="drag" />
          </div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
