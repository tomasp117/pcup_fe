import { useEffect, useState } from "react";
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

const API_URL = import.meta.env.VITE_API_URL;

export const LoginDialog = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // addEventListener("keydown", (e) => {
  //   e.preventDefault();
  //   if (e.key === "Enter" && isOpen) {
  //     handleLogin();
  //   }
  //   if (e.key === "Escape") {
  //     setIsOpen(false);
  //   }
  // });

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Neplatné přihlašovací údaje.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      const base64Url = data.token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const binary = atob(base64);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const decodedPayload = new TextDecoder().decode(bytes);
      const payload = JSON.parse(decodedPayload);
      setUser({ username: payload.unique_name, role: payload.role });

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

      <DialogContent className="sm:w-[350px] rounded-lg shadow-md bg-white p-6 max-h-[100dvh] overflow-y-auto">
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLogin();
                }
              }}
              placeholder="Zadejte heslo"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button
            onClick={handleLogin}
            className="float-right"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Přihlásit se"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
