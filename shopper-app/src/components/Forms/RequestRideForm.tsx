import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { estimateRide } from "../../services/api";

const schema = yup.object().shape({
  customer_id: yup.string().required("ID do cliente é obrigatório"),
  origin: yup.string().required("Endereço de origem é obrigatório"),
  destination: yup
    .string()
    .required("Endereço de destino é obrigatório")
    .notOneOf([yup.ref("origin")], "Origem e destino devem ser diferentes"),
});

const RequestRideForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: {
    customer_id: string;
    origin: string;
    destination: string;
  }) => {
    setLoading(true);
    setRequestError(undefined);
    try {
      const response = await estimateRide(data);
      navigate("/options", {
        state: {
          ...response,
          customer_id: data.customer_id,
          origin_name: data.origin,
          destination_name: data.destination,
        },
      });
    } catch {
      setLoading(false);
      setRequestError(
        "Erro interno do servidor, por favor tente novamente mais tarde!"
      );
    }
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
        <label>Origem</label>
        <input
          className={errors?.origin && "input-error"}
          type="text"
          placeholder="Digite o identificador"
          {...register("origin", { required: true })}
        />
        {errors?.origin && (
          <p className="error-message">{errors.origin?.message}</p>
        )}
      </div>

      <div className="form-group">
        <label>Destino</label>
        <input
          className={errors?.destination && "input-error"}
          type="text"
          placeholder="Digite o identificador"
          {...register("destination", { required: true })}
        />
        {errors?.destination && (
          <p className="error-message">{errors.destination?.message}</p>
        )}
      </div>

      <div className="form-group">
        {requestError && (
          <p style={{ textAlign: "center" }} className="error-message">
            {requestError}
          </p>
        )}
        <button onClick={() => handleSubmit(onSubmit)()}>
          {loading ? "Carregando..." : "Estimar Valores"}
        </button>
      </div>
    </div>
  );
};

export default RequestRideForm;
