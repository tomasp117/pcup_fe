import { useGroupsByCategory } from "@/hooks/useGroups";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";
import { Link } from "react-router-dom";

export const Groups = ({ categoryId }: { categoryId: number }) => {
  const { data: groups, isLoading, error } = useGroupsByCategory(categoryId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-6">
        Chyba při načítání skupin.
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        V této kategorii nejsou žádné skupiny.
      </div>
    );
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {groups.map((group) => (
        <Card key={group.id} className=" ">
          <CardHeader className="py-2  ">
            <h2 className="text-lg font-bold text-primary">{group.name}</h2>
          </CardHeader>
          <CardContent className="p-4">
            {group.teams && group.teams.length > 0 ? (
              <Table className="text-sm">
                <TableHeader className="bg-primary/10">
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Tým</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.teams.map((team, index) => (
                    <TableRow
                      key={team.id}
                      className="even:bg-primary/10 odd:bg-primary/5"
                    >
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell>
                        <Link
                          to={`/teams/${team.id}`}
                          className="hover:underline hover:text-blue-600"
                        >
                          {team.name}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-sm">Žádné týmy</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
