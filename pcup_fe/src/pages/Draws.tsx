import { useEffect, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { CategorySelect } from "@/components/CategorySelect";
import { TeamList } from "@/components/MatchDraws/TeamList";
import { GroupVariants } from "@/components/MatchDraws/GroupVariants";
import { GroupList } from "@/components/MatchDraws/GroupList";
import { useCategoryData } from "@/hooks/Draws/useCategoryData";
import { useAutoAssign } from "@/hooks/Draws/useAutoAssign";
import { TeamDraw } from "@/interfaces/Draws/TeamDraw";

const API_URL = import.meta.env.VITE_API_URL;

export const Draws = () => {
  const {
    category,
    setCategory,
    setCategoryData,
    teamDraws,
    groups,
    selectedVariant,
    groupVariants,
    categoryData,
    setTeamDraws,
    setGroups,
    setSelectedVariant,
    setGroupVariants,
    setErrorMessage,
    toggleVariant,
    selectVariant,
    isLoading,
    errorMessage,
    expandedVariant,
  } = useCategoryData(API_URL);

  const hasTeamsInGroups = groups.some((group) => group.teams.length > 0);

  const handleCategoryChange = (newCategory: number) => {
    setCategoryData((prev) => ({
      ...prev,
      ...(category !== null && {
        [category?.toString()]: {
          teams: teamDraws,
          groups: groups,
          selectedVariant,
          groupVariants,
        },
      }),
    }));

    setCategory(newCategory);

    const newData = categoryData[newCategory] || {
      teams: [],
      groups: Array.from({ length: 4 }, (_, index) => ({
        id: index + 1,
        name: `Skupina ${String.fromCharCode(65 + index)}`,
        teams: [],
      })),
      selectedVariant: null,
      groupVariants: [],
    };

    setTeamDraws(newData.teams);
    setGroups(newData.groups);
    setSelectedVariant(newData.selectedVariant);
    setGroupVariants(newData.groupVariants);
  };

  const { autoAssignTeams } = useAutoAssign(
    API_URL,
    category,
    teamDraws,
    setGroupVariants,
    setErrorMessage,
    setCategoryData
  );

  const resetVariantSelection = () => {
    setSelectedVariant(null);
    resetTeams();
  };

  const backToManual = () => {
    resetTeams();
    setSelectedVariant(null);
    setGroupVariants([]);
  };

  const handleChange = (
    id: number,
    field: "strength" | "isGirls",
    value: number | boolean
  ) => {
    setTeamDraws((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, [field]: value } : team
      )
    );
  };

  const moveTeamToGroup = (team: TeamDraw, groupId: number) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          // Přidání týmu do nové skupiny, pokud tam ještě není
          if (!group.teams.some((t) => t.id === team.id)) {
            return { ...group, teams: [...group.teams, team] };
          }
        } else {
          // Odebíráme tým ze všech ostatních skupin
          return {
            ...group,
            teams: group.teams.filter((t) => t.id !== team.id),
          };
        }
        return group;
      })
    );

    // Odebrání z původního seznamu (pokud tam tým byl)
    setTeamDraws((prevTeams) => prevTeams.filter((t) => t.id !== team.id));
  };

  const moveTeamBack = (team: TeamDraw) => {
    // Odebrání týmu ze všech skupin
    setGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        teams: group.teams.filter((t) => t.id !== team.id),
      }))
    );

    // Přidání zpět do seznamu týmů (pokud tam ještě není)
    setTeamDraws((prevTeams) => {
      if (!prevTeams.some((t) => t.id === team.id)) {
        return [...prevTeams, team];
      }
      return prevTeams;
    });
  };

  const removeTeamFromGroup = (teamId: number, fromGroup: number | null) => {
    if (fromGroup === null) return;

    let removedTeam: TeamDraw | undefined;

    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === fromGroup) {
          removedTeam = group.teams.find((t) => t.id === teamId);
          return {
            ...group,
            teams: group.teams.filter((t) => t.id !== teamId),
          };
        }
        return group;
      })
    );

    if (removedTeam) {
      setTeamDraws((prevTeams) => {
        if (!prevTeams.some((t) => t.id === removedTeam!.id)) {
          return [...prevTeams, removedTeam!];
        }
        return prevTeams;
      });
    }
  };

  const updateGroupCount = (newCount: number) => {
    if (newCount < 1 || newCount > 5) return;

    if (newCount < groups.length) {
      const removedTeams = groups
        .slice(newCount)
        .flatMap((group) => group.teams);
      setTeamDraws((prevTeams) => [...prevTeams, ...removedTeams]);
    }

    const newGroups = Array.from({ length: newCount }, (_, index) => ({
      id: groups[index]?.id,
      name: `Skupina ${String.fromCharCode(65 + index)}`,
      teams: groups[index]?.teams || [],
    }));

    setGroups(newGroups);
  };

  useEffect(() => {
    updateGroupCount(groups.length);
  }, []);

  const resetTeams = () => {
    const allTeamsFromGroups = groups.flatMap((group) => group.teams);
    setTeamDraws((prevTeams) => [...prevTeams, ...allTeamsFromGroups]);
    setGroups(groups.map((group) => ({ ...group, teams: [] })));
  };

  const saveGroups = async () => {
    setErrorMessage(null);
    const validGroups = groups.filter((group) => group.teams.length > 0);

    if (validGroups.length === 0) {
      toast.error("Nelze uložit – všechny skupiny jsou prázdné.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/groups/save?category=${category}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validGroups),
        }
      );

      if (!response.ok) throw new Error(`Chyba: ${response.status}`);

      toast.success("Skupiny byly úspěšně uloženy.");
    } catch (error) {
      toast.error("Chyba při ukládání skupin.");
    }
  };
  return (
    <DndProvider
      backend={HTML5Backend}
      key={selectedVariant ? "variant" : "manual"}
    >
      <div className="gap-8 flex-col flex">
        <Card className="h-min">
          <CardHeader>
            <h2 className="text-xl font-bold">Rozdělování týmů do skupin</h2>
          </CardHeader>
          <CardContent className="flex gap-4 items-center">
            <CategorySelect value={category} onChange={handleCategoryChange} />
          </CardContent>
        </Card>
        <div className="flex_col sm:flex gap-8">
          {/*LEVÁ STRANA - Seznam týmů */}
          <TeamList
            teams={teamDraws}
            isLoading={isLoading}
            errorMessage={errorMessage}
            groupVariants={groupVariants}
            selectedVariant={selectedVariant}
            hasTeamsInGroups={hasTeamsInGroups}
            onAutoAssign={autoAssignTeams}
            onBackToManual={backToManual}
            onChange={handleChange}
          />
          {/* 🟢 PRAVÁ STRANA - Skupiny */}

          {groupVariants.length === 0 ? (
            <GroupList
              groups={groups}
              onUpdateCount={updateGroupCount}
              onReset={resetTeams}
              onSave={saveGroups}
              moveTeam={moveTeamToGroup}
              moveBack={moveTeamBack}
              removeTeamFromGroup={removeTeamFromGroup}
            />
          ) : (
            <GroupVariants
              groups={groups}
              groupVariants={groupVariants}
              selectedVariant={selectedVariant}
              expandedVariant={expandedVariant}
              onToggle={toggleVariant}
              onSelect={selectVariant}
              onResetSelection={resetVariantSelection}
              onSave={saveGroups}
              moveTeam={moveTeamToGroup}
              moveBack={moveTeamBack}
              removeTeamFromGroup={removeTeamFromGroup}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
};
