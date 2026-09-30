import { useState } from "react";
import InputField from "../InputField/InputField.jsx";



function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login data:", formData);

  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>

        <h2>Login</h2>

        <InputField
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <InputField
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;