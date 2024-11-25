import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HistoryRideForm from "../../components/Forms/HistoryRideForm";
import {
  Driver,
  fetchAllDrivers,
  fetchRideHistory,
  Ride,
} from "../../services/api";
import "./index.css";

const RideHistory: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [requestError, setRequestError] = useState<string>();
  const location = useLocation();

  const data = location.state as { customer_id: string };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetchAllDrivers();

      setDrivers(response);
    } catch {
      setRequestError(
        "Erro interno do servidor, por favor tente novamente mais tarde!"
      );
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchRides = async (
    customer_id: string,
    setRides: (rides: Ride[]) => void,
    setRequestError: (error: string | undefined) => void
  ) => {
    try {
      const response = await fetchRideHistory({
        customer_id,
      });

      setRides(response.rides);
    } catch {
      setRequestError(
        "Erro interno do servidor, por favor tente novamente mais tarde!"
      );
    }
  };

  useEffect(() => {
    fetchRides(data.customer_id, setRides, setRequestError);
  }, [data.customer_id]);

  return (
    <div className="app-container ride-history">
      <HistoryRideForm
        default_customer_id={data.customer_id}
        setRides={setRides}
        drivers={drivers}
      />

      <h2>Histórico de Viagem</h2>
      {requestError && <p className="history-error">{requestError}</p>}
      <div className="rides-container">
        {rides.map((ride) => (
          <div className="ride-card" key={ride.id}>
            <h3>{ride.driver.name}</h3>
            <p>
              <strong>Distância:</strong> {(ride.distance / 1000).toFixed(1)} km
            </p>
            <p>
              <strong>Duração:</strong> {ride.duration}
            </p>
            <p>
              <strong>Origem:</strong> {ride.origin}
            </p>
            <p>
              <strong>Destino:</strong> {ride.destination}
            </p>

            <p>
              <strong>Valor por km:</strong> R$ {ride.value.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> R${" "}
              {(ride.value * (ride.distance / 1000)).toFixed(2)}
            </p>
            <p>
              <strong>Horário:</strong> {formatDate(ride.date)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideHistory;
