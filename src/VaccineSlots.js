import React from "react";
import { VaccineDataContext } from "./VaccineDataContext";

export const VaccineSlots = () => {
  const { state, setState } = React.useContext(VaccineDataContext);

  const { slots, startMonitoring, isFetching, countdown, lastChecked } = state;

  const onStartMonitoring = () => {
    setState({ startMonitoring: !startMonitoring });
  };

  return (
    <div>
      <button type="button" onClick={onStartMonitoring}>
        <span>{startMonitoring ? "Stop" : "Start Monitoring"}</span>
      </button>

      {isFetching ? (
        <p>'Checking slots...'</p>
      ) : startMonitoring ? (
        <p>
          {lastChecked && (
            <span>
              Last checked at {lastChecked} <br />
            </span>
          )}
          Checking again in: {countdown} seconds
        </p>
      ) : (
        <p></p>
      )}

      {slots.length > 0 ? (
        <ul>
          {slots.map((slot, i) => {
            return slot?.sessions.map((session, i) => {
              return (
                <li key={i}>
                  {session.date} {session.name}, {session.block_name},{" "}
                  {session.district_name}, {session.pincode},{" "}
                  <span style={{ color: "#00cc00" }}>{session.vaccine}</span> -{" "}
                  <span style={{ color: "#ff0080" }}>
                    {session.available_capacity} slots
                  </span>{" "}
                  <span>(Age limit {session.min_age_limit})</span>
                </li>
              );
            });
          })}
        </ul>
      ) : (
        <p>
          <b>No open slots are available.</b>
        </p>
      )}
    </div>
  );
};
