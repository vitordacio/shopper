import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { Driver, fetchRideHistory, Ride } from "../../services/api";

const schema = yup.object().shape({
  customer_id: yup.string().required("ID do cliente é obrigatório"),
  driver_id: yup.string().optional(),
});

interface HistoryFormProps {
  default_customer_id: string;
  setRides: React.Dispatch<React.SetStateAction<Ride[]>>;
  drivers: Driver[];
}

const HistoryRideForm: React.FC<HistoryFormProps> = ({
  setRides,
  default_customer_id,
  drivers,
}) => {
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { customer_id: default_customer_id },
  });

  const onSubmit = async (data: {
    customer_id: string;
    driver_id?: string;
  }) => {
    setLoading(true);
    setRequestError(undefined);
    try {
      const response = await fetchRideHistory(data);
      console.log("response", response);
      setRides(response.rides);
    } catch (err) {
      setLoading(false);
      setRides([]);

      const error = err as {
        response?: {
          data?: { error_code?: string; error_description?: string };
        };
      };
      setRequestError(
        error.response?.data?.error_code === "NO_RIDES_FOUND"
          ? error.response.data.error_description || "Erro desconhecido"
          : "Erro interno do servidor, por favor tente novamente mais tarde!"
      );
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="form-group">
        <label>Identificador do Usuário</label>
        <input
          className={errors?.customer_id && "input-error"}
          type="text"
          placeholder="Digite o identificador"
          {...register("customer_id", { required: true })}
        />
        {errors?.customer_id && (
          <p className="error-message">{errors.customer_id?.message}</p>
        )}
      </div>

      <div className="form-group">
        <label>Motoristas</label>
        <select
          className={errors?.driver_id && "input-error"}
          defaultValue=""
          {...register("driver_id", { required: false })}
        >
          <option value="">Todos</option>
          {drivers &&
            drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
        </select>

        {errors?.driver_id && (
          <p className="error-message">{errors.customer_id?.message}</p>
        )}
      </div>

      <div className="form-group">
        {requestError && (
          <p style={{ textAlign: "center" }} className="error-message">
            {requestError}
          </p>
        )}
        <button onClick={() => handleSubmit(onSubmit)()}>
          {loading ? "Carregando..." : "Buscar"}
        </button>
      </div>
    </div>
  );
};

export default HistoryRideForm;
