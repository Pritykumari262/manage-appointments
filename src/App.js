import { useState, useEffect, useCallback } from "react";
import { BiArchive, BiCalendarPlus, BiTrash } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/Addappointment";
import AppointmentInfo from "./components/Appointmentinfo";

function App() {
  let [appointmentList, setAppointmentList] = useState([]);
  let [query, setQuery] = useState("");
  let [sortBy, setSortBy] = useState("petName");
  let [orderBy, setOrderBy] = useState("asc");

  const filteredAppointments = appointmentList.filter((item) => {
    return (
      item.petName.toLowerCase().includes(query.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      item.aptNotes.toLowerCase().includes(query.toLowerCase())
    );
  });

  filteredAppointments.sort((a, b) => {
  let order = (orderBy === 'asc') ? 1 : -1;
  return (
    a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
      ? -1 * order : 1 * order
  )
});

  const fetchData = useCallback(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        setAppointmentList(data);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5XL">
        <BiArchive className="inline-block text-red-400 align-top" /> Your
        Appointments
      </h1>
      <AddAppointment
        onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])}
        lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
      />
      <div className="flex justify-between items-center mb-3">
        <Search query={query} onQueryChange={(myQuery) => setQuery(myQuery)} 
        onOrderByChange={mySort => setOrderBy(mySort)}
        sortBy={sortBy}
        onSortByChange={mySort => setSortBy(mySort)}/>
        <BiCalendarPlus className="inline-block text-red-400 align-top" />
        <BiTrash className="inline-block text-purple-500 align-top" />
      </div>
      <ul className="divide-y divide-grey-200">
        {filteredAppointments.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={(appointmentId) =>
              setAppointmentList(
                appointmentList.filter(
                  (appointment) => appointment.id !== appointmentId
                )
              )
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
