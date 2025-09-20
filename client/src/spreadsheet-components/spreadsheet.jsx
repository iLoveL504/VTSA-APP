import React, { useEffect, useRef } from 'react';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import sheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US';
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets';
import projectTasks from './excelData';
import { setupTotalCalculation, initializeTotalCell } from './contractAmount';
import { setupM42Monitoring } from './retrieveVal';

//ilagay lang sa App.jsx <UniverSpreadsheet/>
export const UniverSpreadsheet = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    //Initialize Univer spreadsheet
    const { univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      locales: { [LocaleType.EN_US]: mergeLocales(sheetsCoreEnUS) },
      presets: [UniverSheetsCorePreset({ container: containerRef.current })],
    });

    const workbook = univerAPI.createWorkbook({
      id: 'simple-workbook',
      name: 'Accomplishment Report'
    });

    const worksheet = workbook.getActiveSheet();
    
    //Set headers
    const headers = ['Item No.', 'Description', 'QTY', 'UNIT', 'Contract Amount', '% WT', '% ACC [PREVIOUS]', 'Amount [PREVIOUS]', '% ACC [PRESENT]', 'Amount [PRESENT]', '% ACC [TO-DATE]', '% WT. ACC [TO-DATE]', 'Amount [TO-DATE]'];
    headers.forEach((header, colIndex) => {
      worksheet.getRange(0, colIndex).setValue(header);
    });

    //Load project task data
    projectTasks.forEach((row, rowIndex) => {
      const dataRow = rowIndex + 1;
      
      worksheet.getRange(dataRow, 0).setValue(row.itemNo || '');
      worksheet.getRange(dataRow, 1).setValue(row.description || '');
      worksheet.getRange(dataRow, 2).setValue(row.qty ?? '');
      worksheet.getRange(dataRow, 3).setValue(row.unit || '');
      worksheet.getRange(dataRow, 5).setValue(row.prctgWT ?? ''); // % WT
      worksheet.getRange(dataRow, 6).setValue(row.prctgAccPrev ?? '');
      worksheet.getRange(dataRow, 8).setValue(row.prctgAccPresent ?? '');
      worksheet.getRange(dataRow, 10).setValue(row.prctgAccToDate ?? '');
      worksheet.getRange(dataRow, 11).setValue(row.prctgWTAccToDate ?? '');
    });

    //Initialize and setup calculations
    initializeTotalCell(worksheet, 0);
    setupTotalCalculation(worksheet, projectTasks);

    //Add total row with sum formulas
    const totalRow = projectTasks.length + 1;
    worksheet.getRange(totalRow, 5).setFormula('=TEXT(SUM(E2:E' + (totalRow - 1) + '), "#,##0.00")');
    worksheet.getRange(totalRow, 5).setFormula("=SUM(F2:F41)");
    worksheet.getRange(totalRow, 7).setFormula("=SUM(H2:H41)");
    worksheet.getRange(totalRow, 9).setFormula("=SUM(J2:J41)");
    worksheet.getRange(totalRow, 11).setFormula("=SUM(L2:L41)");
    worksheet.getRange(totalRow, 12).setFormula("=SUM(M2:M41)");

    //Set column widths
    const columnWidths = [80, 250, 80, 80, 150, 100, 100, 120, 100, 120, 120, 100, 150];
    columnWidths.forEach((width, index) => {
      worksheet.setColumnWidth(index, width);
    });

    //Setup value monitoring
    setupM42Monitoring(worksheet);

    return () => {
      univerAPI.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        height: '95vh', 
        width: '100%',
        border: '1px solid #ddd'
      }} 
    />
  );
};

export default UniverSpreadsheet;