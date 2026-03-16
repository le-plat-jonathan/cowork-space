import Plan from "./plan";
import { getSpacesWithCurrentAvailability } from "@/features/spaces/space";

export default async function RootPage() {
  const spaces = await getSpacesWithCurrentAvailability();
  return (
    <div className="w-full h-full flex-1 overflow-hidden relative">
      <Plan spaces={spaces} />
    </div>
  );
}