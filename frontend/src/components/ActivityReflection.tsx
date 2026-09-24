import type { Activity, ActivityReflection as ActivityReflectionData } from "../types/lesson";
import { Chip, Divider, Stack, Typography } from "@mui/material";

type ActivityReflectionProps = {
  activity: Activity;
  reflection: ActivityReflectionData;
};

export default function ActivityReflection({ activity, reflection }: ActivityReflectionProps) {
  return (
    <Stack spacing={1.5} sx={{ p: 2, borderRadius: 2, backgroundColor: "rgba(31, 92, 85, .06)" }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Typography variant="h6">{activity.name}</Typography>
        <Chip size="small" label={`${activity.duration_minutes} min`} color="primary" variant="outlined" />
      </Stack>
      <Typography color="text.secondary">{activity.instructions}</Typography>
      <Divider />
      <Typography variant="subtitle2">Notes</Typography>
      <Typography>{reflection.notes || "No notes recorded."}</Typography>
    </Stack>
  );
}
