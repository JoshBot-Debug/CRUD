import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";

import { green, blue, red } from "@mui/material/colors";
import { ChartsReferenceLine } from "@mui/x-charts";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

interface Data {
  year: number;
  meanNDVI: number;
  meanNDWI: number;
  fireFraction: number;
}

interface Props {
  selected: Data;
  data: Array<Data>;
}

function AOSToSOA(data: Props["data"]) {
  return {
    year: data.map((r) => r.year),
    meanNDVI: data.map((r) => r.meanNDVI),
    meanNDWI: data.map((r) => r.meanNDWI),
    fireFraction: data.map((r) => r.fireFraction),
  };
}

export default function AnalysisChart(props: Props) {
  const theme = useTheme();
  const data = AOSToSOA(props.data);

  const colorPalette = [green[500], blue[500], red[500]];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Annual Environmental Indices Trends
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Trend for the last {data.year.length - 1} year(s)
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          highlightedItem={{ seriesId: 2 }}
          xAxis={[
            {
              scaleType: "point",
              data: data.year,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: "NDVI",
              label: "Normalized Difference Vegetation Index",
              data: data.meanNDVI,
              showMark: false,
              curve: "linear",
            },
            {
              id: "NDWI",
              label: "Normalized Difference Water Index",
              data: data.meanNDWI,
              showMark: false,
              curve: "linear",
            },
            {
              id: "Fire",
              label: "Fire Probability",
              data: data.fireFraction,
              showMark: false,
              curve: "linear",
              area: true,
            },
          ]}
          height={250}
          grid={{ horizontal: true }}
          hideLegend={false}
        >
          <ChartsReferenceLine
            x={props.selected.year}
            lineStyle={{
              stroke: theme.palette.grey[300],
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
            label={props.selected.year.toString()}
            labelAlign="start"
            labelStyle={{
              ...(theme.typography.subtitle2 as any),
              color: theme.palette.text.disabled,
            }}
          />
          <AreaGradient color={theme.palette.primary.dark} id="organic" />
          <AreaGradient color={theme.palette.primary.main} id="referral" />
          <AreaGradient color={theme.palette.primary.light} id="direct" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
