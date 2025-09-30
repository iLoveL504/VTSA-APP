import React, { useRef, useEffect } from "react";
import jspreadsheet from "jspreadsheet-ce";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import "jsuites/dist/jsuites.css";
import Spreadsheet from '../../../spreadsheet/spreadsheet'

function TestJspreadsheet() {
  const spreadsheetRef = useRef(null);

  useEffect(() => {
    if (spreadsheetRef.current) {
      jspreadsheet(spreadsheetRef.current, {
    
        worksheets: [
          {
            minDimensions: [8, 6],
            data: [
              ["Task", "Start Date", "End Date", "Duration (days)", "Status", "Progress"],
              ["Installation", "2024-01-01", "2024-01-10", "=DATEDIF(B2,C2,\"d\")", "Pending", 0],
              ["Testing", "2024-01-11", "2024-01-20", "=DATEDIF(B3,C3,\"d\")", "In Progress", 50],
              ["Deployment", "2024-01-21", "2024-01-25", "=DATEDIF(B4,C4,\"d\")", "Not Started", 0],
              ["", "", "Total Days:", "=SUM(D2:D4)", "", "=AVERAGE(F2:F4)"],
            ],
            columns: [
              { title: "Task", width: 200 },
              { title: "Start Date", width: 120, type: "calendar" },
              { title: "End Date", width: 120, type: "calendar" },
              { title: "Duration", width: 120, type: "numeric" },
              { 
                title: "Status", 
                width: 120, 
                type: "dropdown", 
                source: ["Not Started", "In Progress", "Completed"] 
              },
              { title: "Progress %", width: 100, type: "numeric" },
            ],
            toolbar: true,
          },
        ],
      });
    }

    return () => {
      if (spreadsheetRef.current) {
        jspreadsheet.destroy(spreadsheetRef.current);
      }
    };
  }, []);

  return <Spreadsheet />;
}

export default TestJspreadsheet;