import { Card } from "../ui/card";
import { Input } from "@/components/ui/input";

export const Settings = () => {
  return (
    <Card className="flex flex-col p-10 gap-8 w-2/3 h-2/3">
      <div className="flex items-center gap-10 w-full justify-center">
        <Input className="w-fit" placeholder="test@gmail.com" disabled />
        <Input className="w-fit" placeholder="test@gmail.com" disabled />
      </div>
    </Card>
  );
};
