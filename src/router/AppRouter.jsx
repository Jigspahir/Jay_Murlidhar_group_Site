import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layout
import MainLayout from "../layouts/MainLayout";

// Main pages
import Home from "../pages/Home";
import About from "../pages/About";
import Ecosystem from "../pages/Ecosystem";
import Solutions from "../pages/Solutions";
import Projects from "../pages/Projects";
import Careers from "../pages/Careers";
import CareersJobs from "../pages/CareersJobs";
import CareersInternships from "../pages/CareersInternships";
import Contact from "../pages/Contact";

// Domain pages
import Technology from "../pages/domains/Technology";
import Finance from "../pages/domains/Finance";
import Insurance from "../pages/domains/Insurance";
import BusinessServices from "../pages/domains/BusinessServices";
import Infrastructure from "../pages/domains/Infrastructure";
import Travel from "../pages/domains/Travel";
import TradeExport from "../pages/domains/TradeExport";
import Retail from "../pages/domains/Retail";

// Company pages
import JayMurlidharComputer from "../pages/businesses/JayMurlidharComputer";
import JayMurlidharTechSolutions from "../pages/businesses/JayMurlidharTechSolutions";
import JayMurlidharFinance from "../pages/businesses/JayMurlidharFinance";
import JayMurlidharInsurance from "../pages/businesses/JayMurlidharInsurance";
import JayMurlidharBusinessServices from "../pages/businesses/JayMurlidharBusinessServices";
import JayMurlidharInfra from "../pages/businesses/JayMurlidharInfra";
import JayMurlidharTours from "../pages/businesses/JayMurlidharTours";
import JayMurlidharTradeSolutions from "../pages/businesses/JayMurlidharTradeSolutions";
import JayMurlidharExports from "../pages/businesses/JayMurlidharExports";
import JayMurlidharMobile from "../pages/businesses/JayMurlidharMobile";

// Error page
import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>

      {/* =====================================================
          MAIN WEBSITE (Wrapped in MainLayout)
      ===================================================== */}

      <Route element={<MainLayout />}>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Group & Story */}
        <Route path="/about" element={<About />} />

        {/* Dedicated Ecosystem Explorer */}
        <Route
          path="/ecosystem"
          element={<Ecosystem />}
        />

        {/* Solutions & ERP Showcase */}
        <Route
          path="/solutions"
          element={<Solutions />}
        />

        {/* Portfolio & Deployments */}
        <Route
          path="/projects"
          element={<Projects />}
        />

        {/* Careers & Engineering Culture */}
        <Route
          path="/careers"
          element={<Careers />}
        />
        <Route
          path="/careers/jobs"
          element={<CareersJobs />}
        />
        <Route
          path="/careers/internships"
          element={<CareersInternships />}
        />

        {/* Direct Contact */}
        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* =================================================
            BUSINESS DOMAINS
        ================================================= */}

        <Route
          path="/technology"
          element={<Technology />}
        />

        <Route
          path="/finance"
          element={<Finance />}
        />

        <Route
          path="/insurance"
          element={<Insurance />}
        />

        <Route
          path="/business-services"
          element={<BusinessServices />}
        />

        <Route
          path="/infrastructure"
          element={<Infrastructure />}
        />

        <Route
          path="/travel"
          element={<Travel />}
        />

        <Route
          path="/trade-export"
          element={<TradeExport />}
        />

        <Route
          path="/retail"
          element={<Retail />}
        />


        {/* =================================================
            COMPANY PAGES
        ================================================= */}

        <Route
          path="/technology/jay-murlidhar-computer"
          element={<JayMurlidharComputer />}
        />

        <Route
          path="/technology/jay-murlidhar-tech-solutions"
          element={<JayMurlidharTechSolutions />}
        />

        <Route
          path="/finance/jay-murlidhar-finance"
          element={<JayMurlidharFinance />}
        />

        <Route
          path="/insurance/jay-murlidhar-insurance"
          element={<JayMurlidharInsurance />}
        />

        <Route
          path="/business-services/jay-murlidhar-business-services"
          element={<JayMurlidharBusinessServices />}
        />

        <Route
          path="/infrastructure/jay-murlidhar-infra"
          element={<JayMurlidharInfra />}
        />

        <Route
          path="/travel/jay-murlidhar-tours"
          element={<JayMurlidharTours />}
        />

        <Route
          path="/trade-export/jay-murlidhar-trade-solutions"
          element={<JayMurlidharTradeSolutions />}
        />

        <Route
          path="/trade-export/jay-murlidhar-exports"
          element={<JayMurlidharExports />}
        />

        <Route
          path="/retail/jay-murlidhar-mobile-accessories"
          element={<JayMurlidharMobile />}
        />


        {/* =================================================
            LEGACY REDIRECT
            Business Services was previously under Technology.
        ================================================= */}

        <Route
          path="/technology/jay-murlidhar-business-services"
          element={
            <Navigate
              to="/business-services/jay-murlidhar-business-services"
              replace
            />
          }
        />

        {/* Additional alias redirects for URL robustness */}
        <Route
          path="/trade"
          element={<Navigate to="/trade-export" replace />}
        />
        <Route
          path="/trade/jay-murlidhar-trade"
          element={<Navigate to="/trade-export/jay-murlidhar-trade-solutions" replace />}
        />
        <Route
          path="/trade/jay-murlidhar-trade-solutions"
          element={<Navigate to="/trade-export/jay-murlidhar-trade-solutions" replace />}
        />
        <Route
          path="/trade/jay-murlidhar-exports"
          element={<Navigate to="/trade-export/jay-murlidhar-exports" replace />}
        />
        <Route
          path="/retail/jay-murlidhar-mobile"
          element={<Navigate to="/retail/jay-murlidhar-mobile-accessories" replace />}
        />


        {/* =================================================
            404
        ================================================= */}

        <Route
          path="/404"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Route>

    </Routes>
  );
}
