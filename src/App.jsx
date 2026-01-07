import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TranslateWidget from "./utils/TranslateWidget";

// pages
import { HomePage } from "./pages/main/portal/Home";
import { InnerPage } from "./pages/main/portal/InnerPage";
import { LoginPage } from "./pages/main/auth/Login";
import { SignupPage } from "./pages/main/auth/Signup";
import { ForgotPasswordPage } from "./pages/main/auth/Forgot";
import { ResetPasswordPage } from "./pages/main/auth/Reset";
import { DashboardPage } from "./pages/main/user/Dashboard";
import { TransferPage } from "./pages/main/user/Transfer";
import { StatementPage } from "./pages/main/user/Statement";
import { AddMoneyPage } from "./pages/main/user/AddMoney";
import { BuyAirtimePage } from "./pages/main/user/BuyAirtime";
import { UserDetailsPage } from "./pages/main/user/UserDetails";
import { LoanPage } from "./pages/main/user/Loan";
import { CardsPage } from "./pages/main/user/Cards";
import { TaxRefundPage } from "./pages/main/user/TaxRefund";
import { KYCPage } from "./pages/main/user/Kyc";
import { AdminLoginPage } from "./pages/admin/auth/Login";
import Dashboard from "./pages/admin/main/Dashboard";
import UsersPage from "./pages/admin/main/User";
import TransactionsPage from "./pages/admin/main/Transactions";
import UserDetailPage from "./pages/admin/main/UserDetail";
import LoansPage from "./pages/admin/main/Loan";
import CodesPage from "./pages/admin/main/Codes";
import EmailsPage from "./pages/admin/main/Emails";
import NotFoundPage from "./pages/admin/main/NotFound";
import { ContactPage } from "./pages/main/portal/Contact";

const App = () => {
  // Add inside your useEffect hook (in App.jsx)

  return (
    <BrowserRouter>
      {/* Global Translate Widget */}
      <TranslateWidget />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Inner Pages - Dynamic Routing */}
        <Route path="/:slug" element={<InnerPage />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

        {/* User Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transfer" element={<TransferPage />} />
        <Route path="/statements" element={<StatementPage />} />
        <Route path="/add-money" element={<AddMoneyPage />} />
        <Route path="/buy-airtime" element={<BuyAirtimePage />} />
        <Route path="/account-details" element={<UserDetailsPage />} />
        <Route path="/loan" element={<LoanPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/tax-refund" element={<TaxRefundPage />} />
        <Route path="/dashboard/kyc" element={<KYCPage />} />

        {/* Admin Auth Path */}
        <Route path="/user/admin/auth/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/user/:id" element={<UserDetailPage />} />
        <Route path="/admin/transactions" element={<TransactionsPage />} />
        <Route path="/admin/loans" element={<LoansPage />} />
        <Route path="/admin/codes" element={<CodesPage />} />
        <Route path="/admin/emails" element={<EmailsPage />} />

        {/* 404 Page */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
