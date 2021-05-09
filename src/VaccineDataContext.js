import React, { useEffect } from "react";
import { useRaf, useSetState, useWindowSize } from "react-use";

export const VaccineDataContext = React.createContext();

function getData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        resolve(data);
      });
  });
}

export const apiUrlTemplate = (distId, checkDate) =>
  `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${distId}&date=${checkDate}`;

export const VaccineProvider = (props) => {
  const countDownTimerRef = React.useRef();

  const [state, setState] = useSetState({
    startDate: new Date()
      .toLocaleDateString("en-IN")
      .replace("/", "-")
      .replace("/", "-"),
    cities: [],
    shouldBeep: true,
    startBipping: false,
    startMonitoring: false,
    isFetching: false,
    monitorIntervalMilliseconds: 60000,
    countdown: 0,
    slots: [],
    lastChecked: ""
  });

  React.useEffect(() => {
    return stopCountDown;
  }, []);

  React.useEffect(() => {
    startMonitoring();
  }, [state.startMonitoring, state.countdown]);

  const startCountDown = () => {
    countDownTimerRef.current = setInterval(() => {
      setState((prevState) => ({
        countdown: prevState.countdown - 1
      }));
    }, 1000);
  };

  const stopCountDown = () => {
    clearInterval(countDownTimerRef.current);
  };

  const startMonitoring = () => {
    if (state.startMonitoring) {
      if (state.cities.length === 0) {
        alert("Please select city");
        stopCountDown();
        setState({ startMonitoring: false });
        return;
      }

      if (state.countdown === 0) {
        console.log("starting");
        stopCountDown();
        setState({ isFetching: true });
        const responses = [];
        state.cities.forEach((city) => {
          const date = getStartDate();
          for (let i = 0; i < 7; i++) {
            const dateStr = date
              .toLocaleDateString("en-IN")
              .replace("/", "-")
              .replace("/", "-");
            const apiUrl = apiUrlTemplate(city, dateStr);
            responses.push(getData(apiUrl));
            date.setDate(date.getDate() + 1);
          }
        });

        Promise.all(responses).then((cityCalendar) => {
          setState({
            slots: cityCalendar
              .map((slot) => ({
                sessions: slot.sessions.filter(
                  (session) =>
                    session.min_age_limit === 18 &&
                    session.available_capacity > 0
                )
              }))
              .filter((slot) => slot.sessions.length > 0),
            isFetching: false,
            countdown: 60,
            lastChecked: new Date().toLocaleTimeString()
          });
          startCountDown();
        });
      }
    } else {
      stopCountDown();
      setState({ countdown: 0 });
    }
  };

  const getStartDate = () => {
    const dateParts = state.startDate.split("-");
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
  };

  return (
    <VaccineDataContext.Provider value={{ state, setState }}>
      {props.children}
    </VaccineDataContext.Provider>
  );
};
