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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import { cs } from "date-fns/locale";
import { toast } from "react-toastify";
import { useCreateClubAdmin } from "@/hooks/useClubs";

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
    clubId: number;
  }) => void;
  clubId: number;
}

export const AddClubAdminDialog = ({
  open,
  onClose,
  onSave,
  clubId,
}: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

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

  const { mutate, isPending, isError, error } = useCreateClubAdmin();

  const handleSubmit = () => {
    if (!isValid()) return;
    mutate(
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        dateOfBirth: dateOfBirth!.toISOString(),
        username,
        password,
        clubId,
      },
      {
        onSuccess: (data) => {
          onSave?.(data);
          toast.success("Administrátor byl úspěšně přidán.");
          onClose();
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "Chyba při přidávání administrátora."
          );
        },
      }
    );
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
    setEmailError(emailRegex.test(value) ? "" : "Neplatný formát e-mailu.");
  };

  return (
    // <Dialog open={open} onOpenChange={onClose}>
    //   <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-6 rounded-lg shadow-md">
    //    <DialogHeader>
    //    <DialogTitle>Přidat klubového administrátora</DialogTitle>
    //    </DialogHeader>
    <>
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
        <Input
          placeholder="Adresa"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div>
          <label className="text-sm font-medium">Datum narození</label>
          <Calendar
            locale={cs}
            mode="single"
            selected={dateOfBirth}
            onSelect={(date) => setDateOfBirth(date || undefined)}
            fromYear={1950}
            toYear={new Date().getFullYear()}
            captionLayout="dropdown"
            initialFocus
            className="rounded-md border mt-1 p-2 shadow-sm bg-white"
            classNames={{ caption_dropdowns: "flex gap-2" }}
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
      </div>
      {/* <DialogFooter> */}
      <Button onClick={handleSubmit} disabled={!isValid()}>
        Uložit
      </Button>
    </>
    //   </DialogFooter>
    //   </DialogContent>
    // </Dialog>
  );
};
