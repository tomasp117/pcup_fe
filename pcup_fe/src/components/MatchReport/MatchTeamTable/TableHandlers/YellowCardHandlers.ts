import { useMatchContext } from "../../../Contexts/MatchContext";
import Team from "../../../Objects/Team";
import Player from "../../../Objects/Player";

function YellowCardHandlers(team: Team) {
    const { matchDetails, timerRunning, setTeamHome, setTeamAway } =
        useMatchContext();

    const isHomeTeam = team.key === matchDetails.home.key;

    function addYellowCard(player: Player): void {
        if (timerRunning) {
            const updatedPlayers = team.players.map((currentPlayer) => {
                if (currentPlayer.id === player.id) {
                    if (!currentPlayer.redCard) {
                        currentPlayer.yellowCard = true; // Update yellow card status

                        if (isHomeTeam) {
                            console.log(
                                "Zluta karta pro domaci, pro hrace: " +
                                    player.firstName +
                                    " " +
                                    player.lastName +
                                    " pocet golu: " +
                                    player.goalCnt
                            );
                        } else {
                            console.log(
                                "Zluta karta pro hostujici, pro hrace: " +
                                    player.firstName +
                                    " " +
                                    player.lastName +
                                    " pocet golu: " +
                                    player.goalCnt
                            );
                        }
                    }
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

    return { addYellowCard };
}

export default YellowCardHandlers;
