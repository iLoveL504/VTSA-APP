// saveUtils.js

/**
 * Export spreadsheet data to CSV format
 */
export const exportToExcel = (workbook) => {
  try {
    const worksheet = workbook.getActiveSheet();
    const data = [];
    
    // Get all rows - using a large number since we don't know exact row count
    const maxRows = 100; // Adjust based on your expected maximum rows
    
    for (let row = 0; row < maxRows; row++) {
      const rowData = [];
      let rowHasData = false;
      
      for (let col = 0; col < 13; col++) {
        try {
          const cellValue = worksheet.getRange(row, col).getValue();
          // Handle different value types
          let displayValue = '';
          
          if (cellValue === null || cellValue === undefined) {
            displayValue = '';
          } else if (typeof cellValue === 'object' && cellValue !== null) {
            // Handle formula results or complex objects
            displayValue = cellValue.v || cellValue.toString();
          } else if (typeof cellValue === 'number') {
            displayValue = cellValue.toString();
          } else {
            displayValue = String(cellValue);
          }
          
          rowData.push(displayValue);
          if (displayValue && displayValue.trim() !== '') {
            rowHasData = true;
          }
        } catch (error) {
          console.log(error)
          rowData.push('');
        }
      }
      
      // Only add row if it has data or is within our expected range
      if (rowHasData || row < 50) { // Adjust based on your data size
        data.push(rowData);
      }
    }
    
    // Convert to CSV format
    const csvContent = data.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains commas, quotes, or newlines
        const escapedCell = String(cell).replace(/"/g, '""');
        if (escapedCell.includes(',') || escapedCell.includes('"') || escapedCell.includes('\n')) {
          return `"${escapedCell}"`;
        }
        return escapedCell;
      }).join(',')
    ).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `accomplishment-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    console.log('Export successful!');
    return true;
    
  } catch (error) {
    console.error('Export failed:', error);
    alert('Error exporting file. Please try again.');
    return false;
  }
};

/**
 * Save to Local Storage - FIXED with proper Univer.js API
 */
export const saveToLocalStorage = (workbook) => {
  try {
    const worksheet = workbook.getActiveSheet();
    const data = {};
    
    // Save data for rows 1-50 (adjust based on your data size)
    for (let row = 1; row <= 50; row++) {
      // Check if row has data by looking at the description column (column 1)
      let hasData = false;
      try {
        const description = worksheet.getRange(row, 1).getValue();
        hasData = description && description.toString().trim() !== '';
      } catch (error) {
        console.log(error)
        hasData = false;
      }
      
      if (!hasData) continue;
      
      const rowData = {};
      const editableColumns = [4, 6, 8, 10, 11]; // Contract Amount, % ACC Previous, etc.
      
      editableColumns.forEach(col => {
        try {
          const cellValue = worksheet.getRange(row, col).getValue();
          rowData[col] = cellValue !== null && cellValue !== undefined ? cellValue : '';
        } catch (error) {
          console.log(error)
          rowData[col] = '';
        }
      });
      
      // Only save if there's actual data in editable columns
      const hasEditableData = Object.values(rowData).some(value => 
        value !== null && value !== undefined && value !== '' && value !== 0
      );
      
      if (hasEditableData) {
        data[row] = rowData;
      }
    }
    
    localStorage.setItem('univer_spreadsheet_data', JSON.stringify(data));
    console.log('Saved to local storage:', data);
    return true;
    
  } catch (error) {
    console.error('Save to local storage failed:', error);
    return false;
  }
};

/**
 * Load from Local Storage - FIXED with proper Univer.js API
 */
export const loadFromLocalStorage = (worksheet) => {
  try {
    const savedData = localStorage.getItem('univer_spreadsheet_data');
    if (!savedData) {
      console.log('No saved data found in local storage');
      return false;
    }
    
    const data = JSON.parse(savedData);
    console.log('Loading saved data:', data);
    
    let loadedCount = 0;
    Object.keys(data).forEach(rowKey => {
      const row = parseInt(rowKey);
      const rowData = data[row];
      
      Object.keys(rowData).forEach(colKey => {
        const col = parseInt(colKey);
        const value = rowData[col];
        
        try {
          if (value !== null && value !== undefined && value !== '') {
            worksheet.getRange(row, col).setValue(value);
            loadedCount++;
          }
        } catch (error) {
          console.warn(`Could not set value at row ${row}, col ${col}:`, error);
        }
      });
    });
    
    console.log(`Data loaded successfully from local storage: ${loadedCount} cells updated`);
    return true;
    
  } catch (error) {
    console.error('Load from local storage failed:', error);
    return false;
  }
};

/**
 * Save to JSON - FIXED with proper Univer.js API
 */
export const saveToJSON = (workbook) => {
  try {
    const worksheet = workbook.getActiveSheet();
    const data = {
      metadata: {
        savedAt: new Date().toISOString(),
        version: '1.0'
      },
      tasks: []
    };
    
    // Process rows 1-50 (adjust based on your data size)
    for (let row = 1; row <= 50; row++) {
      try {
        const description = worksheet.getRange(row, 1).getValue();
        // Skip if no description or if description is empty
        if (!description || description.toString().trim() === '') continue;
        
        const taskData = {
          rowIndex: row,
          itemNo: getCellValueSafe(worksheet, row, 0),
          description: description,
          contractAmount: getCellValueSafe(worksheet, row, 4),
          prctgAccPrev: getCellValueSafe(worksheet, row, 6),
          prctgAccPresent: getCellValueSafe(worksheet, row, 8),
          prctgAccToDate: getCellValueSafe(worksheet, row, 10),
          prctgWTAccToDate: getCellValueSafe(worksheet, row, 11)
        };
        
        data.tasks.push(taskData);
      } catch (error) {
        console.warn(`Error processing row ${row}:`, error);
        continue;
      }
    }
    
    // Download JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `accomplishment-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
    
    console.log('JSON export successful!');
    return true;
    
  } catch (error) {
    console.error('JSON export failed:', error);
    alert('Error exporting JSON file. Please try again.');
    return false;
  }
};

/**
 * Helper function to safely get cell values
 */
function getCellValueSafe(worksheet, row, col) {
  try {
    const value = worksheet.getRange(row, col).getValue();
    return value !== null && value !== undefined ? value : '';
  } catch (error) {
    console.log(error)
    return '';
  }
}

/**
 * Alternative: Get actual row count by checking until we find empty rows
 */
export const getWorksheetData = (worksheet, maxRows = 100) => {
  const data = [];
  
  for (let row = 0; row < maxRows; row++) {
    const rowData = [];
    let rowHasData = false;
    
    for (let col = 0; col < 13; col++) {
      try {
        const value = worksheet.getRange(row, col).getValue();
        const displayValue = value !== null && value !== undefined ? String(value) : '';
        rowData.push(displayValue);
        
        if (displayValue.trim() !== '') {
          rowHasData = true;
        }
      } catch (error) {
        console.log(error)
        rowData.push('');
      }
    }
    
    if (rowHasData || row < 10) { // Always include first 10 rows
      data.push(rowData);
    } else if (row > 10 && !rowHasData) {
      // Stop if we find several empty rows in a row
      break;
    }
  }
  
  return data;
};