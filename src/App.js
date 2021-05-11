import React from "react";
import { Beep } from "./Beep";
import { CityDropdown } from "./CityDropdown";
import { DateField } from "./DateField";
import "./styles.css";
import { VaccineProvider } from "./VaccineDataContext";
import { VaccineSlots } from "./VaccineSlots";

export default function App() {
  return (
    <VaccineProvider>
      <div>
        <p>
          Inspired by{" "}
          <a target="_blank" href="https://pranavmehta.github.io/1844vaccine/">
            https://pranavmehta.github.io/1844vaccine/
          </a>
          <br />
          <sub>This is re-written in reactjs just for fun ♥️</sub>
        </p>
        <p style={{ maxWidth: 600 }}>
          This bot periodically checks the Cowin portal for available
          vaccination slots every 60 seconds and alerts with an audible beep if
          an open slot is found.
        </p>
         <span>To use this bot,</span>
        <ul>
          <li>select one or more cities,</li>
          <li>click "Start monitoring"</li>
          <li>keep it running in a browser tab</li>
        </ul>
        <p>
          Start date: <DateField /> (dd-mm-yyyy, checks for upto 7 days from
          this date)
        </p>
        <CityDropdown />
        <Beep />
        <VaccineSlots />
      </div>
    </VaccineProvider>
  );
}
