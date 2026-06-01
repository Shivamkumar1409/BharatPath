import React, { useEffect, useState } from "react";
import axios from "axios";

const SmartAlerts = () => {

    const [alerts, setAlerts] = useState([]);

    useEffect(() => {

        axios
            .get("http://127.0.0.1:8000/smart-alerts/Delhi")
            .then((response) => {

                setAlerts(response.data.alerts);

            })
            .catch((error) => {

                console.log(error);

            });

    }, []);

    return (

        <div
            style={{
                background: "#fff3cd",
                padding: "20px",
                borderRadius: "15px",
                margin: "20px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
        >

            <h2 style={{ color: "#856404" }}>
                🌦️ Smart Weather Alerts
            </h2>

            {alerts.map((alert, index) => (

                <div
                    key={index}
                    style={{
                        background: "white",
                        padding: "10px",
                        marginTop: "10px",
                        borderRadius: "10px",
                        fontWeight: "bold"
                    }}
                >
                    {alert}
                </div>

            ))}

        </div>

    );
};

export default SmartAlerts;