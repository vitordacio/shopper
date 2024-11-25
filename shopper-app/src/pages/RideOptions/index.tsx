import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import {
  confirmRide,
  Driver,
  TripEstimationResponse,
} from "../../services/api";

const RideOptions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requestError, setRequestError] = useState<string>();

  const data = location.state as TripEstimationResponse;

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&markers=color:green|label:A|${data.origin.latitude},${data.origin.longitude}&markers=color:red|label:B|${data.destination.latitude},${data.destination.longitude}&path=${data.origin.latitude},${data.origin.longitude}|${data.destination.latitude},${data.destination.longitude}&key=${GOOGLE_API_KEY}`;

  const handleChooseDriver = async (driver: Driver) => {
    setRequestError(undefined);

    try {
      await confirmRide({
        customer_id: data.customer_id,
        origin: data.origin_name,
        destination: data.destination_name,
        distance: data.distance,
        duration: data.duration,
        driver: {
          id: driver.id.toString(),
          name: driver.name,
        },
        value: driver.value,
      });

      navigate("/history", {
        state: {
          customer_id: data.customer_id,
        },
      });
    } catch {
      setRequestError(
        "Erro interno do servidor, por favor tente novamente mais tarde!"
      );
    }
  };

  return (
    <div className="app-container ride-options">
      <h1>Opções de Viagem</h1>

      <div className="map-container">
        <img src={mapUrl} alt="Mapa com a rota da viagem" />
        <p>
          <strong>Distância:</strong> {(data.distance / 1000).toFixed(1)} km |
          <strong> Duração:</strong> {data.duration}
        </p>
      </div>

      <h2>Motoristas Disponíveis</h2>
      {requestError && <p className="select-driver-error">{requestError}</p>}
      <div className="driver-container">
        {data.options.map((driver) => (
          <div className="driver-card" key={driver.id}>
            <h3>{driver.name}</h3>
            <p>
              <strong>Descrição:</strong> {driver.description}
            </p>
            <p>
              <strong>Veículo:</strong> {driver.vehicle}
            </p>
            <p>
              <strong>Avaliação:</strong> {driver.review.rating} estrelas - "
              {driver.review.comment}"
            </p>
            <p>
              <strong>Valor por km:</strong> R$ {driver.value.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> R${" "}
              {(driver.value * (data.distance / 1000)).toFixed(2)}
            </p>

            <button onClick={() => handleChooseDriver(driver)}>Escolher</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideOptions;
