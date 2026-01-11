import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import ProfilePage from "./pages/ProfilePage";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import { ToastContainer } from "react-toastify";

// import { useRef, useEffect } from 'react';
import { register } from "swiper/element/bundle";

register();
// Import Swiper React components

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import './styles.css';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { event, EVENTS } from "./event";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";

// import { CheckoutProvider } from '@stripe/react-stripe-js/checkout';
// import { loadStripe } from '@stripe/stripe-js';

// const stripe_pk = `pk_test_51So5iLFN0LBgeq2lvYl5z8dkSkw7NOKM18mQMENjdWqoKSqiwwqQMUzJfUH1PAkLrvPkywFZ6Wd3nVJf37EH1osC00frDbyBcV`;

// const stripePromise = loadStripe(stripe_pk);
const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigateToLogin = () => {
      navigate("/login");
    };

    event.on(EVENTS.NAVIGATE_TO_LOGIN, handleNavigateToLogin);

    return () => {
      event.off(EVENTS.NAVIGATE_TO_LOGIN, handleNavigateToLogin);
    };
  }, [navigate]);

  // const promise = useMemo(() => {
  //   return fetch('/create-checkout-session', {
  //     method: 'POST',
  //   })
  //     .then((res) => res.json())
  //     .then((data) => data.clientSecret);
  // }, []);

  // const appearance = {
  //   theme: 'stripe',
  // };

  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider className="">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* <CheckoutProvider stripe={stripePromise} options={{
            clientSecret: promise,
            elementsOptions: { appearance },
          }}> */}

            <ThemeProvider theme={theme}>
              <ToastContainer
                position="bottom-right"
                closeOnClick
                autoClose={5000}
                newestOnTop={false}
                hideProgressBar={false}
                draggable
                pauseOnHover
              />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<IndexPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/account" element={<ProfilePage />} />
                  <Route path="/account/places" element={<PlacesPage />} />
                  <Route
                    path="/account/places/new"
                    element={<PlacesFormPage />}
                  />
                  <Route
                    path="/account/places/:id"
                    element={<PlacesFormPage />}
                  />
                  <Route path="/places/:id" element={<PlacePage />} />
                  <Route path="/account/bookings" element={<BookingsPage />} />
                  <Route path="/account/bookings/:id" element={<BookingPage />} />
                </Route>
              </Routes>
            </ThemeProvider>
          {/* </CheckoutProvider> */}
        </LocalizationProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;
