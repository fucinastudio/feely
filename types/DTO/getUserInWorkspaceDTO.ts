import { IGetUserDTO } from '@/types/DTO/getUserDTO';
import { PeriodType } from '@/types/enum/period';

export interface IGetUserInWorkspaceDTO {
  current_org: string;
  workspaceId: string;
  period: PeriodType;
}
