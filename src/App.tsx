/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import HomeV2 from "./pages/HomeV2";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import { PageTransition, PageTransitionVeil } from "./components/PageTransition";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Versión de producción: la variante dither, ganadora entre las
            comparadas en /v2/*. Este repo (a diferencia de la copia de
            trabajo local) no lleva las otras variantes ni la home vieja —
            es el que se despliega. */}
        <Route path="/" element={<><PageTransitionVeil /><HomeV2 heroVariant="dither" /></>} />

        <Route
          path="/privacy-policy"
          element={
            <>
              <PageTransitionVeil />
              <PageTransition>
                <PrivacyPolicy />
              </PageTransition>
            </>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={
            <>
              <PageTransitionVeil />
              <PageTransition>
                <TermsConditions />
              </PageTransition>
            </>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
