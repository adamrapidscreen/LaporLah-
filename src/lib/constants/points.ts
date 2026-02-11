export const POINTS_PER_ACTION = {
  create_report: 10,
  comment: 5,
  new_follower: 3,
  confirmation_vote: 8,
  report_closed: 25,
  resolution_confirmed: 15,
} as const;

export type PointAction = keyof typeof POINTS_PER_ACTION;
