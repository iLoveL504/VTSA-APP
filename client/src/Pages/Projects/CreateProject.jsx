import { useMemo } from "react";
import { Axios } from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import useFormValidate from "../../hooks/useFormValidate";

const validate = (values) => {
  let errors = {};

  // Project & General Information
  if (!values.liftName) errors.liftName = "Lift name is required";
  if (!values.description) errors.description = "Description is required";

  // Essential Lift Specifications
  if (!values.cap || values.cap <= 0)
    errors.cap = "Capacity must be greater than 0";
  if (!values.speed || values.speed <= 0)
    errors.speed = "Speed must be greater than 0";
  if (values.stops !== "" && (isNaN(values.stops) || values.stops < 0))
    errors.stops = "Stops must be 0 or more";
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


const CreateProject = () => {
  const navigate = useNavigate();

  const initialState = useMemo(() => ({
    liftName: "",
    description: "",
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
  }), []);


  const {
    values,
    errors,
    handleInputChange,
    handleNumberInputChange,
    handleBlur,
    handleSubmit,
  } = useFormValidate(initialState, validate);

  const onSubmit = async () => {
    const payload = {
      ...values,
      cap: values.cap ? Number(values.cap) : 0,
      speed: values.speed ? Number(values.speed) : 0,
      stops: values.stops ? Number(values.stops) : 0,
      travel: values.travel ? Number(values.travel) : 0,
      overheadHeight: values.overheadHeight ? Number(values.overheadHeight) : 0,
      pitDepth: values.pitDepth ? Number(values.pitDepth) : 0,
    };


    try {
      console.log(payload);
      await Axios.post("/projects", payload);
      window.location.reload()
      navigate("/projects");
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
   <div className="Content CreateProject">
      <h1>Create New Project</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Required Fields Group */}
        <div className="form-section-group">
          <h3>Project & General Information</h3>
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
            </div>
        </div>

        {/* Optional Fields Group */}
     <div className="form-section-group">
      <h3>Essential Lift Specifications</h3>

      <div>
        <label htmlFor="capacity">Capacity</label>
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
        <label htmlFor="speed">Speed</label>
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
        <label htmlFor="speed">Speed</label>
        <input
          type="number"
          id="stops"
          name="stops"
          value={values.stops}
          onChange={handleNumberInputChange}
          onBlur={handleBlur}
          placeholder="Number of stops"
          min="0"
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


        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
