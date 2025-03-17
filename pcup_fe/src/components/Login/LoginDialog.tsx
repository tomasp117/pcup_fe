import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserCircle } from "lucide-react";
import { useUser } from "@/Contexts/UserContext";

export const LoginDialog = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5056/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Neplatné přihlašovací údaje.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
      setUser({ username: decodedToken.unique_name, role: decodedToken.role });

      setIsOpen(false);
    } catch (error) {
      setError("Chyba při připojení k serveru.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <UserCircle className="min-h-10 min-w-10" />
          {!isCollapsed && <span className="text-lg">Přihlášení</span>}
        </Button>
      </DialogTrigger>

      <DialogContent className=" sm:w-[350px] rounded-lg shadow-md bg-white p-6">
        <DialogTitle>Přihlášení</DialogTitle>
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Uživatelské jméno</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Zadejte uživatelské jméno"
            />
          </div>
          <div>
            <Label htmlFor="password">Heslo</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Zadejte heslo"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button
            onClick={handleLogin}
            className="float-right"
            disabled={isLoading}
          >
            {isLoading
              ? <Loader2 className="animate-spin mr-2" /> + "Přihlašování"
              : "Přihlásit se"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
