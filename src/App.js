import "./styles.css";
import axios from "axios";
import tbClient from "thingsboard-js-sdk";
import { useState } from "react";

const client = new tbClient({
  host: "thingsboard.cloud",
  username: "gowthampractise@gmail.com",
  password: "Entlogics@0112"
});
function firstDayOfWeek(dateObject, firstDayOfWeekIndex) {
  const dayOfWeek = dateObject.getDay(),
    firstDayOfWeek = new Date(dateObject),
    diff =
      dayOfWeek >= firstDayOfWeekIndex
        ? dayOfWeek - firstDayOfWeekIndex
        : 6 - dayOfWeek;

  firstDayOfWeek.setDate(dateObject.getDate() - diff);
  firstDayOfWeek.setHours(0, 0, 0, 0);

  return firstDayOfWeek;
}
const now = firstDayOfWeek(new Date(), 1).getTime();
const timeseries = {
  entityId: "f5564590-6ce0-11ee-b4ac-570318c78832",
  keys: ["energyConsumption", "cost"],
  limit: 500,
  interval: 600000,
  startTs: now,
  endTs: Date.now(),
  useStrictDataTypes: true
};

const connect = async (callback) => {
  const token = await client.connect();
  console.log(client);
  const disconnectStatus = await client.disconnect();
  console.log(token);
  console.log(disconnectStatus);
  callback();
};
try {
  const params = {
    pageSize: 1000,
    page: 0,
    sortProperty: "name",
    sortOrder: "ASC"
  };
  connect(async function () {
    let devices = await client.getTenantDevices(params, function (devices) {
      console.log(devices);
    });
    // await client.getTimeseries(timeseries, function (devices) {
    //   console.log(devices);
    // });
    const socketsParams = {
      entityId: "f5564590-6ce0-11ee-b4ac-570318c78832",
      cmdId: 10 //websocket id
    };
    let keys = await client.subscribe(socketsParams, function (data) {
      console.log(data);
    });
  });
} catch (err) {}

// console.log(thingsBoardApi);

export default function App() {
  const [timeseries, setTimeseries] = useState(null);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
