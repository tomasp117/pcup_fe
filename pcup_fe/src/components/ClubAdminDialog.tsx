// ClubAdminDialog.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AddClubAdminDialog } from "@/components/AddClubAdminDialog"; // formulář pro vytvoření admina
import { Button } from "@/components/ui/button";
import { Club } from "@/interfaces/MatchReport/Club";
import { useClubAdmin } from "@/hooks/useClubs";
import { Loader2 } from "lucide-react";

export const ClubAdminDialog = ({
  club,
  open,
  onClose,
}: {
  club: Club;
  open: boolean;
  onClose: () => void;
}) => {
  // Hook zavolá API podle clubId
  const { data: admin, isLoading, isError, refetch } = useClubAdmin(club.id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white p-4 sm:p-6 rounded-lg shadow-md">
        {isLoading ? (
          <Loader2 className="animate-spin h-6 w-6 text-gray-500 mx-auto my-4" />
        ) : admin ? (
          // Admin existuje, zobraz jeho info
          <div>
            <h3 className="font-semibold mb-2">Administrátor klubu</h3>
            <div>
              <b>Jméno:</b> {admin.person.firstName} {admin.person.lastName}
            </div>
            <div>
              <b>Email:</b> {admin.person.email}
            </div>
            <Button onClick={onClose} className="mt-4">
              Zavřít
            </Button>
          </div>
        ) : (
          // Admin neexistuje nebo chyba => zobraz formulář
          <>
            {isError && (
              <div className="text-red-500 mb-2">
                Admin se nepodařilo načíst nebo neexistuje. Vytvoř nového.
              </div>
            )}
            <AddClubAdminDialog
              open={open}
              onClose={onClose}
              onSave={() => {
                refetch();
                onClose();
              }}
              clubId={club.id}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
