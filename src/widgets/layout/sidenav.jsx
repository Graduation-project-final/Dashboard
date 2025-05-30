import PropTypes from "prop-types";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { toast } from "react-toastify";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const userRole = localStorage.getItem("userRole")?.trim();
  const navigate = useNavigate();
  const location = useLocation();

  const businessPaths = [
    "/service-business",
    "/all-business-service",
    "/update-business",
    "/review&replay",
  ];

  const adminPaths = [
    "/home",
    "/users",
    "/business",
    "/all-service",
    "/message",
    "/all-reviews",
    "/report",
    "/product",
    "/product-review",
  ];

  const handleLogout = () => {
    localStorage.clear();

    navigate("/dashboard/sign-in");

    toast.success(`Logout successfully`);
  };

  const isSignInPage = location.pathname === "/dashboard/sign-in";

  if (isSignInPage) {
    return null;
  }

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className={`relative`}>
        <div className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "teal"}
          >
            {brandName}
          </Typography>
        </div>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "amber"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages
              .filter(({ path }) => {
                const isAdminPath = adminPaths.includes(path);
                const isBusinessPath = businessPaths.includes(path);

                if (userRole === "admin") {
                  return isAdminPath;
                } else if (userRole === "business") {
                  return isBusinessPath;
                }

                return false;
              })
              .map(({ icon, name, path }) => (
                <li key={name}>
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={
                          isActive
                            ? sidenavColor
                            : sidenavType === "dark"
                            ? "white"
                            : "teal"
                        }
                        className="flex items-center gap-4 px-4 capitalize"
                        fullWidth
                      >
                        {icon}
                        <Typography
                          color="inherit"
                          className="font-medium capitalize"
                        >
                          {name}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                </li>
              ))}
          </ul>
        ))}
      </div>
      {/* Logout Button */}
      <div className="m-4">
        <Button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 -mt-1 rounded hover:bg-red-600 w-full"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "RateMate",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;
