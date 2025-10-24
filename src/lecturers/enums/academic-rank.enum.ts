export enum AcademicRank {
  GS = 'gs',
  PGS = 'pgs',
  NONE = 'none',
}

export const ACADEMIC_RANK_LABELS = {
  [AcademicRank.GS]: 'Giáo sư',
  [AcademicRank.PGS]: 'Phó giáo sư',
  [AcademicRank.NONE]: 'Không có học hàm',
};
