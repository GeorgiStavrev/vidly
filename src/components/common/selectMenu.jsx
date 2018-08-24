import React from "react";

const SelectMenu = ({
  name,
  items,
  label,
  value,
  valueProperty,
  labelProperty,
  onChange
}) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <select
        className="custom-select"
        id={name}
        name={name}
        defaultValue={value[valueProperty]}
        onChange={onChange}
      >
        <option style={{ display: "none" }} />
        {items.map(item => (
          <option
            key={item[valueProperty]}
            value={item[valueProperty]}
            selected={value === item[valueProperty]}
          >
            {item[labelProperty]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectMenu;
