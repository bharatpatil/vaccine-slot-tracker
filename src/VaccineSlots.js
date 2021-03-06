import React from "react";
import { VaccineDataContext } from "./VaccineDataContext";

const SlotsUi = ({ slots }) => {
  return (
    <ul>
      {slots &&
        slots.map &&
        slots.map((session, i) => {
          return (
            <li key={i}>
              <span style={{ color: "#0000ff" }}>
                {session.date} {session.name}, {session.block_name},{" "}
                {session.district_name}, {session.pincode},{" "}
              </span>
              <span>{session.vaccine}</span> -{" "}
              <span style={{ color: "#ff0080" }}>
                {session.available_capacity} slots
              </span>{" "}
              <span style={{ color: "#00cc00" }}>
                (Age limit {session.min_age_limit})
              </span>
            </li>
          );
        })}
    </ul>
  );
};

export const VaccineSlots = () => {
  const { state, setState } = React.useContext(VaccineDataContext);

  const {
    slots,
    startMonitoring,
    isFetching,
    countdown,
    lastChecked,
    isError,
    groupedSlots: { others, pincode },
  } = state;

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

      {!isError ? (
        <>
          {pincode && pincode.length > 0 && (
            <>
              <h2>Matching pincodes</h2>
              <SlotsUi slots={pincode} />
            </>
          )}
          {others && others.length > 0 && (
            <>
              <h2>Not matching pincodes</h2>
              <SlotsUi slots={others} />
            </>
          )}
        </>
      ) : (
        <p>
          {isError ? (
            <b style={{ color: "#ff0000" }}>Error fetching slots retrying...</b>
          ) : (
            <b style={{ color: "#ff0080" }}>No open slots are available.</b>
          )}
        </p>
      )}
    </div>
  );
};
