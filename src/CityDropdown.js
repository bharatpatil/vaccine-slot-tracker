import React from "react";
import { cities } from "./data";
import { VaccineDataContext } from "./VaccineDataContext";

export const CityDropdown = () => {
  const { state, setState } = React.useContext(VaccineDataContext);

  const onSelectChange = (e) => {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    setState({ cities: value });
  };

  const onPincodeChange = (e) => {
    let val = e.target.value.trim();

    setState({ pincodeTextField: val });
  };

  const selectedCities = cities
    .filter((cityObj) => state.cities.includes(cityObj.id))
    .map((cityObj) => cityObj.cityName);

  return (
    <div>
      <select
        name="city"
        id="city"
        multiple
        value={state.cities}
        onChange={onSelectChange}
      >
        {cities.map(({ id, cityName }) => (
          <option key={id} value={id}>
            {cityName}
          </option>
        ))}
      </select>
      <p>
        <span style={{ color: "#ff0080" }}>
          Selected {selectedCities.length > 1 ? "Cities" : "City"}:{" "}
        </span>
        {selectedCities.join(" | ")}
      </p>
      <p>
        Specific Pincodes (e.g. 411033,411001):{" "}
        <input
          style={{ width: 400 }}
          type="text"
          value={state.pincodeTextField}
          onChange={onPincodeChange}
        />
        <br />
        <span>
          Your entered pincodes:{" "}
          {state.pincodeToFilter.length
            ? state.pincodeToFilter.join(", ")
            : "nothing"}
        </span>
        <br />
        <span>(Note: only valid pincodes are considered. If no pincodes are entered then it will show results of all pincodes.)</span>
      </p>
    </div>
  );
};
