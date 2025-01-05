export interface AddTaxPayload {
  name: string;
  value: number;
  type: number;
  threshold: number;
  productAttributeId: number;
}
export interface UpdateTaxPayload {
  name?: string;
  value?: number;
  type?: number;
  threshold?: number;
  productAttributeId?: number;
}
