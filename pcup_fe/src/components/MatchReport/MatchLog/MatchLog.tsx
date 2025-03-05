import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useMatchContext } from "@/contexts/MatchReportContext/MatchContext";
import { useState } from "react";

export const MatchLog = () => {
    const { matchDetails, events } = useMatchContext();

    const [eventInfo, setEventInfo] = useState<string>("");

    const eventTypes: Record<string, string> = {
        G: "Gól",
        Y: "Žlutá karta",
        R: "Červená karta",
        "2": "2 minuty",
    };
    return (
        <div className="overflow-x-auto rounded-lg shadow-lg flex-1">
            <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden ">
                <TableHeader className="bg-primary/10">
                    <TableRow>
                        <TableHead className="text-primary text-center">
                            {matchDetails.homeTeam.name}
                        </TableHead>
                        <TableHead className="text-primary text-center">
                            Čas
                        </TableHead>
                        <TableHead className="text-primary text-center">
                            {matchDetails.awayTeam.name}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="text-center w-[40%]">
                            &nbsp;
                        </TableCell>
                        <TableCell className="text-center">hih</TableCell>
                        <TableCell className="text-center w-[40%]">
                            &nbsp;
                        </TableCell>
                    </TableRow>

                    {events.map((event, idx) => (
                        <TableRow key={idx}>
                            <TableCell className="text-center w-[40%]">
                                {event.time}
                            </TableCell>
                            <TableCell className="text-center">
                                {event.time}
                            </TableCell>
                            <TableCell className="text-center w-[40%]">
                                {event.time}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
