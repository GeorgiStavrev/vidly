import React from "react";
import PropTypes from "prop-types";

const ListGroup = ({
  items,
  valueProperty,
  textProperty,
  selectedItem,
  onItemSelect
}) => {
  return (
    <ul className="list-group mt-3">
      {items.map(item => (
        <li
          key={item[valueProperty]}
          className={
            item[valueProperty] === selectedItem
              ? "list-group-item active"
              : "list-group-item"
          }
          onClick={() => onItemSelect(item)}
          style={{ cursor: "pointer" }}
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

ListGroup.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedItem: PropTypes.string,
  valueProperty: PropTypes.string,
  textProperty: PropTypes.string,
  onItemSelect: PropTypes.func.isRequired
};

ListGroup.defaultProps = {
  valueProperty: "_id",
  textProperty: "name"
};

export default ListGroup;
