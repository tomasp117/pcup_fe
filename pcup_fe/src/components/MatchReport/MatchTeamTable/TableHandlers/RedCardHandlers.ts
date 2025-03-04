import { useMatchContext } from "../../../Contexts/MatchContext";
import Team from "../../../Objects/Team";
import Player from "../../../Objects/Player";

function RedCardHandlers(team: Team) {
    const { matchDetails, timerRunning, setTeamHome, setTeamAway } =
        useMatchContext();

    const isHomeTeam = team.key === matchDetails.home.key;

    function addRedCard(player: Player): void {
        if (timerRunning) {
            const updatedPlayers = team.players.map((currentPlayer) => {
                if (currentPlayer.id === player.id) {
                    //if (!currentPlayer.redCard && !currentPlayer.yellowCard) {
                    currentPlayer.redCard = true; // Update yellow card status

                    if (isHomeTeam) {
                        console.log(
                            "Cervena karta pro domaci, pro hrace: " +
                                player.firstName +
                                " " +
                                player.lastName +
                                " pocet golu: " +
                                player.goalCnt
                        );
                    } else {
                        console.log(
                            "Cervena karta pro hostujici, pro hrace: " +
                                player.firstName +
                                " " +
                                player.lastName +
                                " pocet golu: " +
                                player.goalCnt
                        );
                    }
                    //}
                }
                return currentPlayer;
            });

            // Use the context to update the state
            if (isHomeTeam) {
                setTeamHome({ ...team, players: updatedPlayers });
            } else {
                setTeamAway({ ...team, players: updatedPlayers });
            }
        }
    }

    return { addRedCard };
}

export default RedCardHandlers;
