/**
 * ActivityEditor module
 *
 * Provides the `ActivityEditor` React component which renders editable inputs
 * for a single lesson activity. It accepts an `activity` object and an
 * `onChange` handler which is called with the updated `Activity` when fields
 * change.
 */
import type { Activity } from "../types/lesson";


type ActivityProp = {
    activity: Activity;
    onChange: (activity: Activity) => void
};

export default function ActivityEditor({activity, onChange}: ActivityProp) {
    return (
        <div>
            <li>
                <input type="text" 
                value={activity.name}
                onChange={e => onChange({...activity, name: e.target.value})}/>

                <input type="number" 
                value={activity.duration_minutes}
                onChange={e => onChange({...activity, duration_minutes: Number(e.target.value)})}/>

                <input type="text" 
                value={activity.instructions}
                onChange={e => onChange({...activity, instructions: e.target.value})}/>
            </li>
        </div>
    )
}