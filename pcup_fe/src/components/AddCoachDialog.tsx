import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cs } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Label } from "@radix-ui/react-label";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth: string;
    username: string;
    password: string;
    license: string;
    teamId: number;
  }) => void;
  teamId: number;
}

export const AddCoachDialog = ({ open, onClose, onSave, teamId }: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [license, setLicense] = useState("C");

  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const isValid = () => {
    return (
      firstName &&
      lastName &&
      username &&
      password.length >= 7 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      dateOfBirth
    );
  };

  const handleSubmit = () => {
    if (!firstName || !lastName || !username || !password || !dateOfBirth) {
      toast.error("Prosím vyplňte všechna povinná pole.");
      return;
    }

    const isoDateOnly = dateOfBirth.toISOString().split("T")[0];
    onSave({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      dateOfBirth: isoDateOnly, // dateOfBirth.toISOString(),
      username,
      password,
      license,
      teamId,
    });

    onClose();
  };

  const getPasswordFeedback = (password: string) => {
    const errors: string[] = [];

    if (password.length < 7) errors.push("alespoň 7 znaků");
    if (!/[A-Z]/.test(password)) errors.push("velké písmeno");
    if (!/[a-z]/.test(password)) errors.push("malé písmeno");
    if (!/\d/.test(password)) errors.push("číslo");

    return errors;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Neplatný formát e-mailu.");
    } else {
      setEmailError("");
    }
  };

  const phoneNumberRegex = /^\+?[0-9\s-]{7,15}$/;
  const isPhoneNumberValid = (value: string) => {
    return phoneNumberRegex.test(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <DialogHeader>
          <DialogTitle>Přidat trenéra</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            placeholder="Jméno"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Příjmení"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
          <Input
            placeholder="Telefon"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {phoneNumber && !isPhoneNumberValid(phoneNumber) && (
            <p className="text-sm text-red-500">
              Neplatný formát telefonního čísla.
            </p>
          )}
          <Input
            placeholder="Adresa"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div>
            <label className="text-sm font-medium">Datum narození</label>
            <Calendar
              mode="single"
              selected={dateOfBirth}
              onSelect={(date: Date | undefined) => setDateOfBirth(date || undefined)}
              fromYear={1950}
              toYear={new Date().getFullYear()}
              captionLayout="dropdown"
              initialFocus
              className="rounded-md border mt-1 p-2 shadow-sm bg-white"
              classNames={{
                caption_dropdowns: "flex gap-2",
              }}
            />
          </div>
          <Input
            placeholder="Uživatelské jméno"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative">
            <Input
              placeholder="Heslo"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-muted-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {password.length > 0 && getPasswordFeedback(password).length > 0 && (
            <p className="text-sm text-red-500 mt-1">
              Heslo musí obsahovat: {getPasswordFeedback(password).join(", ")}.
            </p>
          )}
          <Select value={license} onValueChange={setLicense}>
            <SelectTrigger>
              <SelectValue placeholder="Licence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!isValid()}>
            Uložit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
