
/**
 * ActivityEditor module
 *
 * Provides the `ActivityEditor` React component which renders editable inputs
 * for a single lesson activity. It accepts an `activity` object and an
 * `onChange` handler which is called with the updated `Activity` when fields
 * change.
 */
import type { Activity } from "../types/lesson";
import { Stack, TextField } from "@mui/material";


type ActivityProp = {
  activity: Activity;
  onChange: (activity: Activity) => void
};

export default function ActivityEditor({ activity, onChange }: ActivityProp) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label="Activity name"
        value={activity.name}
        onChange={e => onChange({ ...activity, name: e.target.value })}
      />
      <TextField
        label="Minutes"
        type="number"
        value={activity.duration_minutes}
        slotProps={{ htmlInput: { min: 1 } }}
        onChange={e => onChange({ ...activity, duration_minutes: Number(e.target.value) })}
        sx={{ minWidth: { sm: 130 } }}
      />
      <TextField
        fullWidth
        label="Instructions"
        value={activity.instructions}
        onChange={e => onChange({ ...activity, instructions: e.target.value })}
      />
    </Stack>
  )
}