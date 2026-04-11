import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "../admin/AdminRoute.jsx";
import PageLoader from "../componets/PageLoader.jsx";
import AdminProducts from "../admin/pages/AdminProducts.jsx";

const Home = lazy(() => import("../page/Home"));
const Layout = lazy(() => import("../layout/Layout"));
const ProductDetail = lazy(() => import("../page/ProductDetali"));
const Cart = lazy(() => import("../page/Cart"));
const Checkout = lazy(() => import("../page/Checkout"));
const Account = lazy(() => import("../page/Account"));
const About = lazy(() => import("../page/AboutPage"));
const AllProduct = lazy(() => import("../page/AllProduct"));
const Auth = lazy(() => import("../page/Auth"));
const AdminDashboard = lazy(() => import("../admin/layout/AdminLayout.jsx"));
const TrackOrder = lazy(() => import("../page/TrackOrder"));

//admin layz
const AdminProduct = lazy(() => import("../admin/pages/AdminProducts.jsx"));
const AdminCategory = lazy(()=> import("../admin/pages/AdminCategories.jsx"));
const AdminCreateProduct = lazy(()=> import("../admin/pages/AdminCreateProduct.jsx"));
const AdminOrders = lazy(()=> import("../admin/pages/AdminOrders.jsx"));
const AdminHome = lazy(()=> import("../admin/pages/AdminHome.jsx"));
const AdminUsers = lazy(()=> import("../admin/pages/AdminUsers.jsx"));
const AdminNewsletter = lazy(() => import("../admin/pages/AdminNewsletters.jsx"));
const AdminCoupons = lazy(()=> import("../admin/pages/AdminCoupons.jsx"))
const AdminSetting = lazy(()=> import("../admin/pages/AdminSettings.jsx"))


const repoName = import.meta.env.VITE_REPO_NAME || "";

const withLoader = (component) => (
  <Suspense fallback={<PageLoader />}>
    {component}
  </Suspense>
);

export const router = createBrowserRouter(
  [
    {
      path: `/`,
      element: withLoader(<Layout />),
      children: [
        { path: "/", element: (<Home />) },

        { path: "/product/:slug", element: withLoader(<ProductDetail />) },

        { path: "/allproduct", element: withLoader(<AllProduct />) },

        { path: "/about", element: withLoader(<About />) },

        {
          path: "/cart",
          element: withLoader(
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },

        {
          path: "/checkout",
          element: withLoader(
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          ),
        },

        {
          path: "/account",
          element: withLoader(
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          ),
        },

        {
          path: "/track-order/:orderNumber",
          element: withLoader(
            <ProtectedRoute>
              <TrackOrder />
            </ProtectedRoute>
          ),

        },
      ],
    },

    { path: "/auth", element: withLoader(<Auth />) },

    {
      path: "/admin",
      element: withLoader(
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      ),
       children: [

        {
          path: "/admin/products",
          element: withLoader(
  
          <AdminProducts />
          ),

        },
        {
          path: "/admin/categories",
          element: withLoader(
  
          <AdminCategory />
          ),

        },
        {
          path: "/admin/products/create",
          element: withLoader(
  
          <AdminCreateProduct />
          ),

        },
        {
          path: "/admin/orders",
          element: withLoader(
  
          <AdminOrders />
          ),

        },

         {
          path: "/admin/users",
          element: withLoader(
  
          <AdminUsers />
          ),

        },

         {
          path: "/admin/settings",
          element: withLoader(
  
          <AdminSetting />
          ),

        },

         {
          path: "/admin/coupons",
          element: withLoader(
  
          <AdminCoupons />
          ),

        },
        
         {
          path: "/admin/newsletters",
          element: withLoader(
  
          <AdminNewsletter />
          ),

        },

        {
          path: "/admin",
          element: withLoader(
  
          <AdminHome />
          ),

        },

       ],
    },
  ],
  { basename: `/${repoName}` }
);