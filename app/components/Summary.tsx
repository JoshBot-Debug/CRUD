import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PercentRounded from "@mui/icons-material/PercentRounded";
import { formatMoney, toWords } from "~/helper";
import MoneyField from "./MoneyField";
import Divider from "@mui/material/Divider";
import type { NumberFormatValues } from "react-number-format";

interface Props {
  taxableAmount: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  deliveryCharge: number;
  deliveryTaxPercent: number;

  onDeliveryChargeChange?: (e: NumberFormatValues) => void;
  onDeliveryTaxPercentChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Summary(props: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
      <Typography variant="h6">Summary</Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Delivery Tax % and Amount
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Delivery tax percent" arrow placement="top">
            <Box>
              <TextField
                name="deliveryTaxPercent"
                type="number"
                disabled={!props.deliveryCharge}
                value={props.deliveryTaxPercent}
                sx={{ maxWidth: 90 }}
                onChange={props.onDeliveryTaxPercentChange}
                slotProps={{
                  htmlInput: {
                    sx: { textAlign: "center" },
                  },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Tooltip>

          <Tooltip title="Delivery charge" arrow placement="top">
            <Box>
              <MoneyField
                name="deliveryCharge"
                value={props.deliveryCharge}
                sx={{ maxWidth: 150 }}
                onChange={props.onDeliveryChargeChange}
                slotProps={{
                  htmlInput: { sx: { textAlign: "end" } },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <Typography sx={{ display: "flex", justifyContent: "space-between" }}>
        Taxable Amount
        <span>{formatMoney(props.taxableAmount)}</span>
      </Typography>

      <Typography sx={{ display: "flex", justifyContent: "space-between" }}>
        GST
        <span>{formatMoney(props.taxAmount)}</span>
      </Typography>

      <Typography sx={{ display: "flex", justifyContent: "space-between" }}>
        Total Discount
        <span>{formatMoney(props.discount)}</span>
      </Typography>

      <Divider />

      <Typography sx={{ display: "flex", justifyContent: "space-between" }}>
        <b>Total</b>
        <span style={{ marginLeft: "auto" }}>
          {formatMoney(props.totalAmount)}
        </span>
      </Typography>

      {props.totalAmount > 0 && (
        <Typography>
          <b>Total amount in words:</b> Rupees{" "}
          {toWords.convert(props.totalAmount)}
        </Typography>
      )}
    </Box>
  );
}
