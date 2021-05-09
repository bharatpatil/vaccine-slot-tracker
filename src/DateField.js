import React from "react";
import { VaccineDataContext } from "./VaccineDataContext";

export const DateField = () => {
  const { state, setState } = React.useContext(VaccineDataContext);

  const onDateChange = (e) => {
    setState({ startDate: e.target.value });
  };

  return (
    <input
      type="text"
      id="date"
      name="date"
      value={state.startDate}
      onChange={onDateChange}
      style={{ width: 80 }}
    />
  );
};
