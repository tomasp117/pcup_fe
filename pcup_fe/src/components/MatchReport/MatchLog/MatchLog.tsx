import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { X } from "lucide-react";
import { useState } from "react";

export const MatchLog = () => {
    const { matchDetails, events, setEvents } = useMatchContext();

    const [hoveredEvent, setHoveredEvent] = useState<number | null>(null); // Stav pro sledování hoveru na posledním eventu

    const removeLastEvent = () => {
        if (events.length === 0) return;
        setEvents((prevEvents) => prevEvents.slice(0, -1));
    };

    const eventTypes: Record<string, string> = {
        G: "Gól",
        Y: "Žlutá karta",
        R: "Červená karta",
        "2": "2 minuty",
        I: "Info",
    };

    return (
        <div className="overflow-x-auto rounded-lg shadow-lg flex-1">
            <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
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
                        <TableCell className="text-center">
                            <Button className="w-[50%]">1. Poločas</Button>
                        </TableCell>
                        <TableCell className="text-center w-[40%]">
                            &nbsp;
                        </TableCell>
                    </TableRow>

                    {events.map((event, idx) => {
                        const isLast = idx === events.length - 1; // Kontrola posledního eventu
                        return (
                            <TableRow key={idx}>
                                <TableCell className="text-center">
                                    <Button variant={"goalInfo"}>
                                        {event.team === "L"
                                            ? `${
                                                  eventTypes[event.type]
                                              } - Hráč #${event.authorID}`
                                            : ""}
                                    </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant={
                                            hoveredEvent === idx - 1 && isLast
                                                ? "eventDelete"
                                                : "goalInfo"
                                        }
                                        className="w-[50%]"
                                        title={
                                            isLast
                                                ? "Smazat poslední událost"
                                                : ""
                                        }
                                        onClick={
                                            isLast ? removeLastEvent : undefined
                                        }
                                        onMouseEnter={() =>
                                            isLast && setHoveredEvent(idx - 1)
                                        }
                                        onMouseLeave={() =>
                                            isLast && setHoveredEvent(null)
                                        }
                                    >
                                        {isLast && hoveredEvent === idx - 1 ? (
                                            <X size={24} />
                                        ) : (
                                            event.time
                                        )}
                                    </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button variant={"goalInfo"}>
                                        {event.team === "R"
                                            ? `${
                                                  eventTypes[event.type]
                                              } - Hráč #${event.authorID}`
                                            : ""}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};
