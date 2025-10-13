import React, { useState } from 'react';
import './Spreadsheet.css';

const Spreadsheet = ({ rows = 10, cols = 5 }) => {
  // Initialize empty spreadsheet data
  const initializeData = () => {
    const data = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push({ value: '', formula: '' });
      }
      data.push(row);
    }
    return data;
  };

  const [data, setData] = useState(initializeData);
  const [selectedCell, setSelectedCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // Cell selection handler
  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
    setEditingCell(null);
  };

  // Double click to edit
  const handleCellDoubleClick = (row, col) => {
    setSelectedCell({ row, col });
    setEditingCell({ row, col });
    setInputValue(data[row][col].value);
  };

  // Input change handler
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Save cell value
  const handleInputBlur = () => {
    if (editingCell && inputValue !== undefined) {
      const newData = [...data];
      newData[editingCell.row][editingCell.col] = {
        value: inputValue,
        formula: inputValue.startsWith('=') ? inputValue : ''
      };
      setData(newData);
    }
    setEditingCell(null);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        handleCellDoubleClick(row, col);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (row > 0) setSelectedCell({ row: row - 1, col });
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (row < rows - 1) setSelectedCell({ row: row + 1, col });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (col > 0) setSelectedCell({ row, col: col - 1 });
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (col < cols - 1) setSelectedCell({ row, col: col + 1 });
        break;
      default:
        break;
    }
  };

  return (
    <div className="spreadsheet-container" tabIndex={0} onKeyDown={handleKeyDown}>
      <table className="spreadsheet">
        <thead>
          <tr>
            <th className="corner-cell"></th>
            {Array.from({ length: cols }, (_, i) => (
              <th key={i} className="column-header">
                {String.fromCharCode(65 + i)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="row-header">{rowIndex + 1}</td>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={`cell ${
                    selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                >
                  {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      autoFocus
                      className="cell-input"
                    />
                  ) : (
                    cell.value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;