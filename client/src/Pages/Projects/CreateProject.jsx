import { useMemo, useState, useEffect } from "react";
import { Axios } from "../../api/axios.js";
import { useNavigate, useParams } from "react-router-dom";
import useFormValidate from "../../hooks/useFormValidate";
import '../../css/CreateProject.css'
import { useSharedSocket } from "../../Context/SocketContext.js";
import philippines from 'philippines'

// Add these imports for icons
import {
  Business,
  Elevator,
  Description,
  LocationOn,
  Settings,
  AspectRatio,
  AttachFile,
  Add,
  CheckCircle
} from "@mui/icons-material";

const regionToIslandGroup = {
  // Luzon
  "NCR": "Luzon",
  "CAR": "Luzon",
  "Region I": "Luzon",
  "Region II": "Luzon",
  "Region III": "Luzon",
  "Region IV-A": "Luzon",
  "Region IV-B": "Luzon",
  "Region V": "Luzon",

  // Visayas
  "Region VI": "Visayas",
  "Region VII": "Visayas",
  "Region VIII": "Visayas",

  // Mindanao
  "Region IX": "Mindanao",
  "Region X": "Mindanao",
  "Region XI": "Mindanao",
  "Region XII": "Mindanao",
  "Region XIII": "Mindanao",
  "ARMM": "Mindanao",
};

const validate = (values) => {
  let errors = {};

  // Project & General Information
  if (!values.clientName) errors.clientName = "Client name is required";
  if (!values.liftName) errors.liftName = "Lift name is required";
  if (!values.description) errors.description = "Description is required";
  if (!values.region) errors.region = "Region is required";
  if (!values.province) errors.province = "Province is required";
  if (!values.city) errors.city = "City is required";
  if (values.photos.length === 0) errors.photos = "Contract attachment is required"

  // Essential Lift Specifications
  if (!values.cap || values.cap <= 0)
    errors.cap = "Capacity must be greater than 0";
  if (!values.speed || values.speed <= 0)
    errors.speed = "Speed must be greater than 0";
  if (!values.stops) errors.stops = "Stops must be 0 or more";
    
  if (!values.servingFloor)
    errors.servingFloor = "Serving floor information is required";
  if (!values.travel) errors.travel = "Travel distance is required";
  if (!values.control) errors.control = "Control system is required";
  if (!values.drive) errors.drive = "Drive type is required";
  if (!values.doorOperator)
    errors.doorOperator = "Door operator is required";
  if (!values.powerSupply)
    errors.powerSupply = "Power supply is required";

  // Shaft & Car Dimensions
  if (!values.shaft) errors.shaft = "Shaft details are required";
  if (!values.shaftSize) errors.shaftSize = "Shaft size is required";
  if (!values.carSize) errors.carSize = "Car size is required";
  if (!values.doorSize) errors.doorSize = "Door size is required";
  if (values.overheadHeight === "" || values.overheadHeight < 0)
    errors.overheadHeight = "Overhead height must be 0 or greater";
  if (values.pitDepth === "" || values.pitDepth < 0)
    errors.pitDepth = "Pit depth must be 0 or greater";

  return errors;
};

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, projectName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <CheckCircle className="modal-icon" />
          <h3>Confirm Project Creation</h3>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to create the project <strong>"{projectName}"</strong>?</p>
          <p>This action will save all the lift specifications and create a new project.</p>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Yes, Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessMessage = ({ isOpen, projectName, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content success-modal">
        <div className="modal-header success-header">
          <div className="success-icon">✓</div>
          <h3>Project Created Successfully! 🎉</h3>
        </div>
        <div className="modal-body">
          <p>The project <strong>"{projectName}"</strong> has been successfully created and saved to the database.</p>
          <p>You will be redirected to the projects page shortly.</p>
        </div>
        <div className="modal-actions">
          <button className="btn-confirm" onClick={onClose}>
            Continue to Projects
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateProject = () => {
  const {utilitiesSocket} = useSharedSocket()
  const navigate = useNavigate();
  const {projId} = useParams()
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  
  // State for location dropdowns
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  console.log(selectedCity)
  const equipmentTypes = [
    "Home/Residential Elevator",
    "Machine Room Passenger Elevator", 
    "Machine Room less Passenger Elevator",
    "Machine Room Freight/Cargo Elevator",
    "Machine Room Hospital Bed Elevator",
    "Machine Room less Hospital Bed Elevator",
    "Machine Room Car Elevator",
    "Machine Room less Car Elevator",
    "Macine Room Panoramic Elevator",
    "Machine Room less Panoramic Elevator",
    "PWD Lift",
    "Escalator 600K",
    "Escalator 800k",
    "Escalator 1000K"
  ];

  const formSections = [
    { icon: <Business />, title: "Project Details", description: "Basic project information" },
    { icon: <LocationOn />, title: "Location", description: "Project location details" },
    { icon: <Elevator />, title: "Equipment", description: "Lift specifications" },
    { icon: <Settings />, title: "Specifications", description: "Technical details" },
    { icon: <AspectRatio />, title: "Dimensions", description: "Shaft and car dimensions" },
    { icon: <AttachFile />, title: "Documents", description: "Contract attachments" }
  ];

  const initialState = useMemo(() => ({
    clientName: "",
    liftName: "",
    description: "",
    address: "",
    equipmentType: "",
    region: "",
    province: "",
    city: "",
    cap: "",
    drive: "",
    doorOperator: "",
    speed: "",
    control: "",
    stops: "",
    servingFloor: "",
    travel: "",
    powerSupply: "",
    shaft: "",
    shaftSize: "",
    carSize: "",
    doorSize: "",
    overheadHeight: "",
    pitDepth: "",
    photos: []
  }), []);

  const {
    values,
    errors,
    handleInputChange,
    handleNumberInputChange,
    handleBlur,
    handleContractChange
  } = useFormValidate(initialState, validate);

  // Filter provinces based on selected region
  useEffect(() => {
    if (selectedRegion) {
      const region = philippines.regions.find(r => r.name === selectedRegion);
      if (region) {
        const provs = philippines.provinces.filter(p => p.region === region.key);
        setFilteredProvinces(provs);
      }
    } else {
      setFilteredProvinces([]);
    }
  }, [selectedRegion]);

  // Filter cities based on selected province
  useEffect(() => {
    if (selectedProvince) {
      const prov = philippines.provinces.find(p => p.name === selectedProvince);
      if (prov) {
        const cits = philippines.cities.filter(c => c.province === prov.key);
        setFilteredCities(cits);
      }
    } else {
      setFilteredCities([]);
    }
  }, [selectedProvince]);

  const handleRegionChange = (event) => {
    const value = event.target.value;
    setSelectedRegion(value);
    handleInputChange({ target: { name: 'region', value } });
  };

  const handleProvinceChange = (event) => {
    const value = event.target.value;
    setSelectedProvince(value);
    handleInputChange({ target: { name: 'province', value } });
  };

  const handleCityChange = (event) => {
    const value = event.target.value;
    setSelectedCity(value);
    handleInputChange({ target: { name: 'city', value } });
  };

  const SearchableDropdown = ({ 
    id, 
    name, 
    value, 
    onChange, 
    options, 
    placeholder, 
    error 
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredOptions = options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (optionValue) => {
      onChange({ target: { name, value: optionValue } });
      setSearchTerm("");
      setIsOpen(false);
    };

    return (
      <div className="searchable-dropdown" >
        <input
          type="text"
          id={id}
          name={name}
          value={isOpen ? searchTerm : value}
          onChange={(e) => {
            if (isOpen) {
              setSearchTerm(e.target.value);
            } else {
              onChange(e);
            }
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm("");
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className={error ? "error" : ""}
          autocomplete="off"
        />
        
        {isOpen && (
          <div className="dropdown-options" >
            {filteredOptions.map((option) => (
              <div
                key={option.name}
                className="dropdown-option"
                onMouseDown={() => handleSelect(option.name)}
              >
                {option.name}
              </div>
            ))}
            {/* {filteredOptions.length > 5 && (
              <div className="dropdown-more">
                + {filteredOptions.length - 5} more results...
              </div>
            )} */}
            {filteredOptions.length === 0 && (
              <div className="dropdown-no-results">No results found</div>
            )}
          </div>
        )}
        
        {error && <p className="error">{error}</p>}
      </div>
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // const payload = {
    //   ...values,
    //   cap: values.cap ? Number(values.cap) : 0,
    //   speed: values.speed ? Number(values.speed) : 0,
    //   travel: values.travel ? Number(values.travel) : 0,
    //   overheadHeight: values.overheadHeight ? Number(values.overheadHeight) : 0,
    //   pitDepth: values.pitDepth ? Number(values.pitDepth) : 0,
    //   islandGroup
    // };
    
    console.log("Validation errors:", errors);
    if (Object.keys(errors).length === 0) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);
    const islandGroup = regionToIslandGroup[values.region] || "Unknown";
    const formData = new FormData();

    // Append text fields
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'photos') {
        formData.append(key, value);
      }
    });

    formData.append('island_group', islandGroup)

    // Append photos (if any)
    if (values.photos && values.photos.length > 0) {
      for (let i = 0; i < values.photos.length; i++) {
        formData.append('photos', values.photos[i]);
      }
    }

    try {
      const response = await Axios.post("/api/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        setShowSuccess(true);
        setIsSubmitting(false);
        utilitiesSocket.emit('refresh_all_projects')
        setTimeout(() => {
          navigate(`/projects/${response.data?.projectId.id}/team`);
        }, 3000);
      } else {
        alert("Unexpected server response. Please try again.");
      }

    } catch (err) {
      console.error("Error creating project:", err);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate(`/projects/${projId}/team`);
  };

  const nextSection = () => {
    setActiveSection(prev => Math.min(prev + 1, formSections.length - 1));
  };

  const prevSection = () => {
    setActiveSection(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="Content CreateProject">
      <div className="project-header">
        <div className="header-content">
          <h1>Create New Project</h1>
          <p>Fill in the details below to create a new elevator project</p>
        </div>
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((activeSection + 1) / formSections.length) * 100}%` }}
            ></div>
          </div>
          <span>Step {activeSection + 1} of {formSections.length}</span>
        </div>
      </div>

      <div className="form-container">
        <div className="form-sidebar">
          {formSections.map((section, index) => (
            <div
              key={index}
              className={`sidebar-item ${index === activeSection ? 'active' : ''} ${index < activeSection ? 'completed' : ''}`}
              onClick={() => setActiveSection(index)}
            >
              <div className="sidebar-icon">
                {section.icon}
              </div>
              <div className="sidebar-content">
                <h4>{section.title}</h4>
                <p>{section.description}</p>
              </div>
              {index < activeSection && (
                <CheckCircle className="check-icon" />
              )}
            </div>
          ))}
        </div>

        <div className="form-content">
          <form onSubmit={handleFormSubmit}>
            {/* Section 1: Project Details */}
            {activeSection === 0 && (
              <div className="form-section">
                <div className="section-header">
                  <Business className="section-icon" />
                  <div>
                    <h2>Project Details</h2>
                    <p>Basic information about the project and client</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="clientName">Client Name *</label>
                    <input
                      type="text"
                      id="clientName"
                      name="clientName"
                      value={values.clientName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Enter client name"
                      className={errors.clientName ? 'error' : ''}
                    />
                    {errors.clientName && <span className="error-message">{errors.clientName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="liftName">Lift Name *</label>
                    <input
                      type="text"
                      id="liftName"
                      name="liftName"
                      value={values.liftName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Enter lift name"
                      className={errors.liftName ? 'error' : ''}
                    />
                    {errors.liftName && <span className="error-message">{errors.liftName}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="description">Project Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={values.description}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Describe the project scope and requirements..."
                      rows="4"
                      className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Location */}
            {activeSection === 1 && (
              <div className="form-section">
                <div className="section-header">
                  <LocationOn className="section-icon" />
                  <div>
                    <h2>Project Location</h2>
                    <p>Where the project will be implemented</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="region">Region *</label>
                    <SearchableDropdown
                      id="region"
                      name="region"
                      value={values.region}
                      onChange={handleRegionChange}
                      options={philippines.regions}
                      placeholder="Select region"
                      error={errors.region}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="province">Province *</label>
                    <SearchableDropdown
                      id="province"
                      name="province"
                      value={values.province}
                      onChange={handleProvinceChange}
                      options={filteredProvinces}
                      placeholder={selectedRegion ? "Select province" : "Select region first"}
                      error={errors.province}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City/Municipality *</label>
                    <SearchableDropdown
                      id="city"
                      name="city"
                      value={values.city}
                      onChange={handleCityChange}
                      options={filteredCities}
                      placeholder={selectedProvince ? "Select city" : "Select province first"}
                      error={errors.city}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Equipment */}
            {activeSection === 2 && (
              <div className="form-section">
                <div className="section-header">
                  <Elevator className="section-icon" />
                  <div>
                    <h2>Product Type</h2>
                    <p>Select the appropriate product type</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="equipmentType">Equipment Type *</label>
                    <div className="select-wrapper">
                      <select
                        id="equipmentType"
                        name="equipmentType"
                        value={values.equipmentType}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={errors.equipmentType ? 'error' : ''}
                      >
                        <option value="">-- Select equipment type --</option>
                        {equipmentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="select-arrow">▼</div>
                    </div>
                    {errors.equipmentType && <span className="error-message">{errors.equipmentType}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Specifications */}
            {activeSection === 3 && (
              <div className="form-section">
                <div className="section-header">
                  <Settings className="section-icon" />
                  <div>
                    <h2>Lift Specifications</h2>
                    <p>Technical specifications and requirements</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="capacity">Capacity (Kgs) *</label>
                    <input
                      type="number"
                      id="capacity"
                      name="cap"
                      value={values.cap}
                      onChange={handleNumberInputChange}
                      onBlur={handleBlur}
                      placeholder="Enter capacity"
                      min="1"
                      className={errors.cap ? 'error' : ''}
                    />
                    {errors.cap && <span className="error-message">{errors.cap}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="speed">Speed (m/s) *</label>
                    <input
                      type="number"
                      id="speed"
                      name="speed"
                      value={values.speed}
                      onChange={handleNumberInputChange}
                      onBlur={handleBlur}
                      placeholder="Enter speed"
                      min="0.1"
                      step="0.1"
                      className={errors.speed ? 'error' : ''}
                    />
                    {errors.speed && <span className="error-message">{errors.speed}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="stops">Stops *</label>
                    <input
                      type="text"
                      id="stops"
                      name="stops"
                      value={values.stops}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Number of stops"
                      className={errors.stops ? 'error' : ''}
                    />
                    {errors.stops && <span className="error-message">{errors.stops}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="servingFloor">Serving Floor *</label>
                    <input
                      type="text"
                      id="servingFloor"
                      name="servingFloor"
                      value={values.servingFloor}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="e.g. B1–10F"
                      className={errors.servingFloor ? 'error' : ''}
                    />
                    {errors.servingFloor && <span className="error-message">{errors.servingFloor}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="travel">Travel *</label>
                    <input
                      type="text"
                      id="travel"
                      name="travel"
                      value={values.travel}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Travel distance"
                      className={errors.travel ? 'error' : ''}
                    />
                    {errors.travel && <span className="error-message">{errors.travel}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="control">Control System *</label>
                    <input
                      type="text"
                      id="control"
                      name="control"
                      value={values.control}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Control system"
                      className={errors.control ? 'error' : ''}
                    />
                    {errors.control && <span className="error-message">{errors.control}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="drive">Drive Type *</label>
                    <input
                      type="text"
                      id="drive"
                      name="drive"
                      value={values.drive}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Drive type"
                      className={errors.drive ? 'error' : ''}
                    />
                    {errors.drive && <span className="error-message">{errors.drive}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="doorOperator">Door Operator *</label>
                    <input
                      type="text"
                      id="doorOperator"
                      name="doorOperator"
                      value={values.doorOperator}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Door operator type"
                      className={errors.doorOperator ? 'error' : ''}
                    />
                    {errors.doorOperator && <span className="error-message">{errors.doorOperator}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="powerSupply">Power Supply *</label>
                    <input
                      type="text"
                      id="powerSupply"
                      name="powerSupply"
                      value={values.powerSupply}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Power supply"
                      className={errors.powerSupply ? 'error' : ''}
                    />
                    {errors.powerSupply && <span className="error-message">{errors.powerSupply}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Dimensions */}
            {activeSection === 4 && (
              <div className="form-section">
                <div className="section-header">
                  <AspectRatio className="section-icon" />
                  <div>
                    <h2>Dimensions</h2>
                    <p>Shaft and car dimension specifications</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="shaft">Shaft Details *</label>
                    <input
                      type="text"
                      id="shaft"
                      name="shaft"
                      value={values.shaft}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Shaft details"
                      className={errors.shaft ? 'error' : ''}
                    />
                    {errors.shaft && <span className="error-message">{errors.shaft}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="shaftSize">Shaft Size *</label>
                    <input
                      type="text"
                      id="shaftSize"
                      name="shaftSize"
                      value={values.shaftSize}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Shaft size"
                      className={errors.shaftSize ? 'error' : ''}
                    />
                    {errors.shaftSize && <span className="error-message">{errors.shaftSize}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="carSize">Car Size *</label>
                    <input
                      type="text"
                      id="carSize"
                      name="carSize"
                      value={values.carSize}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Car size"
                      className={errors.carSize ? 'error' : ''}
                    />
                    {errors.carSize && <span className="error-message">{errors.carSize}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="doorSize">Door Size *</label>
                    <input
                      type="text"
                      id="doorSize"
                      name="doorSize"
                      value={values.doorSize}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Door size"
                      className={errors.doorSize ? 'error' : ''}
                    />
                    {errors.doorSize && <span className="error-message">{errors.doorSize}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="overheadHeight">Overhead Height</label>
                    <input
                      type="number"
                      id="overheadHeight"
                      name="overheadHeight"
                      value={values.overheadHeight}
                      onChange={handleNumberInputChange}
                      onBlur={handleBlur}
                      placeholder="Overhead height"
                      min="0"
                      className={errors.overheadHeight ? 'error' : ''}
                    />
                    {errors.overheadHeight && <span className="error-message">{errors.overheadHeight}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="pitDepth">Pit Depth</label>
                    <input
                      type="number"
                      id="pitDepth"
                      name="pitDepth"
                      value={values.pitDepth}
                      onChange={handleNumberInputChange}
                      onBlur={handleBlur}
                      placeholder="Pit depth"
                      min="0"
                      className={errors.pitDepth ? 'error' : ''}
                    />
                    {errors.pitDepth && <span className="error-message">{errors.pitDepth}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Documents */}
            {activeSection === 5 && (
              <div className="form-section">
                <div className="section-header">
                  <AttachFile className="section-icon" />
                  <div>
                    <h2>Contract Documents</h2>
                    <p>Attach relevant contract files and photos</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="photos">Contract Attachment *</label>
                    <div className="file-upload-area">
                      <input 
                        type="file"
                        id="photos"
                        name="photos"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleContractChange}
                        className="file-input"
                      />
                      <div className="upload-placeholder">
                        <AttachFile className="upload-icon" />
                        <p>Click to upload or drag and drop</p>
                        <small>Supports images, PDF, DOC (Max 10MB)</small>
                      </div>
                    </div>
                    {values.photos.length > 0 && (
                      <div className="file-preview">
                        <p>{values.photos.length} file(s) selected</p>
                      </div>
                    )}
                    {errors.photos && <span className="error-message">{errors.photos}</span>}
                  </div>
                </div>
              </div>
            )}

            <div className="form-navigation">
              {activeSection > 0 && (
                <button type="button" className="btn-secondary" onClick={prevSection}>
                  Previous
                </button>
              )}
              
              {activeSection < formSections.length - 1 ? (
                <button type="button" className="btn-primary" onClick={nextSection}>
                  Next
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Add />
                      Create Project
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        projectName={values.liftName || "Untitled Project"}
      />

      <SuccessMessage
        isOpen={showSuccess}
        projectName={values.liftName || "Untitled Project"}
        onClose={handleSuccessClose}
      />
    </div>
  );
};

export default CreateProject;