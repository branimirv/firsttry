import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

const AuthCard = ({ title, description, children }: AuthCardProps) => {
  return (
    <div className="flex-1 flex pt-[120px]">
      <Card className="w-full max-w-md mx-auto border p-4 rounded-md self-start">
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {description && <div className="mb-4">{description}</div>}
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCard;
