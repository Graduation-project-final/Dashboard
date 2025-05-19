import React, { useState } from "react";
import {
  Input,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/admin-login",
        {
          email,
          password,
        },
      );

      const { token, role } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);

      if (role === "admin") {
        navigate("/dashboard/home");
      } else {
        navigate("/dashboard/service-business");
      }
      toast.success(`Welcome back ${role}`);
    } catch (err) {
      setError("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 -ml-80">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left side with form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <Typography
              variant="h3"
              className="font-bold text-blue-gray-800 mb-2"
            >
              Welcome Back!
            </Typography>
            <Typography variant="paragraph" className="text-blue-gray-600">
              Sign in to access your dashboard
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Typography
                  variant="small"
                  className="font-medium text-blue-gray-800 mb-1"
                >
                  Email Address
                </Typography>
                <Input
                  size="lg"
                  placeholder="name@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="!border-blue-gray-200 focus:!border-gray-900"
                  labelProps={{
                    className: "hidden",
                  }}
                />
              </div>

              <div>
                <Typography
                  variant="small"
                  className="font-medium text-blue-gray-800 mb-1"
                >
                  Password
                </Typography>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    size="lg"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="!border-blue-gray-200 focus:!border-gray-900 pr-10"
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                  <IconButton
                    variant="text"
                    size="sm"
                    className="!absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-blue-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-blue-gray-500" />
                    )}
                  </IconButton>
                </div>
              </div>
            </div>

            {error && (
              <Typography color="red" className="text-sm">
                {error}
              </Typography>
            )}

            <Button type="submit" className="w-full mt-2 bg-teal-600" size="lg">
              Sign In
            </Button>
          </form>
        </div>

        {/* Right side with image */}
        <div className="w-full md:w-1/2  hidden md:flex items-center justify-center p-8">
          <div className="text-white text-center">
            <img
              src="https://img.freepik.com/free-vector/flat-feedback-concept-illustrated_23-2148946028.jpg?ga=GA1.1.674192113.1745719925&semt=ais_hybrid&w=740"
              alt="Login illustration"
              className="w-full h-auto max-w-md mx-auto rounded-xl"
            />
            <Typography variant="h4" className="font-bold mt-6">
              Efficient Service Management
            </Typography>
            <Typography variant="paragraph" className="mt-2 opacity-90">
              Streamline your business operations with our powerful dashboard
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
