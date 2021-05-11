import React, { useEffect } from "react";
import { useRaf, useSetState, useWindowSize } from "react-use";
import groupBy from "lodash/groupBy";

export const CHECK_SLOTS_EVERY_SECONDS = 60;

export const VaccineDataContext = React.createContext();

function getData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((resp) => resp.json())
      .then(
        (data) => resolve(data),
        (error) => reject(error)
      );
  });
}

export const apiUrlTemplate = (distId, checkDate) =>
  `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${distId}&date=${checkDate}`;

const initialState = {
  startDate: new Date()
    .toLocaleDateString("en-IN")
    .replace("/", "-")
    .replace("/", "-"),
  cities: [],
  shouldBeep: true,
  startBipping: false,
  startMonitoring: false,
  isFetching: false,
  countdown: 0,
  slots: [],
  groupedSlots: {},
  lastChecked: "",
  pincodeToFilter: [],
  pincodeTextField: "",
  isError: false,
  age18: true,
  age45: false,
};

const getInitialData = () => {
  try {
    return {
      ...initialState,
      ...JSON.parse(window.localStorage.getItem("vti.data")),
      countdown: 0,
      startBipping: false,
    };
  } catch (exp) {
    return initialState;
  }
};

const setDataToLocalStorage = ({
  cities,
  shouldBeep,
  pincodeToFilter,
  pincodeTextField,
  age18,
  age45,
}) => {
  try {
    window.localStorage.setItem(
      "vti.data",
      JSON.stringify({
        cities,
        shouldBeep,
        pincodeToFilter,
        pincodeTextField,
        age18,
        age45,
      })
    );
  } catch (exp) {
    return initialState;
  }
};

export const VaccineProvider = (props) => {
  const countDownTimerRef = React.useRef();

  const [state, setState] = useSetState(getInitialData);

  React.useEffect(() => {
    return stopCountDown;
  }, []);

  React.useEffect(() => {
    startMonitoring();
  }, [state.startMonitoring, state.countdown]);

  React.useEffect(() => {
    setDataToLocalStorage(state);
  }, [
    state.cities,
    state.shouldBeep,
    state.pincodeToFilter,
    state.pincodeTextField,
    state.age18,
    state.age45,
  ]);

  React.useEffect(() => {
    const arrPincode = state.pincodeTextField
      ?.split(",")
      .map((pincode) => {
        const pc = parseInt(pincode.trim());
        if (!isNaN(pc)) {
          return pc;
        }
      })
      .filter((pc) => pc) // filter undefined
      .filter((pc) => `${pc}`.length === 6); // pincode length is 6
    setState({ pincodeToFilter: arrPincode });
  }, [state.pincodeTextField]);

  // generate grouped slots
  React.useEffect(() => {
    getSlotByPincodeGroup();
  }, [state.slots, state.pincodeToFilter, state.age18, state.age45]);

  const startCountDown = () => {
    countDownTimerRef.current = setInterval(() => {
      setState((prevState) => ({
        countdown: prevState.countdown - 1,
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

        Promise.all(responses).then(
          (cityCalendar) => {
            const slotsWithoutPinCodeFilter = cityCalendar
              .map((slot) => slot.sessions)
              .filter((arr) => arr.length > 0)
              .reduce((val, acc) => (acc = [...acc, ...val]), []);

            setState({
              slots: slotsWithoutPinCodeFilter,
              isFetching: false,
              countdown:
                window.CHECK_SLOTS_EVERY_SECONDS || CHECK_SLOTS_EVERY_SECONDS,
              lastChecked: new Date().toLocaleTimeString(),
              isError: false,
            });
            startCountDown();
          },
          () => {
            setState({
              slots: [],
              isFetching: false,
              countdown:
                window.CHECK_SLOTS_EVERY_SECONDS || CHECK_SLOTS_EVERY_SECONDS,
              lastChecked: new Date().toLocaleTimeString(),
              isError: true,
            });
            startCountDown();
          }
        );
      }
    } else {
      stopCountDown();
      setState({ countdown: 0 });
    }
  };

  const getSlotByPincodeGroup = () => {
    const groupedSlots = groupBy(
      state.slots.filter(
        (session) =>
          ((state.age18 && session.min_age_limit === 18) ||
            (state.age45 && session.min_age_limit === 45)) &&
          session.available_capacity > 0
      ),
      (session) => {
        if (state.pincodeToFilter.length === 0 || !session.pincode) {
          return "others";
        }
        if (state.pincodeToFilter.includes(session.pincode)) {
          return "pincode";
        }
        return "others";
      }
    );

    setState({ groupedSlots });
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
