import React from "react";
import { useNavigate } from "react-router-dom";
import shopper from "../../assets/shopper.png";

const Logo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        cursor: "pointer",
      }}
      onClick={() => navigate("/")}
    >
      <img
        src={shopper}
        alt="logo"
        style={{
          height: "40px",
          width: "auto",
        }}
      />
    </div>
  );
};

export default Logo;
