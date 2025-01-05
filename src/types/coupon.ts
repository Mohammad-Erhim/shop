export interface CouponPayload {
  code: string;
  discountTypeId: number;
  discountValue: number;
  maxUses: number;
  expiresAt: Date;
}
