import React from 'react';
import styled from "styled-components";

const StyledSelect = styled.select`
  max-width: 150px;
  height: 100%;
  padding: 0.5rem;
  margin-left: 10px;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  //margin-bottom: 1rem;
`;

const StyledOption = styled.option`
  color: ${(props) => (props.selected ? "lightyellow" : "#fff")} !important;
`;

const StyledLabel = styled.label`
  margin-bottom: 1rem;
`;

export default function Dropdown(props) {
  return (
    <div action={props.action}>
      {/* <StyledLabel htmlFor="services">
        {props.formLabel}
      </StyledLabel> */}
      <StyledSelect id="services" name="services" onChange={props.onChange}>
        {props.children}
      </StyledSelect>
    </div>
  );
}

export function Option(props) {
  return (
    <StyledOption selected={props.selected}>
      {props.value}
    </StyledOption>
  );
}
