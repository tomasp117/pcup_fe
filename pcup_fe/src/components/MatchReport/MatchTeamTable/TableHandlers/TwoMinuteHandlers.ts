import { useState } from "react";
import { useMatchContext } from "../../../Contexts/MatchContext";
import Team from "../../../Objects/Team";
import Player from "../../../Objects/Player";

function TwoMinuteHandlers(team: Team) {
    const { matchDetails, timerRunning, addEvent } = useMatchContext();
    const [canAdd2M, setCanAdd2M] = useState<boolean>(true);

    const isHomeTeam = team.key === matchDetails.home.key;

    function add2M(player: Player): void {
        if (canAdd2M && timerRunning) {
            setCanAdd2M(false);
            const currentPlayer = team.players.find((p) => p === player);
            // Zpracování hráčů přímo z team.players
            if (currentPlayer && !currentPlayer.redCard) {
                if (currentPlayer.twoMin < 3) {
                    currentPlayer.twoMin++;
                    addEvent({
                        type: "2",
                        player: currentPlayer,
                        info: `2' - ${
                            player.firstName + " " + player.lastName
                        } #${player.number}`,
                        time: matchDetails.timePlayed, // Nebo jiný časový formát
                    });
                }
                if (player.twoMin >= 3) {
                    player.redCard = true;
                }
            }
            setTimeout(() => {
                setCanAdd2M(true);
            }, 1000);
        }
    }

    return { add2M };
}

export default TwoMinuteHandlers;
