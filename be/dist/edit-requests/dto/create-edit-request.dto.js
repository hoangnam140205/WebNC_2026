var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional, IsIn, IsDateString } from 'class-validator';
export class CreateEditRequestDto {
    expenseId;
    requestedAmount;
    requestedDescription;
    requestedNote;
    requestedDate;
    requestedType;
    requestedCategoryId;
    reason;
}
__decorate([
    IsNotEmpty({ message: 'Khoản chi tiêu không được để trống' }),
    IsString(),
    __metadata("design:type", String)
], CreateEditRequestDto.prototype, "expenseId", void 0);
__decorate([
    IsNotEmpty({ message: 'Số tiền mới không được để trống' }),
    IsNumber({}, { message: 'Số tiền phải là số' }),
    IsPositive({ message: 'Số tiền phải lớn hơn 0' }),
    __metadata("design:type", Number)
], CreateEditRequestDto.prototype, "requestedAmount", void 0);
__decorate([
    IsNotEmpty({ message: 'Mô tả mới không được để trống' }),
    IsString(),
    __metadata("design:type", String)
], CreateEditRequestDto.prototype, "requestedDescription", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateEditRequestDto.prototype, "requestedNote", void 0);
__decorate([
    IsNotEmpty({ message: 'Ngày mới không được để trống' }),
    IsDateString({}, { message: 'Định dạng ngày không hợp lệ' }),
    __metadata("design:type", String)
], CreateEditRequestDto.prototype, "requestedDate", void 0);
__decorate([
    IsOptional(),
    IsIn(['income', 'expense']),
    __metadata("design:type", String)
], CreateEditRequestDto.prototype, "requestedType", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateEditRequestDto.prototype, "requestedCategoryId", void 0);
__decorate([
    IsNotEmpty({ message: 'Lý do yêu cầu chỉnh sửa không được để trống' }),
    IsString(),
    __metadata("design:type", String)
], CreateEditRequestDto.prototype, "reason", void 0);
//# sourceMappingURL=create-edit-request.dto.js.map