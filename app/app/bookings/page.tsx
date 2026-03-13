import Plan from "./plan";

export default async function RootPage() {
  // await getRequiredUser();
  return (
    <div className="w-full h-full flex-1 overflow-hidden">
      <Plan />
    </div>
  );
}