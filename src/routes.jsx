import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

import { Home, Profile, Tables } from "@/pages/dashboard";
import Users from "@/pages/dashboard/Users";
import Business from "@/pages/dashboard/Business";
import AllService from "@/pages/dashboard/AllService";
import Message from "@/pages/dashboard/Message";
import AllReview from "@/pages/dashboard/AllReview";
import BusinessService from "@/pages/dashboard/BusinessService";
import AllBusinessService from "@/pages/dashboard/AllBusinessService";
import ReviewAndReplay from "@/pages/dashboard/ReviewAndReplay";
import UpdateService from "./pages/dashboard/UpdateService";
import Report from "./pages/dashboard/Report";
import Product from "./pages/dashboard/Product";
import ProductReview from "./pages/dashboard/ProductReview";
import { SignIn } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

const routeIconMap = {
  dashboard: <HomeIcon {...icon} />,
  users: <UserCircleIcon {...icon} />,
  business: <TableCellsIcon {...icon} />,
  "all service": <InformationCircleIcon {...icon} />,
  message: <ChatBubbleLeftIcon {...icon} />,
  "all reviews": <DocumentTextIcon {...icon} />,
  "business service": <TableCellsIcon {...icon} />,
  "all business service": <RectangleStackIcon {...icon} />,
  "review and replay": <InformationCircleIcon {...icon} />,
  logout: <ArrowRightOnRectangleIcon {...icon} />,
  report: <ServerStackIcon {...icon} />,
  product: <TableCellsIcon {...icon} />,
  productReview: <DocumentTextIcon {...icon} />, // ✅ NEW icon entry
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: routeIconMap.dashboard,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: routeIconMap.users,
        name: "users",
        path: "/users",
        element: <Users />,
      },
      {
        icon: routeIconMap.business,
        name: "business",
        path: "/business",
        element: <Business />,
      },
      {
        icon: routeIconMap.product,
        name: "product",
        path: "/product",
        element: <Product />,
      },
      {
        icon: routeIconMap.productReview,
        name: "product review",
        path: "/product-review",
        element: <ProductReview />,
      },
      {
        icon: routeIconMap["all service"],
        name: "all service",
        path: "/all-service",
        element: <AllService />,
      },
      {
        icon: routeIconMap.report,
        name: "report",
        path: "/report",
        element: <Report />,
      },
      {
        icon: routeIconMap.message,
        name: "message",
        path: "/message",
        element: <Message />,
      },
      {
        icon: routeIconMap["all reviews"],
        name: "all reviews",
        path: "/all-reviews",
        element: <AllReview />,
      },
      {
        icon: routeIconMap["business service"],
        name: "business service",
        path: "/service-business",
        element: <BusinessService />,
      },
      {
        icon: routeIconMap["all business service"],
        name: "business service",
        path: "/all-business-service",
        element: <AllBusinessService />,
      },
      {
        icon: routeIconMap["all business service"],
        name: "update service",
        path: "/update-business",
        element: <UpdateService />,
      },
      {
        icon: routeIconMap["review and replay"],
        name: "review and replay",
        path: "/review&replay",
        element: <ReviewAndReplay />,
      },
      {
        icon: routeIconMap.logout,
        name: "logout",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
    ],
  },
];

export default routes;
