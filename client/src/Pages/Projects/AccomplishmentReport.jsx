import React, { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Printer, Edit2, Save, X, TrendingUp } from 'lucide-react';
import '../../css/AccomplishmentReport.css'
import { useReactToPrint } from "react-to-print";
import useAxiosFetch from '../../hooks/useAxiosFetch'
import { useParams } from 'react-router-dom'
import { useSharedSocket } from "../../Context/SocketContext";

const AccomplishmentReport = ({proj}) => {
    const { utilitiesSocket } = useSharedSocket()
    const { projId } = useParams()
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const [editMode, setEditMode] = useState(false);
    const [showCharts, setShowCharts] = useState(false);

    const contentRef = useRef();
    const [data, setData] = useState([]);
    const [guideRail, setGuideRail] = useState([]);
    const [additionalSections, setAdditionalSections] = useState([]);
    const {data: accomplishments, isLoading: accomplishmentsIsLoading} = useAxiosFetch(`${backendURL}/api/projects/schedule/${projId}`)
    const [totalContractAmount, setTotalContractAmount] = useState(null);
    console.log(accomplishments)
useEffect(() => {
  if (!accomplishmentsIsLoading && accomplishments) {
    console.log(proj);
    const sort = accomplishments.filter(a => a.task_id >= 500)
    
    // Group items by section_title
    const grouped = sort.reduce((acc, item) => {
      const section = item.section_title;

      // Skip items that are summary tasks (they don't have section_title or item_code)
      if (!section || !item.item_code) {
        return acc;
      }

      if (!acc[section]) {
        acc[section] = [];
      }

      acc[section].push({
        id: item.item_code,
        desc: item.description,
        unit: item.unit,
        wt: parseFloat(item.wt) || 0,
        presAcc: parseFloat(item.pres_acc) || 0,
        prevAcc: parseFloat(item.prev_acc) || 0,
      });

      return acc;
    }, {});

    console.log(grouped)
    // Set data for each category
    setData(grouped["General"] || []);
    setGuideRail(grouped["Guide Rail Setting"] || []); // Note: changed from "Guide Rail" to "Guide Rail Setting"

    // Convert everything else into additionalSections
    const extraSections = Object.keys(grouped)
      .filter(key => key !== "General" && key !== "Guide Rail Setting")
      .map((title) => ({
        title,
        items: grouped[title]
      }));

    setAdditionalSections(extraSections);
  }
}, [accomplishmentsIsLoading, accomplishments]);

useEffect(() => {
  console.log(proj)
  setTotalContractAmount(proj.contract_amount)
}, [proj])

    const [projectInfo] = useState({
        company: 'VTSA INTERNATIONAL INC.',
        reportDate: 'June 24, 2025',
        projectName: 'Project Proxima',
        preparedBy: proj.pe_fullname,
        position: 'Project Engineer'
    });


    const getItemContract = (wtPercent) => {
        return (totalContractAmount * wtPercent) / 100;
    };

    const calculateItem = (item) => {
        const contract = getItemContract(item.wt);
        const prevAcc = item.prevAcc || 0;
        const prevAmount = (contract * prevAcc) / 100;
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
      if (num === null || num === undefined || isNaN(num)) {
          return '0.00';
      }
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
        contentRef,
        documentTitle: "Accomplishment Report",
    });

    const getChartData = () => {
        const allItems = [
        ...data.map((item) => ({ ...item, name: `${item.id}. ${item.desc}` })),
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
            <div className="save-section">
              <div className="input-with-icon">
              <span className="currency-symbol">₱</span>
              <input
                type="number"
                value={totalContractAmount}
                onChange={(e) => setTotalContractAmount(parseFloat(e.target.value))}
                className="amount-input"
              />
            </div>
              <button onClick={() => {
                console.log(totalContractAmount)
                utilitiesSocket.emit('set_contract', {amount: totalContractAmount, projId})
                console.log(totalContractAmount)
              }}>
                Save
              </button>            
              <button
                onClick={handlePrint}
                className="action-btn btn-print"
              >
                Print
              </button>
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
      <div className="report-container" ref={contentRef}>
        {/* Header */}
      

        {/* Table */}
        
        {(!accomplishmentsIsLoading && accomplishments) ? (
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
              {console.log(additionalSections)}
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
                <td className="col-date percent-date"></td>
                <td className="col-wt-acc percent-wt">{formatPercent(totals.totalWtAcc)}</td>
                <td className="col-amount amount-completed">₱{formatNumber(totals.totalFinalAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        ) : (
            <div> 
                Data is loading
            </div>
        )}

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
        <div>

        </div>
      </div>
    </div>
  );
};

export default AccomplishmentReport;