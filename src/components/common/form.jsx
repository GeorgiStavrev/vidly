import React, { Component } from "react";
import Joi from "joi-browser";
import _ from "lodash";
import Input from "./input";
import SelectMenu from "./selectMenu";

class Form extends Component {
  state = {};

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);

    if (!error) return null;

    const errors = {};
    const reducer = (errors, errorDetail) => {
      errors[errorDetail.path[0]] = errorDetail.message;
      return errors;
    };

    error.details.reduce(reducer, errors);
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const partialSchema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, partialSchema);

    if (error) {
      return error.details[0].message;
    }

    return null;
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) {
      console.log(errors);
      return;
    }

    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    let data = { ...this.state.data };

    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) {
      errors[input.name] = errorMessage;
    } else {
      delete errors[input.name];
    }
    this.setState({ errors });
    _.set(data, input.name, input.value);
    this.setState({ data });
  };

  renderButton = label => {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  };

  renderInput = (name, property, label, type = "text", autoFocus = false) => {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[property]}
        label={label}
        autoFocus={autoFocus}
        error={errors[property]}
        onChange={this.handleChange}
      />
    );
  };

  renderSelectMenu = (
    name,
    items,
    label,
    value,
    valueProperty = "_id",
    labelProperty = "name"
  ) => {
    return (
      <SelectMenu
        name={name}
        label={label}
        value={value}
        items={items}
        valueProperty={valueProperty}
        labelProperty={labelProperty}
        onChange={this.handleChange}
      />
    );
  };
}

export default Form;
