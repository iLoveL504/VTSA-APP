import { useMemo, useState, useEffect } from "react";
import { Axios } from "../../api/axios.js";
import { useNavigate, useParams } from "react-router-dom";
import useFormValidate from "../../hooks/useFormValidate";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import philippines from 'philippines'
import '../../css/CreateProject.css'

  const validate = (values) => {
    console.log(values)
    let errors = {};

    // Project & General Information
    if (!values.clientName) errors.clientName = "Client name is required";
    if (!values.liftName) errors.liftName = "Lift name is required";
    if (!values.description) errors.description = "Description is required";
    if (!values.region) errors.region = "Region is required";
    if (!values.province) errors.province = "Province is required";
    if (!values.city) errors.city = "City is required";
    if (values.photos.length === 0) errors.photos = "Contract attachment is required"
    // if (!values.equipmentType) errors.equipmentType = "Equipment type is required";

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
          <h3>Project Created Successfully! 🎉</h3>
        </div>
        <div className="modal-body">
          <div className="success-icon">✓</div>
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
  const navigate = useNavigate();
  const {projId} = useParams()

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for location dropdowns
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const equipmentTypes = [
    "passenger elevator",
    "residential elevator", 
    "freight elevator",
    "hospital elevator",
    "car elevator",
    "E200 Escalator",
    "T200 Escalator",
    "dumbwaiter"
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
      const cits = philippines.cities.filter(c => c.province=== prov.key);
      setFilteredCities(cits);
      setSelectedCity(cits)
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
    console.log(selectedCity)
    handleInputChange({ target: { name: 'city', value } });

  };

  // Custom dropdown component for large datasets
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
      <div className="searchable-dropdown">
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
        />
        
        {isOpen && (
          <div className="dropdown-options">
            {filteredOptions.slice(0, 5).map((option) => (
              <div
                key={option.name}
                className="dropdown-option"
                onMouseDown={() => handleSelect(option.name)}
              >
                {option.name}
              </div>
            ))}
            {filteredOptions.length > 5 && (
              <div className="dropdown-more">
                + {filteredOptions.length - 5} more results...
              </div>
            )}
            {filteredOptions.length === 0 && (
              <div className="dropdown-no-results">No results found</div>
            )}
          </div>
        )}
        
        {error && <p className="error">{error}</p>}
      </div>
    );
  };

  // const handleSelectChange = (event) => {
  //   const { name, value } = event.target;
  //   handleInputChange({
  //     target: {
  //       name,
  //       value
  //     }
  //   });
  // };

  const handleFormSubmit = (e) => {
    e.preventDefault();
        const payload = {
      ...values,
      cap: values.cap ? Number(values.cap) : 0,
      speed: values.speed ? Number(values.speed) : 0,
      travel: values.travel ? Number(values.travel) : 0,
      overheadHeight: values.overheadHeight ? Number(values.overheadHeight) : 0,
      pitDepth: values.pitDepth ? Number(values.pitDepth) : 0,
    };
    console.log(payload)
  
    console.log("Validation errors:", errors);
    if (Object.keys(errors).length === 0) {
      setShowConfirmation(true);
    }
  };

const handleConfirm = async () => {
  setIsSubmitting(true);
  setShowConfirmation(false);

  const formData = new FormData();

  // Append text fields
  Object.entries(values).forEach(([key, value]) => {
    // For arrays like photos, skip (we’ll handle below)
    if (key !== 'photos') {
      formData.append(key, value);
    }
  });

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

  return (
    <div className="Content CreateProject">
      <h1>Create New Project</h1>
      <form onSubmit={handleFormSubmit}>
        {/* Required Fields Group */}
        <div className="form-section-group">
          <h3>Project & General Information</h3>
          
            <div>
              <label htmlFor="clientName">Client Name</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={values.clientName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter client name"
                required
              />
              {errors.clientName && <p className="error">{errors.clientName}</p>}
            </div>

            <div>
              <label htmlFor="liftName">Lift Name</label>
              <input
                type="text"
                id="liftName"
                name="liftName"
                value={values.liftName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter lift name"
                required
              />
              {errors.liftName && <p className="error">{errors.liftName}</p>}
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={values.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter project description"
                rows="3"
              />
              {errors.description && <p className="error">{errors.description}</p>}
            </div>

       {/* Location Dropdowns */}
          <div>
            <label htmlFor="region">Region</label>
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

          <div>
            <label htmlFor="province">Province</label>
            <SearchableDropdown
              id="province"
              name="province"
              value={values.province}
              onChange={handleProvinceChange}
              options={filteredProvinces}
              placeholder={selectedRegion ? "Select province" : "Select region first"}
              error={errors.province}
              disabled={!selectedRegion}
            />
          </div>

          <div>
            <label htmlFor="city">City/Municipality</label>
            <SearchableDropdown
              id="city"
              name="city"
              value={values.city}
              onChange={handleCityChange}
              options={filteredCities}
              placeholder={selectedProvince ? "Select city" : "Select province first"}
              error={errors.city}
              disabled={!selectedProvince}
            />
          </div>

     
       
             <div className="form-control-professional">
              <label htmlFor="equipmentType">Equipment Type</label>
              <select
                id="equipmentType"
                name="equipmentType"
                value={values.equipmentType}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
              >
                <option value="">-- Select equipment type --</option>
                {equipmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.equipmentType && <p className="error">{errors.equipmentType}</p>}
            </div>

            
          </div>

        {/* Optional Fields Group */}
        <div className="form-section-group">
          <h3>Essential Lift Specifications</h3>

          <div>
            <label htmlFor="capacity">Capacity (Kgs)</label>
            <input
              type="number"
              id="capacity"
              name="cap"
              value={values.cap}
              onChange={handleNumberInputChange}
              onBlur={handleBlur}
              placeholder="Enter capacity"
              min="1"
              required
            />
            {errors.cap && <p className="error">{errors.cap}</p>}
          </div>

          <div>
            <label htmlFor="speed">Speed (m/s)</label>
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
              required
            />
            {errors.speed && <p className="error">{errors.speed}</p>}
          </div>

          <div>
            <label htmlFor="stops">Stops</label>
            <input
              type="text"
              id="stops"
              name="stops"
              value={values.stops}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Number of stops"
  
            />
            {errors.stops && <p className="error">{errors.stops}</p>}
          </div>

          <div>
            <label htmlFor="servingFloor">Serving Floor</label>
            <input
              type="text"
              id="servingFloor"
              name="servingFloor"
              value={values.servingFloor}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Serving floors (e.g. B1–10F)"
            />
            {errors.servingFloor && <p className="error">{errors.servingFloor}</p>}
          </div>

          <div>
            <label htmlFor="travel">Travel</label>
            <input
              type="text"
              id="travel"
              name="travel"
              value={values.travel}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Travel distance"
            />
            {errors.travel && <p className="error">{errors.travel}</p>}
          </div>

          <div>
            <label htmlFor="control">Control</label>
            <input
              type="text"
              id="control"
              name="control"
              value={values.control}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Control system"
            />
            {errors.control && <p className="error">{errors.control}</p>}
          </div>

          <div>
            <label htmlFor="drive">Drive</label>
            <input
              type="text"
              id="drive"
              name="drive"
              value={values.drive}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Drive type"
            />
            {errors.drive && <p className="error">{errors.drive}</p>}
          </div>

          <div>
            <label htmlFor="doorOperator">Door Operator</label>
            <input
              type="text"
              id="doorOperator"
              name="doorOperator"
              value={values.doorOperator}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Door operator type"
            />
            {errors.doorOperator && <p className="error">{errors.doorOperator}</p>}
          </div>

          <div>
            <label htmlFor="powerSupply">Power Supply</label>
            <input
              type="text"
              id="powerSupply"
              name="powerSupply"
              value={values.powerSupply}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Power supply"
            />
            {errors.powerSupply && <p className="error">{errors.powerSupply}</p>}
          </div>
        </div>

        <div className="form-section-group">
          <h3>Shaft & Car Dimensions</h3>

          <div>
            <label htmlFor="shaft">Shaft</label>
            <input
              type="text"
              id="shaft"
              name="shaft"
              value={values.shaft}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Shaft details"
            />
            {errors.shaft && <p className="error">{errors.shaft}</p>}
          </div>

          <div>
            <label htmlFor="shaftSize">Shaft Size</label>
            <input
              type="text"
              id="shaftSize"
              name="shaftSize"
              value={values.shaftSize}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Shaft size"
            />
            {errors.shaftSize && <p className="error">{errors.shaftSize}</p>}
          </div>

          <div>
            <label htmlFor="carSize">Car Size</label>
            <input
              type="text"
              id="carSize"
              name="carSize"
              value={values.carSize}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Car size"
            />
            {errors.carSize && <p className="error">{errors.carSize}</p>}
          </div>

          <div>
            <label htmlFor="doorSize">Door Size</label>
            <input
              type="text"
              id="doorSize"
              name="doorSize"
              value={values.doorSize}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Door size"
            />
            {errors.doorSize && <p className="error">{errors.doorSize}</p>}
          </div>

          <div>
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
            />
            {errors.overheadHeight && <p className="error">{errors.overheadHeight}</p>}
          </div>

          <div>
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
            />
            {errors.pitDepth && <p className="error">{errors.pitDepth}</p>}
          </div>
        </div>

        <div className="form-section-group">
          <h3>Attach Contract</h3>
          <label htmlFor="photos">Contract</label>
          <input 
            type="file"
            id="photos"
            name="photos"
            multiple
            accept="image/*"
            onChange={handleContractChange}    
          />
          <small>
            Photos inserted:
          </small>
          {errors.photos && <p className="error">{errors.photos}</p>}
          <button onClick={(e) => {
            e.preventDefault()

            console.log(values)
          }
          }>fds</button>
        </div>


        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Project..." : "Create Project"}
        </button>
      </form>

        

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