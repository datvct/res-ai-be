export enum AcademicDegree {
  TS = 'ts',
  THS = 'ths',
  NCS = 'ncs',
  CN = 'cn',
  KS = 'ks',
  DS = 'ds',
  BS = 'bs',
  TC = 'tc',
  KHAC = 'khac',
}

export const ACADEMIC_DEGREE_LABELS = {
  [AcademicDegree.TS]: 'Tiến sĩ',
  [AcademicDegree.THS]: 'Thạc sĩ',
  [AcademicDegree.NCS]: 'Nghiên cứu sinh',
  [AcademicDegree.CN]: 'Cử nhân',
  [AcademicDegree.KS]: 'Kỹ sư',
  [AcademicDegree.DS]: 'Dược sĩ',
  [AcademicDegree.BS]: 'Bác sĩ',
  [AcademicDegree.TC]: 'Trung cấp',
  [AcademicDegree.KHAC]: 'Khác',
};
