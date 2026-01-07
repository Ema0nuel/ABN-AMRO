import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { isAdminAuthenticated } from "../auth/adminAuth";
import Header from "../../../components/admin/Header";
import SideBar from "../../../components/admin/SideBar";
import { LoadingSpinner } from "../../../components/Spinner";

// ============================================================================
// SVG ICONS
// ============================================================================

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const ApproveIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const RejectIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// ============================================================================
// UTILITY: Convert ISO string to local datetime string for input[type="datetime-local"]
// ============================================================================

const isoToLocalDatetime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const localDatetimeToISO = (localDatetime) => {
  if (!localDatetime) return null;
  return new Date(localDatetime).toISOString();
};

// ============================================================================
// FORM FIELD COMPONENTS
// ============================================================================

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans text-sm ${
        error
          ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
          : "border-secondary focus:ring-basic focus:ring-opacity-30"
      } ${
        disabled ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-primary"
      }`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const DateTimeField = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  helper = "",
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80 flex items-center gap-1">
      <ClockIcon />
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <input
      type="datetime-local"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans text-sm ${
        error
          ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
          : "border-secondary focus:ring-basic focus:ring-opacity-30"
      } ${
        disabled ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-primary"
      }`}
    />
    {helper && (
      <p className="text-xs text-secondary opacity-60 mt-1">{helper}</p>
    )}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  rows = 3,
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans text-sm resize-none ${
        error
          ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
          : "border-secondary focus:ring-basic focus:ring-opacity-30"
      } ${
        disabled ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-primary"
      }`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
  error,
  required = false,
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans text-sm ${
        error
          ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
          : "border-secondary focus:ring-basic focus:ring-opacity-30"
      } ${
        disabled ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-primary"
      }`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

// ============================================================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================================================

const CollapsibleSection = ({ title, icon, isOpen, onToggle, children }) => (
  <div className="border border-secondary rounded-sm overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-6 py-4 bg-secondary bg-opacity-5 hover:bg-opacity-10 flex items-center justify-between transition-all"
    >
      <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      <ChevronDownIcon
        className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    {isOpen && (
      <div className="px-6 py-4 bg-primary border-t border-secondary">
        {children}
      </div>
    )}
  </div>
);

// ============================================================================
// TRANSACTION FORM MODAL (Create/Edit) – ENHANCED
// ============================================================================

const TransactionFormModal = ({
  mode,
  transaction,
  accounts,
  onClose,
  onSubmit,
  submitting,
}) => {
  // Initialize formData with all fields including timestamps
  const [formData, setFormData] = useState({
    // Basic transaction info
    from_account_id: transaction?.from_account_id || "",
    to_account_id: transaction?.to_account_id || "",
    external_recipient_name: transaction?.external_recipient_name || "",
    external_recipient_iban: transaction?.external_recipient_iban || "",
    amount: transaction?.amount || "",
    currency: transaction?.currency || "USD",
    transaction_type: transaction?.transaction_type || "transfer",
    status: transaction?.status || "pending",
    description: transaction?.description || "",
    failure_reason: transaction?.failure_reason || "",

    // Timestamp fields (convert ISO to local datetime format)
    created_at: isoToLocalDatetime(transaction?.created_at),
    approved_at: isoToLocalDatetime(transaction?.approved_at),
    completed_at: isoToLocalDatetime(transaction?.completed_at),
  });

  const [errors, setErrors] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    accounts: true,
    timeline: false,
    preview: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.from_account_id)
      newErrors.from_account_id = "From account is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!formData.currency) newErrors.currency = "Currency is required";
    if (!formData.transaction_type)
      newErrors.transaction_type = "Transaction type is required";

    // Validate created_at is required
    if (!formData.created_at) newErrors.created_at = "Created date is required";

    // Validate timestamp ordering
    if (formData.created_at && formData.approved_at) {
      const createdTime = new Date(formData.created_at).getTime();
      const approvedTime = new Date(formData.approved_at).getTime();
      if (approvedTime < createdTime) {
        newErrors.approved_at = "Approved time must be after created time";
      }
    }

    if (formData.approved_at && formData.completed_at) {
      const approvedTime = new Date(formData.approved_at).getTime();
      const completedTime = new Date(formData.completed_at).getTime();
      if (completedTime < approvedTime) {
        newErrors.completed_at = "Completed time must be after approved time";
      }
    }

    if (formData.transaction_type === "transfer" && !formData.to_account_id) {
      newErrors.to_account_id = "To account is required for transfers";
    }

    if (
      formData.transaction_type === "external_transfer" &&
      !formData.external_recipient_iban
    ) {
      newErrors.external_recipient_iban =
        "Recipient IBAN is required for external transfers";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      created_at: localDatetimeToISO(formData.created_at),
      approved_at: formData.approved_at
        ? localDatetimeToISO(formData.approved_at)
        : null,
      completed_at: formData.completed_at
        ? localDatetimeToISO(formData.completed_at)
        : null,
    });
  };

  // Get account details for preview
  const fromAccount = accounts.find((a) => a.id === formData.from_account_id);
  const toAccount = accounts.find((a) => a.id === formData.to_account_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-3xl w-full max-h-[95vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-secondary">
            {mode === "create"
              ? "💳 Create New Transaction"
              : "✏️ Edit Transaction"}
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-secondary opacity-60 hover:opacity-100 transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ================================================================ */}
          {/* SECTION 1: TRANSACTION DETAILS */}
          {/* ================================================================ */}
          <CollapsibleSection
            title="Transaction Details"
            icon="📋"
            isOpen={expandedSections.details}
            onToggle={() => toggleSection("details")}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectField
                  label="Transaction Type"
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                  options={[
                    { value: "transfer", label: "Internal Transfer" },
                    { value: "external_transfer", label: "External Transfer" },
                    { value: "deposit", label: "Deposit" },
                    { value: "withdrawal", label: "Withdrawal" },
                    { value: "payment", label: "Payment" },
                    { value: "tax_refund", label: "Tax Refund (Credit)" },
                    {
                      value: "loan_disbursement",
                      label: "Loan Disbursement",
                    },
                    { value: "loan_repayment", label: "Loan Repayment" },
                  ]}
                  required
                  error={errors.transaction_type}
                />
                <FormField
                  label="Amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  error={errors.amount}
                />
                <SelectField
                  label="Currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  options={[
                    { value: "USD", label: "USD" },
                    { value: "EUR", label: "EUR" },
                    { value: "GBP", label: "GBP" },
                    { value: "CAD", label: "CAD" },
                    { value: "AUD", label: "AUD" },
                    { value: "NGN", label: "NGN" },
                  ]}
                  required
                  error={errors.currency}
                />
              </div>

              <TextAreaField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter transaction description (optional)"
                rows={2}
              />
            </div>
          </CollapsibleSection>

          {/* ================================================================ */}
          {/* SECTION 2: ACCOUNTS */}
          {/* ================================================================ */}
          <CollapsibleSection
            title="Accounts"
            icon="🏦"
            isOpen={expandedSections.accounts}
            onToggle={() => toggleSection("accounts")}
          >
            <div className="space-y-4">
              <SelectField
                label="From Account"
                name="from_account_id"
                value={formData.from_account_id}
                onChange={handleChange}
                options={accounts.map((acc) => ({
                  value: acc.id,
                  label: `${acc.account_number} (${acc.currency} ${acc.balance})`,
                }))}
                required
                error={errors.from_account_id}
              />

              {formData.transaction_type === "transfer" && (
                <SelectField
                  label="To Account"
                  name="to_account_id"
                  value={formData.to_account_id}
                  onChange={handleChange}
                  options={accounts
                    .filter((acc) => acc.id !== formData.from_account_id)
                    .map((acc) => ({
                      value: acc.id,
                      label: `${acc.account_number} (${acc.currency})`,
                    }))}
                  required
                  error={errors.to_account_id}
                />
              )}

              {formData.transaction_type === "external_transfer" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Recipient Name"
                    name="external_recipient_name"
                    value={formData.external_recipient_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                  <FormField
                    label="Recipient IBAN"
                    name="external_recipient_iban"
                    value={formData.external_recipient_iban}
                    onChange={handleChange}
                    placeholder="DE89370400440532013000"
                    error={errors.external_recipient_iban}
                  />
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* ================================================================ */}
          {/* SECTION 3: STATUS & TIMELINE */}
          {/* ================================================================ */}
          <CollapsibleSection
            title="Status & Timeline"
            icon="⏱️"
            isOpen={expandedSections.timeline}
            onToggle={() => toggleSection("timeline")}
          >
            <div className="space-y-4">
              <SelectField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "completed", label: "Completed" },
                  { value: "failed", label: "Failed" },
                  { value: "reversed", label: "Reversed" },
                  { value: "on_hold", label: "On Hold" },
                ]}
              />

              <DateTimeField
                label="Created At"
                name="created_at"
                value={formData.created_at}
                onChange={handleChange}
                required
                error={errors.created_at}
                helper="When this transaction was initiated"
              />

              <DateTimeField
                label="Approved At"
                name="approved_at"
                value={formData.approved_at}
                onChange={handleChange}
                error={errors.approved_at}
                helper="When an admin approved this transaction (optional)"
              />

              <DateTimeField
                label="Completed At"
                name="completed_at"
                value={formData.completed_at}
                onChange={handleChange}
                error={errors.completed_at}
                helper="When this transaction was completed (optional)"
              />

              {formData.status === "failed" && (
                <TextAreaField
                  label="Failure Reason"
                  name="failure_reason"
                  value={formData.failure_reason}
                  onChange={handleChange}
                  placeholder="Describe why this transaction failed..."
                  rows={2}
                  error={errors.failure_reason}
                />
              )}
            </div>
          </CollapsibleSection>

          {/* ================================================================ */}
          {/* SECTION 4: PREVIEW */}
          {/* ================================================================ */}
          <CollapsibleSection
            title="Transaction Preview"
            icon="👁️"
            isOpen={expandedSections.preview}
            onToggle={() => toggleSection("preview")}
          >
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                    Amount
                  </p>
                  <p className="font-bold text-lg text-basic">
                    {formData.currency}{" "}
                    {(parseFloat(formData.amount) || 0).toFixed(2)}
                  </p>
                </div>

                <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <p className="font-semibold text-secondary capitalize">
                    {formData.status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                    Type
                  </p>
                  <p className="font-semibold text-secondary capitalize">
                    {formData.transaction_type.replace("_", " ")}
                  </p>
                </div>

                <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                    From Account
                  </p>
                  <p className="font-semibold text-secondary">
                    {fromAccount?.account_number || "—"}
                  </p>
                </div>
              </div>

              {toAccount && (
                <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                    To Account
                  </p>
                  <p className="font-semibold text-secondary">
                    {toAccount.account_number}
                  </p>
                </div>
              )}

              {formData.created_at && (
                <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                    Created
                  </p>
                  <p className="font-semibold text-secondary">
                    {new Date(formData.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* ================================================================ */}
          {/* FORM ACTIONS */}
          {/* ================================================================ */}
          <div className="flex gap-3 pt-6 border-t border-secondary">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" /> Saving...
                </>
              ) : (
                <>{mode === "create" ? "✅ Create" : "💾 Update"} Transaction</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// APPROVAL MODAL
// ============================================================================

const ApprovalModal = ({
  transaction,
  accounts,
  onApprove,
  onReject,
  onCancel,
  submitting,
}) => {
  const fromAccount = accounts.find(
    (a) => a.id === transaction?.from_account_id
  );
  const toAccount = accounts.find((a) => a.id === transaction?.to_account_id);

  const isLoanTransaction = ["loan_disbursement", "loan_repayment"].includes(
    transaction?.transaction_type
  );
  const isCreditTransaction = ["tax_refund", "deposit"].includes(
    transaction?.transaction_type
  );
  const isDebitTransaction = [
    "withdrawal",
    "payment",
    "loan_repayment",
  ].includes(transaction?.transaction_type);

  const displayType = isCreditTransaction
    ? "CREDIT (Balance +)"
    : isDebitTransaction
    ? "DEBIT (Balance -)"
    : "TRANSFER";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-secondary mb-4">
          ✅ Approve Transaction?
        </h3>

        <div className="space-y-4 mb-6">
          <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
            <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
              Reference
            </p>
            <p className="font-mono font-semibold text-basic text-sm">
              {transaction?.reference_number}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                Amount
              </p>
              <p className="font-semibold text-basic">
                {transaction?.currency} {transaction?.amount?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                Type
              </p>
              <p className="font-semibold text-secondary capitalize text-sm">
                {displayType}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
              From Account
            </p>
            <p className="font-semibold text-secondary">
              {fromAccount?.account_number} ({fromAccount?.balance}{" "}
              {fromAccount?.currency})
            </p>
          </div>

          {toAccount && (
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                To Account
              </p>
              <p className="font-semibold text-secondary">
                {toAccount?.account_number} ({toAccount?.balance}{" "}
                {toAccount?.currency})
              </p>
            </div>
          )}

          {isLoanTransaction && (
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
              <p className="text-xs text-blue-800 font-semibold">
                ℹ️ Loan transactions are exempt from balance updates
              </p>
            </div>
          )}

          {isCreditTransaction && (
            <div className="bg-green-50 border border-green-200 rounded-sm p-3">
              <p className="text-xs text-green-800 font-semibold">
                ✓ Account balance will be CREDITED (+{transaction?.amount})
              </p>
            </div>
          )}

          {isDebitTransaction && !isLoanTransaction && (
            <div className="bg-orange-50 border border-orange-200 rounded-sm p-3">
              <p className="text-xs text-orange-800 font-semibold">
                ⚠️ Account balance will be DEBITED (-{transaction?.amount})
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onReject()}
            disabled={submitting}
            className="flex-1 py-2 px-4 bg-red-100 text-red-600 font-semibold rounded-sm hover:bg-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" /> Rejecting...
              </>
            ) : (
              <>
                <RejectIcon /> Reject
              </>
            )}
          </button>
          <button
            onClick={() => onApprove()}
            disabled={submitting}
            className="flex-1 py-2 px-4 bg-green-600 text-white font-semibold rounded-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" /> Approving...
              </>
            ) : (
              <>
                <ApproveIcon /> Approve
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DELETE CONFIRMATION MODAL
// ============================================================================

const DeleteConfirmModal = ({
  transaction,
  onConfirm,
  onCancel,
  submitting,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-secondary mb-4">
          🗑️ Delete Transaction
        </h3>
        <p className="text-secondary opacity-70 mb-6">
          Are you sure you want to permanently delete this transaction for{" "}
          <span className="font-semibold">
            {transaction?.currency} {transaction?.amount}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6">
          <p className="text-sm text-red-800">
            ⚠️ This will permanently remove the transaction from the database.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" /> Deleting...
              </>
            ) : (
              <>
                <TrashIcon /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN TRANSACTIONS PAGE
// ============================================================================

const TransactionsPage = () => {
  const navigate = useNavigate();

  // Auth & UI State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  // Data State
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [approvingTransaction, setApprovingTransaction] = useState(null);

  // Message State
  const [message, setMessage] = useState({ type: "", text: "" });

  // ============================================================================
  // AUTHENTICATION CHECK
  // ============================================================================

  useEffect(() => {
    const authenticated = isAdminAuthenticated();
    if (!authenticated) {
      navigate("/user/admin/auth/login", { replace: true });
      return;
    }

    setIsAuthenticated(true);
    const email = sessionStorage.getItem("admin_email") || "admin@example.com";
    setAdminEmail(email);
  }, [navigate]);

  // ============================================================================
  // FETCH TRANSACTIONS & ACCOUNTS
  // ============================================================================

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: txnData, error: txnError } = await supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false });

        if (txnError) throw txnError;

        const { data: accData, error: accError } = await supabase
          .from("accounts")
          .select("*")
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (accError) throw accError;

        setTransactions(txnData || []);
        setAccounts(accData || []);
      } catch (err) {
        console.error("[ADMIN_TRANSACTIONS] Fetch error:", err.message);
        setMessage({
          type: "error",
          text: `Failed to load transactions: ${err.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // ============================================================================
  // CREATE TRANSACTION
  // ============================================================================

  const handleCreateTransaction = async (formData) => {
    setSubmitting(true);
    try {
      const referenceNumber = `TXN-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      const { data, error } = await supabase.from("transactions").insert({
        from_account_id: formData.from_account_id,
        to_account_id: formData.to_account_id || null,
        external_recipient_name: formData.external_recipient_name || null,
        external_recipient_iban: formData.external_recipient_iban || null,
        amount: formData.amount,
        currency: formData.currency,
        transaction_type: formData.transaction_type,
        status: formData.status,
        description: formData.description || null,
        reference_number: referenceNumber,
        failure_reason: formData.failure_reason || null,
        created_at: formData.created_at,
        approved_at: formData.approved_at,
        completed_at: formData.completed_at,
        metadata: {
          created_by: "admin",
          initiated_at: new Date().toISOString(),
        },
      });

      if (error) throw error;

      setTransactions((prev) => [data[0], ...prev]);

      setMessage({
        type: "success",
        text: `✅ Transaction created! Ref: ${referenceNumber}`,
      });
      setShowCreateModal(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("[ADMIN_TRANSACTIONS] Create error:", err.message);
      setMessage({
        type: "error",
        text: `Failed to create transaction: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // UPDATE TRANSACTION
  // ============================================================================

  const handleUpdateTransaction = async (formData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          from_account_id: formData.from_account_id,
          to_account_id: formData.to_account_id || null,
          external_recipient_name: formData.external_recipient_name || null,
          external_recipient_iban: formData.external_recipient_iban || null,
          amount: formData.amount,
          currency: formData.currency,
          transaction_type: formData.transaction_type,
          status: formData.status,
          description: formData.description || null,
          failure_reason: formData.failure_reason || null,
          created_at: formData.created_at,
          approved_at: formData.approved_at,
          completed_at: formData.completed_at,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingTransaction.id);

      if (error) throw error;

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id
            ? {
                ...t,
                ...formData,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );

      setMessage({
        type: "success",
        text: "✅ Transaction updated successfully",
      });
      setEditingTransaction(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[ADMIN_TRANSACTIONS] Update error:", err.message);
      setMessage({
        type: "error",
        text: `Failed to update transaction: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // APPROVE TRANSACTION
  // ============================================================================

  const handleApproveTransaction = async () => {
    setSubmitting(true);
    try {
      const txn = approvingTransaction;
      const isLoanTransaction = [
        "loan_disbursement",
        "loan_repayment",
      ].includes(txn.transaction_type);
      const isCreditTransaction = ["tax_refund", "deposit"].includes(
        txn.transaction_type
      );

      const { error: txnError } = await supabase
        .from("transactions")
        .update({
          status: "completed",
          approved_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", txn.id);

      if (txnError) throw txnError;

      if (!isLoanTransaction) {
        const fromAccount = accounts.find((a) => a.id === txn.from_account_id);

        if (fromAccount) {
          let newBalance = fromAccount.balance;

          if (isCreditTransaction) {
            newBalance =
              parseFloat(fromAccount.balance) + parseFloat(txn.amount);
          } else {
            newBalance =
              parseFloat(fromAccount.balance) - parseFloat(txn.amount);
          }

          const { error: accError } = await supabase
            .from("accounts")
            .update({
              balance: newBalance,
              available_balance: newBalance,
              updated_at: new Date().toISOString(),
            })
            .eq("id", txn.from_account_id);

          if (accError) throw accError;

          setAccounts((prev) =>
            prev.map((acc) =>
              acc.id === txn.from_account_id
                ? { ...acc, balance: newBalance, available_balance: newBalance }
                : acc
            )
          );
        }
      }

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === txn.id
            ? {
                ...t,
                status: "completed",
                approved_at: new Date().toISOString(),
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );

      setMessage({
        type: "success",
        text: `✅ Transaction approved! ${
          isLoanTransaction ? "(Loan - balance unchanged)" : ""
        }`,
      });
      setApprovingTransaction(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("[ADMIN_TRANSACTIONS] Approve error:", err.message);
      setMessage({
        type: "error",
        text: `Failed to approve transaction: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // REJECT TRANSACTION
  // ============================================================================

  const handleRejectTransaction = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          status: "failed",
          failure_reason: "Rejected by admin during approval",
          updated_at: new Date().toISOString(),
        })
        .eq("id", approvingTransaction.id);

      if (error) throw error;

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === approvingTransaction.id
            ? {
                ...t,
                status: "failed",
                failure_reason: "Rejected by admin during approval",
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );

      setMessage({
        type: "success",
        text: "✅ Transaction rejected successfully",
      });
      setApprovingTransaction(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[ADMIN_TRANSACTIONS] Reject error:", err.message);
      setMessage({
        type: "error",
        text: `Failed to reject transaction: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // DELETE TRANSACTION
  // ============================================================================

  const handleDeleteTransaction = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", deletingTransaction.id);

      if (error) throw error;

      setTransactions((prev) =>
        prev.filter((t) => t.id !== deletingTransaction.id)
      );

      setMessage({
        type: "success",
        text: "✅ Transaction deleted successfully",
      });
      setDeletingTransaction(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[ADMIN_TRANSACTIONS] Delete error:", err.message);
      setMessage({
        type: "error",
        text: `Failed to delete transaction: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // SEARCH & FILTER
  // ============================================================================

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.amount?.toString().includes(searchQuery);

    const matchesFilter = filterStatus === "all" || txn.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getAccountNumber = (accountId) => {
    const acc = accounts.find((a) => a.id === accountId);
    return acc?.account_number || "Unknown";
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <Header
        adminEmail={adminEmail}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        {/* Sidebar */}
        <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-2">
                💳 Transaction Management
              </h1>
              <p className="text-sm text-secondary opacity-70">
                Create, edit, approve, and manage all transactions with full
                timestamp control
              </p>
            </div>

            {/* Message Alert */}
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-sm border-l-4 ${
                  message.type === "success"
                    ? "bg-green-50 border-green-500 text-green-800"
                    : "bg-red-50 border-red-500 text-red-800"
                }`}
              >
                <p className="text-sm font-semibold">{message.text}</p>
              </div>
            )}

            {/* Controls Section */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary opacity-60">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search by reference, description, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm bg-primary"
              >
                <option value="all">All Transactions</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="reversed">Reversed</option>
                <option value="on_hold">On Hold</option>
              </select>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95 whitespace-nowrap"
              >
                <PlusIcon />
                <span>Create Transaction</span>
              </button>
            </div>

            {/* Transactions Table/Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="bg-primary border border-secondary rounded-sm p-12 text-center">
                <p className="text-secondary opacity-70">
                  No transactions found
                </p>
              </div>
            ) : (
              <div className="bg-primary border border-secondary rounded-sm shadow-md overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary bg-opacity-5 border-b border-secondary">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Reference
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          From Account
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Approved
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                      {filteredTransactions.map((txn) => (
                        <tr
                          key={txn.id}
                          className="hover:bg-secondary hover:bg-opacity-5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm text-basic font-semibold">
                              {txn.reference_number}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary opacity-70">
                            {getAccountNumber(txn.from_account_id)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-basic">
                              {txn.currency} {txn.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary opacity-70">
                            <span className="capitalize">
                              {txn.transaction_type.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                txn.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : txn.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : txn.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {txn.status === "completed" && <CheckIcon />}
                              {txn.status === "failed" && <XIcon />}
                              {txn.status.charAt(0).toUpperCase() +
                                txn.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-secondary opacity-70">
                            {formatDateTime(txn.created_at)}
                          </td>
                          <td className="px-6 py-4 text-xs text-secondary opacity-70">
                            {formatDateTime(txn.approved_at)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {txn.status === "pending" && (
                                <button
                                  onClick={() => setApprovingTransaction(txn)}
                                  className="p-2 hover:bg-green-100 rounded-sm transition-all text-green-600"
                                  title="Approve transaction"
                                >
                                  <ApproveIcon />
                                </button>
                              )}
                              {txn.status !== "completed" && (
                                <button
                                  onClick={() => setEditingTransaction(txn)}
                                  className="p-2 hover:bg-basic hover:bg-opacity-10 rounded-sm transition-all"
                                  title="Edit transaction"
                                >
                                  <EditIcon />
                                </button>
                              )}
                              <button
                                onClick={() => setDeletingTransaction(txn)}
                                className="p-2 hover:bg-red-500 hover:bg-opacity-10 rounded-sm transition-all text-red-600"
                                title="Delete transaction"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-secondary">
                  {filteredTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="p-4 hover:bg-secondary hover:bg-opacity-5 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-mono font-semibold text-basic text-sm">
                            {txn.reference_number}
                          </p>
                          <p className="text-xs text-secondary opacity-60 mt-1">
                            {txn.description || "No description"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            txn.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : txn.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : txn.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {txn.status.charAt(0).toUpperCase() +
                            txn.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div>
                          <p className="text-secondary opacity-60">Amount</p>
                          <p className="font-semibold text-basic">
                            {txn.currency} {txn.amount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary opacity-60">Type</p>
                          <p className="font-semibold text-secondary capitalize">
                            {txn.transaction_type.replace("_", " ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary opacity-60">From</p>
                          <p className="font-semibold text-secondary">
                            {getAccountNumber(txn.from_account_id)}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary opacity-60">Created</p>
                          <p className="font-semibold text-secondary">
                            {new Date(txn.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-secondary">
                        {txn.status === "pending" && (
                          <button
                            onClick={() => setApprovingTransaction(txn)}
                            className="flex-1 py-2 px-3 text-xs font-semibold bg-green-100 text-green-600 rounded-sm hover:bg-green-200 transition-all flex items-center justify-center gap-1"
                          >
                            <ApproveIcon /> Approve
                          </button>
                        )}
                        {txn.status !== "completed" && (
                          <button
                            onClick={() => setEditingTransaction(txn)}
                            className="flex-1 py-2 px-3 text-xs font-semibold border border-secondary text-secondary rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all flex items-center justify-center gap-1"
                          >
                            <EditIcon /> Edit
                          </button>
                        )}
                        <button
                          onClick={() => setDeletingTransaction(txn)}
                          className="flex-1 py-2 px-3 text-xs font-semibold bg-red-100 text-red-600 rounded-sm hover:bg-red-200 transition-all flex items-center justify-center gap-1"
                        >
                          <TrashIcon /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics Footer */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-xs text-secondary opacity-60 mb-2 uppercase tracking-wider font-semibold">
                  Total Transactions
                </p>
                <p className="text-3xl font-bold text-basic">
                  {transactions.length}
                </p>
              </div>

              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-xs text-secondary opacity-60 mb-2 uppercase tracking-wider font-semibold">
                  Pending Approval
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {transactions.filter((t) => t.status === "pending").length}
                </p>
              </div>

              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-xs text-secondary opacity-60 mb-2 uppercase tracking-wider font-semibold">
                  Completed
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {transactions.filter((t) => t.status === "completed").length}
                </p>
              </div>

              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-xs text-secondary opacity-60 mb-2 uppercase tracking-wider font-semibold">
                  Failed
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {transactions.filter((t) => t.status === "failed").length}
                </p>
              </div>

              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-xs text-secondary opacity-60 mb-2 uppercase tracking-wider font-semibold">
                  Total Amount
                </p>
                <p className="text-xl font-bold text-basic">
                  {transactions
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <TransactionFormModal
          mode="create"
          transaction={null}
          accounts={accounts}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTransaction}
          submitting={submitting}
        />
      )}

      {editingTransaction && (
        <TransactionFormModal
          mode="edit"
          transaction={editingTransaction}
          accounts={accounts}
          onClose={() => setEditingTransaction(null)}
          onSubmit={handleUpdateTransaction}
          submitting={submitting}
        />
      )}

      {approvingTransaction && (
        <ApprovalModal
          transaction={approvingTransaction}
          accounts={accounts}
          onApprove={handleApproveTransaction}
          onReject={handleRejectTransaction}
          onCancel={() => setApprovingTransaction(null)}
          submitting={submitting}
        />
      )}

      {deletingTransaction && (
        <DeleteConfirmModal
          transaction={deletingTransaction}
          onConfirm={handleDeleteTransaction}
          onCancel={() => setDeletingTransaction(null)}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
