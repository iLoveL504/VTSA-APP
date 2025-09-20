export function setupM42Monitoring(worksheet) {
    if (typeof window !== 'undefined') {
        
        window.getM42Value = () => {
            try {
                const cell = worksheet.getRange(41, 12);
                const value = cell.getValue();
                
                if (value === null || value === 0) {
                    console.log('M42 formula not calculated yet. Forcing recalculation...');
                    const currentE42 = worksheet.getRange(41, 4).getValue();
                    worksheet.getRange(41, 4).setValue(currentE42 + 0.000001);
                    worksheet.getRange(41, 4).setValue(currentE42);
                    
                    setTimeout(() => {
                        const recalculatedValue = cell.getValue();
                        console.log('M42 value after recalculation:', recalculatedValue);
                        return recalculatedValue;
                    }, 100);
                }
                
                console.log('📊 Current M42 value:', value);
                return value;
            } catch (error) {
                console.error('❌ Failed to retrieve M42 value:', error);
                return null;
            }
        };

        window.getLTotalValue = () => {
            try {
                const cell = worksheet.getRange(41, 11);
                const value = cell.getValue();
                

                if (value === null || value === 0) {
                    console.log('M42 formula not calculated yet. Forcing recalculation...');
                    
                    const currentE42 = worksheet.getRange(41, 4).getValue();
                    worksheet.getRange(41, 4).setValue(currentE42 + 0.000001);
                    worksheet.getRange(41, 4).setValue(currentE42);
                    

                    setTimeout(() => {
                        const recalculatedValue = cell.getValue();
                        console.log('L42 value after recalculation:', recalculatedValue);
                        return recalculatedValue;
                    }, 100);
                }
                
                console.log('📊 Current Column L Total value:', value);
                return value;
            } catch (error) {
                console.error('❌ Failed to retrieve Column L Total value:', error);
                return null;
            }
        };
        
        window.getAllTotals = () => {
            return {
                m42: window.getM42Value(),
                lTotal: window.getLTotalValue()
            };
        };

        window.forceRecalculation = () => {
            try {
                const currentE42 = worksheet.getRange(41, 4).getValue();
                worksheet.getRange(41, 4).setValue(currentE42 + 0.000001);
                worksheet.getRange(41, 4).setValue(currentE42);
                console.log('🔄 Forced recalculation');
                return true;
            } catch (error) {
                console.error('❌ Failed to force recalculation:', error);
                return false;
            }
        };
        
        console.log('✅ M42 monitoring ready. Use window.getM42Value() or window.forceRecalculation()');
    }
}