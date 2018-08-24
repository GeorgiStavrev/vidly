import React, { Component } from "react";

class TableHeader extends Component {
  raiseSort = path => {
    const sortColumn = { ...this.props.sortColumn };
    if (sortColumn.path === path) {
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }

    this.props.onSort(sortColumn);
  };

  renderSortIcon = column => {
    const { sortColumn } = this.props;
    if (sortColumn.path !== column.path) return null;

    return sortColumn.order === "asc" ? (
      <i className="fa fa-sort-asc" />
    ) : (
      <i className="fa fa-sort-desc" />
    );
  };

  render() {
    const { columns } = this.props;

    return (
      <thead>
        <tr>
          {columns.map(c => {
            const classes = c.path ? "clickable" : "";
            return (
              <th
                className={classes}
                key={c.path || c.key}
                onClick={() => (c.path ? this.raiseSort(c.path) : 0)}
              >
                {c.label} {this.renderSortIcon(c)}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
