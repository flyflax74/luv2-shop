import { CouponCondition } from "./coupon-condition";

export class Coupon {
    id: number;
    code: string;
    active: boolean;
    attribute: string;
    couponCondition: CouponCondition[]

    constructor(id: number, code: string, attribute :string, active: boolean, couponCondition?: CouponCondition[]) {
        this.id = id;
        this.code = code;
        this.active = active;
        this.attribute= attribute;
        this.couponCondition = couponCondition || []
      }
}
