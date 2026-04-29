import { AVAILABILITY_META } from "../utils/availability.js";

const ITEMS = ["yes", "maybe", "no"];

export default function AvailabilityLegend() {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {ITEMS.map((item) => (
        <span
          key={item}
          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${AVAILABILITY_META[item].className}`}
        >
          {AVAILABILITY_META[item].emoji} {AVAILABILITY_META[item].badge}
        </span>
      ))}
    </div>
  );
}

