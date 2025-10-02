import React, { useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Printer, Edit2, Save, X, TrendingUp } from 'lucide-react';
import '../../css/AccomplishmentReport.css'
import { useReactToPrint } from "react-to-print";

const TestChart = ({ id }) => {
  const [editMode, setEditMode] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const componentRef = useRef();
  
  const [totalContractAmount, setTotalContractAmount] = useState(884000);
  
  const [projectInfo, setProjectInfo] = useState({
    company: 'VTSA INTERNATIONAL INC.',
    reportDate: 'June 24, 2025',
    projectName: 'Project Proxima',
    projectType: 'Freight Elevator - 4 QTY',
    preparedBy: 'John Christian Liongco',
    position: 'Project Engineer'
  });

  const [data, setData] = useState([
    { id: 1, desc: 'Site Delivery', unit: '1 Lot', wt: 0, presAcc: 100 },
    { id: 2, desc: 'Scaffolding', unit: '1 Lot', wt: 7, presAcc: 100 },
    { id: 3, desc: 'Hauling Waste', unit: '1 Lot', wt: 7, presAcc: 100 },
    { id: 4, desc: 'Templates', unit: '1 Lot', wt: 7, presAcc: 100 },
    { id: 5, desc: 'Marking Pipes', unit: '1 Lot', wt: 0, presAcc: 100 },
    { id: 6, desc: 'Rail Bracing', unit: '1 Lot', wt: 7, presAcc: 100 },
  ]);

  const [guideRail, setGuideRail] = useState([
    { id: 'A', desc: 'Main/Outrigger', unit: '1 Lot', wt: 5, presAcc: 100 },
    { id: 'B', desc: 'Counter Weight', unit: '1 Lot', wt: 3, presAcc: 100 },
    { id: 'C', desc: 'Gauging', unit: '1 Lot', wt: 3, presAcc: 100 },
  ]);

  const [additionalSections, setAdditionalSections] = useState([
    {
      title: '8 Landing Door Assembly',
      items: [
        { id: 'A', desc: 'Sills and', unit: '1 Lot', wt: 2, presAcc: 100 },
        { id: 'B', desc: 'Jamb and', unit: '1 Lot', wt: 2, presAcc: 100 },
        { id: 'C', desc: 'Frame', unit: '1 Lot', wt: 3, presAcc: 100 },
      ]
    },
    {
      title: '9 M/R Equipment Setting',
      items: [
        { id: 'A', desc: 'Traction', unit: '1 Lot', wt: 5, presAcc: 100 },
        { id: 'B', desc: 'Support', unit: '1 Lot', wt: 5, presAcc: 100 },
        { id: 'C', desc: 'Governor', unit: '1 Lot', wt: 2, presAcc: 100 },
        { id: 'D', desc: 'Control', unit: '1 Lot', wt: 3, presAcc: 100 },
      ]
    },
    {
      title: '11 Car Assembly',
      items: [
        { id: 'A', desc: 'All Accessories', unit: '1 Lot', wt: 3, presAcc: 100 },
        { id: 'B', desc: 'Car Piping', unit: '1 Lot', wt: 3, presAcc: 100 },
      ]
    },
    {
      title: '12 Travelling',
      items: [
        { id: 'A', desc: 'Counterweight', unit: '1 Lot', wt: 2, presAcc: 100 },
      ]
    },
    {
      title: '13 Counterweight',
      items: [
        { id: 'A', desc: 'Item', unit: '1 Lot', wt: 2, presAcc: 100 },
      ]
    },
    {
      title: '14 Laying Out of Ropes',
      items: [
        { id: 'A', desc: 'Hoisting', unit: '1 Lot', wt: 2, presAcc: 100 },
        { id: 'B', desc: 'Governor', unit: '1 Lot', wt: 3, presAcc: 100 },
        { id: 'C', desc: 'Compensation', unit: '1 Lot', wt: 3, presAcc: 100 },
      ]
    },
    {
      title: '15 Wiring',
      items: [
        { id: 'A', desc: 'Machine', unit: '1 Lot', wt: 5, presAcc: 100 },
        { id: 'B', desc: 'Hoistway', unit: '1 Lot', wt: 3, presAcc: 100 },
      ]
    },
    {
      title: '16 Pit Access',
      items: [
        { id: 'A', desc: 'Item', unit: '1 Lot', wt: 3, presAcc: 100 },
      ]
    },
    {
      title: '17 Testing and Adjustment',
      items: [
        { id: 'A', desc: 'Initial', unit: '1 Lot', wt: 3, presAcc: 100 },
        { id: 'B', desc: 'Slow Speed', unit: '1 Lot', wt: 1, presAcc: 100 },
        { id: 'C', desc: 'High Speed', unit: '1 Lot', wt: 2, presAcc: 100 },
        { id: 'D', desc: 'Loading', unit: '1 Lot', wt: 1, presAcc: 0 },
        { id: 'E', desc: 'Final Adjust', unit: '1 Lot', wt: 1, presAcc: 0 },
      ]
    },
    {
      title: '18 Correction',
      items: [
        { id: 'A', desc: 'Item', unit: '1 Lot', wt: 1, presAcc: 0 },
      ]
    },
    {
      title: '19 Final Cleaning',
      items: [
        { id: 'A', desc: 'Item', unit: '1 Lot', wt: 1, presAcc: 0 },
      ]
    },
  ]);

  const getItemContract = (wtPercent) => {
    return (totalContractAmount * wtPercent) / 100;
  };

  const calculateItem = (item) => {
    const contract = getItemContract(item.wt);
    const prevAcc = 0;
    const prevAmount = 0;
    const amount = (contract * item.presAcc) / 100;
    const toDateAcc = Math.max(item.presAcc, prevAcc);
    const finalAmount = (contract * toDateAcc) / 100;
    const wtAcc = (item.wt * toDateAcc) / 100;
    
    return { 
      contract, 
      prevAcc, 
      prevAmount, 
      amount, 
      toDateAcc, 
      finalAmount, 
      wtAcc 
    };
  };

  const calculateTotals = () => {
    let totalWt = 0;
    let totalAmount = 0;
    let totalFinalAmount = 0;
    let totalWtAcc = 0;
    let totalToDateAcc = 0;

    const allItems = [
      ...data,
      ...guideRail,
      ...additionalSections.flatMap(s => s.items)
    ];

    allItems.forEach(item => {
      const calculated = calculateItem(item);
      totalWt += item.wt;
      totalAmount += calculated.amount;
      totalFinalAmount += calculated.finalAmount;
      totalWtAcc += calculated.wtAcc;
      totalToDateAcc += calculated.toDateAcc;
    });

    const avgToDateAcc = allItems.length > 0 ? totalToDateAcc / allItems.length : 0;

    return { 
      totalContract: totalContractAmount, 
      totalWt, 
      totalAmount, 
      totalFinalAmount,
      totalWtAcc,
      avgToDateAcc
    };
  };

  const totals = calculateTotals();

  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercent = (num) => {
    return num.toFixed(2) + '%';
  };

  const updateData = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = parseFloat(value) || 0;
    setData(newData);
  };

  const updateGuideRail = (index, field, value) => {
    const newData = [...guideRail];
    newData[index][field] = parseFloat(value) || 0;
    setGuideRail(newData);
  };

  const updateSection = (sectionIndex, itemIndex, field, value) => {
    const newSections = [...additionalSections];
    newSections[sectionIndex].items[itemIndex][field] = parseFloat(value) || 0;
    setAdditionalSections(newSections);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Accomplishment Report",
  });

  const getChartData = () => {
    const allItems = [
      ...data.map((item, i) => ({ ...item, name: `${item.id}. ${item.desc}` })),
      ...guideRail.map(item => ({ ...item, name: `7${item.id}. ${item.desc}` })),
    ];

    const topItems = allItems
      .map(item => {
        const calc = calculateItem(item);
        return { ...item, contract: calc.contract, name: item.name || item.desc };
      })
      .filter(item => item.contract > 0)
      .sort((a, b) => b.contract - a.contract)
      .slice(0, 10);

    return topItems;
  };

  const getProgressData = () => {
    const completed = data.filter(item => item.presAcc === 100).length +
                     guideRail.filter(item => item.presAcc === 100).length +
                     additionalSections.flatMap(s => s.items).filter(item => item.presAcc === 100).length;
    
    const total = data.length + guideRail.length + additionalSections.flatMap(s => s.items).length;
    
    return [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'Pending', value: total - completed, color: '#ef4444' }
    ];
  };

  const EditablePercent = ({ value, onChange, disabled = false }) => {
    if (!editMode || disabled) {
      const percentageClass = value === 100 ? 'cell-complete' : value > 0 ? 'cell-progress' : 'cell-pending';
      return (
        <span className={`cell-value ${percentageClass}`}>
          {formatPercent(value)}
        </span>
      );
    }
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="0"
        max="100"
        step="1"
        className="cell-input"
      />
    );
  };

  const EditableWeight = ({ value, onChange, disabled = false }) => {
    if (!editMode || disabled) {
      return <span className="cell-value">{value}%</span>;
    }
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="0"
        max="100"
        step="0.1"
        className="cell-input"
      />
    );
  };

  return (
    <div className="accomplishment-report">
      {/* Control Bar */}
      <div className="control-panel no-print">
        <div className="panel-header">
          <div className="contract-input-group">
            <label className="input-label">Total Contract Amount</label>
            <div className="input-with-icon">
              <span className="currency-symbol">₱</span>
              <input
                type="number"
                value={totalContractAmount}
                onChange={(e) => setTotalContractAmount(parseFloat(e.target.value) || 0)}
                className="amount-input"
              />
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`action-btn ${editMode ? 'btn-cancel' : 'btn-edit'}`}
            >
              {editMode ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit</>}
            </button>
            
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="action-btn btn-charts"
            >
              <TrendingUp size={16} />
              {showCharts ? 'Hide Charts' : 'Show Charts'}
            </button>

            <button
              onClick={handlePrint}
              className="action-btn btn-print"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card card-contract">
            <div className="card-label">Total Contract</div>
            <div className="card-value">₱{formatNumber(totals.totalContract)}</div>
          </div>
          <div className="summary-card card-completed">
            <div className="card-label">Amount Completed</div>
            <div className="card-value">₱{formatNumber(totals.totalFinalAmount)}</div>
          </div>
          <div className="summary-card card-progress">
            <div className="card-label">Weight Progress</div>
            <div className="card-value">{formatPercent(totals.totalWtAcc)}</div>
          </div>
          <div className="summary-card card-weight">
            <div className="card-label">Total Weight</div>
            <div className="card-value">{totals.totalWt}%</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {showCharts && (
        <div className="charts-panel no-print">
          <h2 className="panel-title">Project Analytics Dashboard</h2>
          <div className="charts-grid">
            <div className="chart-box">
              <h3 className="chart-title">Completion Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={getProgressData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {getProgressData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h3 className="chart-title">Top Contract Values</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₱${formatNumber(value)}`, 'Contract Value']} />
                  <Bar dataKey="contract" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Main Report */}
      <div className="report-container" ref={componentRef}>
        {/* Header */}
      

        {/* Table */}
        <div className="table-wrapper">
          <table className="accomplishment-table">
            <thead>
              <tr>
                <th className="col-item">Item No.</th>
                <th className="col-desc">DESCRIPTION</th>
                <th className="col-unit">UNIT</th>
                <th className="col-amount">CONTRACT</th>
                <th className="col-wt">% WT</th>
                <th className="col-prev">PREVIOUS AMOUNT</th>
                <th className="col-pres">PRESENT % ACC</th>
                <th className="col-amount">AMOUNT</th>
                <th className="col-date">TO-DATE % ACC</th>
                <th className="col-wt-acc">% WT. ACC</th>
                <th className="col-amount">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {/* Main Items */}
              {data.map((item, index) => {
                const calc = calculateItem(item);
                return (
                  <tr key={item.id} className="data-row">
                    <td className="col-item">{item.id}</td>
                    <td className="col-desc">{item.desc}</td>
                    <td className="col-unit">{item.unit}</td>
                    <td className="col-amount amount-contract">{formatNumber(calc.contract)}</td>
                    <td className="col-wt">
                      <EditableWeight value={item.wt} onChange={(v) => updateData(index, 'wt', v)} />
                    </td>
                    <td className="col-prev">{formatNumber(calc.prevAmount)}</td>
                    <td className="col-pres">
                      <EditablePercent value={item.presAcc} onChange={(v) => updateData(index, 'presAcc', v)} />
                    </td>
                    <td className="col-amount amount-completed">{formatNumber(calc.amount)}</td>
                    <td className="col-date percent-date">{formatPercent(calc.toDateAcc)}</td>
                    <td className="col-wt-acc percent-wt">{formatPercent(calc.wtAcc)}</td>
                    <td className="col-amount amount-completed">{formatNumber(calc.finalAmount)}</td>
                  </tr>
                );
              })}

              {/* Guide Rail Section */}
              <tr className="section-row">
                <td className="col-item">7</td>
                <td className="col-desc section-title" colSpan="10">Guide Rail Setting</td>
              </tr>
              {guideRail.map((item, index) => {
                const calc = calculateItem(item);
                return (
                  <tr key={`guide-${item.id}`} className="data-row">
                    <td className="col-item"></td>
                    <td className="col-desc indent">{item.id}. {item.desc}</td>
                    <td className="col-unit">{item.unit}</td>
                    <td className="col-amount amount-contract">{formatNumber(calc.contract)}</td>
                    <td className="col-wt">
                      <EditableWeight value={item.wt} onChange={(v) => updateGuideRail(index, 'wt', v)} />
                    </td>
                    <td className="col-prev">{formatNumber(calc.prevAmount)}</td>
                    <td className="col-pres">
                      <EditablePercent value={item.presAcc} onChange={(v) => updateGuideRail(index, 'presAcc', v)} />
                    </td>
                    <td className="col-amount amount-completed">{formatNumber(calc.amount)}</td>
                    <td className="col-date percent-date">{formatPercent(calc.toDateAcc)}</td>
                    <td className="col-wt-acc percent-wt">{formatPercent(calc.wtAcc)}</td>
                    <td className="col-amount amount-completed">{formatNumber(calc.finalAmount)}</td>
                  </tr>
                );
              })}

              {/* Additional Sections */}
              {additionalSections.map((section, sIdx) => (
                <React.Fragment key={sIdx}>
                  <tr className="section-row">
                    <td className="col-item">{sIdx + 8}</td>
                    <td className="col-desc section-title" colSpan="10">{section.title}</td>
                  </tr>
                  {section.items.map((item, iIdx) => {
                    const calc = calculateItem(item);
                    return (
                      <tr key={`section-${sIdx}-${item.id}`} className="data-row">
                        <td className="col-item"></td>
                        <td className="col-desc indent">{item.id}. {item.desc}</td>
                        <td className="col-unit">{item.unit}</td>
                        <td className="col-amount amount-contract">{formatNumber(calc.contract)}</td>
                        <td className="col-wt">
                          <EditableWeight value={item.wt} onChange={(v) => updateSection(sIdx, iIdx, 'wt', v)} />
                        </td>
                        <td className="col-prev">{formatNumber(calc.prevAmount)}</td>
                        <td className="col-pres">
                          <EditablePercent value={item.presAcc} onChange={(v) => updateSection(sIdx, iIdx, 'presAcc', v)} />
                        </td>
                        <td className="col-amount amount-completed">{formatNumber(calc.amount)}</td>
                        <td className="col-date percent-date">{formatPercent(calc.toDateAcc)}</td>
                        <td className="col-wt-acc percent-wt">{formatPercent(calc.wtAcc)}</td>
                        <td className="col-amount amount-completed">{formatNumber(calc.finalAmount)}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}

              {/* Totals Row */}
              <tr className="total-row">
                <td className="col-item" colSpan="2">TOTAL</td>
                <td className="col-unit"></td>
                <td className="col-amount amount-contract">₱{formatNumber(totals.totalContract)}</td>
                <td className="col-wt">{totals.totalWt}%</td>
                <td className="col-prev"></td>
                <td className="col-pres"></td>
                <td className="col-amount amount-completed">₱{formatNumber(totals.totalAmount)}</td>
                <td className="col-date percent-date">{formatPercent(totals.avgToDateAcc)}</td>
                <td className="col-wt-acc percent-wt">{formatPercent(totals.totalWtAcc)}</td>
                <td className="col-amount amount-completed">₱{formatNumber(totals.totalFinalAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="report-footer">
          <div className="footer-content">
            <div className="signature-section">
              <p className="prepared-by">Prepared by:</p>
              <p className="signature-name">{projectInfo.preparedBy}</p>
              <p className="signature-title">{projectInfo.position}</p>
            </div>
            <div className="report-meta">
              <p className="generated-on">
                Generated on: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestChart;