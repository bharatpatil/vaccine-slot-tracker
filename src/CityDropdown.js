import React from "react";
import { cities } from "./data";
import { VaccineDataContext } from "./VaccineDataContext";

export const CityDropdown = () => {
  const { state, setState } = React.useContext(VaccineDataContext);

  const onSelectChange = (e) => {
    let value = Array.from(e.target.selectedOptions, (option) => option.value);
    setState({ cities: value });
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
        Selected {selectedCities.length > 1 ? "Cities" : "City"}:{" "}
        {selectedCities.join(" | ")}
      </p>
    </div>
  );
};
