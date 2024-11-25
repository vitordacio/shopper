import RequestRideForm from "../../components/Forms/RequestRideForm";
import "./index.css";

const RequestRide: React.FC = () => {
  return (
    <div className="app-container ride-request">
      <h1>Solicitar Viagem</h1>
      <RequestRideForm />
    </div>
  );
};

export default RequestRide;
