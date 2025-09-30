function convertLetterToNumber(letter) {
  const charCode = letter.toUpperCase().charCodeAt(0);
  if (charCode >= 65 && charCode <= 90) {
    return charCode - 64;
  }
  return NaN;
}

function convertNumberToUppercaseLetter(num) {
  if (num >= 1 && num <= 26) {
    return String.fromCharCode(64 + num);
  }
  // Handle numbers beyond Z (AA, AB, etc.)
  let result = '';
  while (num > 0) {
    num--; // Adjust for 1-based indexing
    result = String.fromCharCode(65 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
}

// Improved data initialization
function initializeSpreadsheet(rows, columns) {
  const data = [];
  
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      const columnLetter = convertNumberToUppercaseLetter(j + 1);
      const reference = `${columnLetter}${i + 1}`;
      
      row.push({
        reference: reference,
        value: '', // Start with empty value
        formula: '', // Start with no formula
        displayValue: '' // Calculated value for display
      });
    }
    data.push(row);
  }
  
  return data;
}

// Much more efficient find function
function findCell(reference) {
  // Parse reference (e.g., "A1", "B2")
  const match = reference.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  
  const columnLetters = match[1];
  const rowNumber = parseInt(match[2]);
  
  // Convert column letters to index (A=0, B=1, etc.)
  let columnIndex = 0;
  for (let i = 0; i < columnLetters.length; i++) {
    columnIndex = columnIndex * 26 + (columnLetters.charCodeAt(i) - 64);
  }
  columnIndex--; // Convert to 0-based index
  
  const rowIndex = rowNumber - 1; // Convert to 0-based index
  
  // Check bounds
  if (rowIndex >= 0 && rowIndex < data.length && 
      columnIndex >= 0 && columnIndex < data[0].length) {
    return {
      cell: data[rowIndex][columnIndex],
      rowIndex,
      columnIndex
    };
  }
  
  return null;
}

// Improved value setting function
function setCellValue(reference, value, formula = '') {
  const found = findCell(reference);
  if (found) {
    if (formula && formula.startsWith('=')) {
      found.cell.formula = formula;
      found.cell.value = ''; // Clear direct value when using formula
      found.cell.displayValue = evaluateFormula(formula);
    } else {
      found.cell.value = value;
      found.cell.formula = ''; // Clear formula when using direct value
      found.cell.displayValue = value;
    }
    return true;
  }
  return false;
}

// Basic formula evaluation
function evaluateFormula(formula) {
  if (!formula.startsWith('=')) return formula;
  
  const expression = formula.slice(1);
  
  try {
    // Simple math evaluation (be careful with eval in production)
    // Replace cell references with their values
    const evaluated = expression.replace(/([A-Z]+\d+)/g, (match) => {
      const cell = findCell(match);
      return cell ? (cell.cell.displayValue || 0) : 0;
    });
    
    // Basic safe evaluation (you might want a proper parser for production)
    return Function('"use strict"; return (' + evaluated + ')')();
  } catch (error) {
    return '#ERROR';
  }
}

// Initialize the spreadsheet
let rows = 5;
let columns = 5;
let data = initializeSpreadsheet(rows, columns);

// Test the functions
console.log('Initial data structure:');
console.log(data);

// Set some values
setCellValue('A1', 'Hello');
setCellValue('B1', 'World');
setCellValue('C1', '=6+7'); // Formula
setCellValue('A2', 'Test');
setCellValue('B2', '=A1 + " " + B1'); // Reference other cells

console.log('\nAfter setting values:');
console.log(findCell('A1'));
console.log(findCell('B1'));
console.log(findCell('C1'));
console.log(findCell('B2'));

// Function to get display value (formula result or direct value)
function getDisplayValue(reference) {
  const found = findCell(reference);
  return found ? found.cell.displayValue : null;
}

console.log('\nDisplay values:');
console.log('A1:', getDisplayValue('A1'));
console.log('B1:', getDisplayValue('B1'));
console.log('C1:', getDisplayValue('C1'));
console.log('B2:', getDisplayValue('B2'));