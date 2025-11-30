export const GSTTextInputProps = {
  pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
  maxLength: 15,
  title: "Enter a valid 15-character GSTIN (e.g. 22AAAAA0000A1Z5)",
  style: { textTransform: "uppercase" },
};

export const TANTextInputProps = {
  pattern: "^[A-Za-z]{4}[0-9]{5}[A-Za-z]$",
  maxLength: 10,
  minLength: 10,
  title:
    "TAN must be 10 characters: 4 letters, 5 digits, and 1 letter (e.g. DELM12345K)",
  style: { textTransform: "uppercase" },
};

export const PincodeTextInputProps = {
  pattern: "^[1-9][0-9]{5}$",
  maxLength: 6,
  minLength: 6,
  title: "Enter a valid 6-digit Indian PIN code (e.g. 560001)",
  inputMode: "numeric",
};

export const EmailTextInputProps = {
  type: "email",
  pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,}$",
  title: "Enter a valid email address (e.g. name@example.com)",
  inputMode: "email",
  style: { textTransform: "lowercase" },
};

export const MobileTextInputProps = {
  pattern: "^[6-9][0-9]{9}$",
  maxLength: 10,
  minLength: 10,
  title:
    "Enter a valid 10-digit Indian mobile number starting with 6-9 (e.g. 9876543210)",
  inputMode: "numeric",
};
