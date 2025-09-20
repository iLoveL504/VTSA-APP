export function setupTotalCalculation(worksheet, projectTasks) {
    let currentRow = 1;
    
    projectTasks.forEach((task) => {
        if (task.qty === null || task.qty === undefined || task.qty === '') {
            currentRow++;
            return;
        }
        
        if (task.prctgWT !== undefined) {
            worksheet.getRange(currentRow, 4).setFormula(`=$E$42 * ${task.prctgWT} / 100`);
        }
        
        worksheet.getRange(currentRow, 9).setFormula(`=IF(I${currentRow + 1}=100, $E$42 * ${task.prctgWT} / 100, "")`);
        worksheet.getRange(currentRow, 10).setFormula(`=I${currentRow + 1}`);
        worksheet.getRange(currentRow, 11).setFormula(`=IF(I${currentRow + 1}=100, ${task.prctgWT || 0}, "")`);
        worksheet.getRange(currentRow, 12).setFormula(`=$E$42 * ${task.prctgWT || 0} / 100`);
        worksheet.getRange(currentRow, 12).setFormula(`=IF(I${currentRow + 1}=100, $E$42 * ${task.prctgWT || 0} / 100, "")`)

        currentRow++;
    });

    return currentRow;
}

export function initializeTotalCell(worksheet, initialValue = 0) {
    worksheet.getRange(41, 4).setValue(initialValue);
}