import React, { useState, useEffect } from "react";
import AddPlace from "./AddPlace";
import { BackendUrl } from "../BackendUrl"; // adjust path if needed


const Home = (props) => {
  const [totalApprovedAmount, setTotalApprovedAmount] = useState(0);

  useEffect(() => {
    const fetchApprovedTotal = async () => {
      try {
        const response = await fetch(`${BackendUrl}/api/bookings/`);
        if (!response.ok) return;
        const data = await response.json();
        const total = data
          .filter(booking => booking.status === "approved")
          .reduce((sum, booking) => sum + Number(booking.price), 0);
        setTotalApprovedAmount(total);
      } catch (e) {
        setTotalApprovedAmount(0);
      }
    };
    fetchApprovedTotal();
  }, []);

  return (
    <div className="p-5 mt-5"> {/* 👈 Added margin-top here */}
        <div>
          <AddPlace />
        </div>

    </div>
  )
}

export default Home
