export enum TabIndex {
  Loading = 0,
  Name,
  Games,
  ShortGames,
  Done,
}

interface Tab {
  index: TabIndex;
  label: string;
}

export const tabs: Tab[] = [
  {index: TabIndex.Name, label: 'Name'},
  {index: TabIndex.Games, label: 'Spiele'},
  {index: TabIndex.ShortGames, label: 'Absacker'},
  {index: TabIndex.Done, label: 'Fertig'},
];