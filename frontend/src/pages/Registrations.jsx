import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getRegistrations } from "../api/registrationApi";

function Registrations() {
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        let ignore = false;
        getRegistrations()
            .then((data) => {
                if (!ignore) {
                    setRegistrations(data.registrations || data || []);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <MainLayout>
            <h1>Registrations</h1>

            <br />

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Program</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(registrations || []).map((reg) => (
                            <tr key={reg.id}>
                                <td>{reg.id}</td>
                                <td>{reg.name}</td>
                                <td>{reg.email}</td>
                                <td>{reg.title}</td>
                                <td>{reg.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
}

export default Registrations;