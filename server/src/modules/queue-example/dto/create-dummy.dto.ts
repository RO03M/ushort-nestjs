import { IsNumber } from "class-validator";

export class CreateDummyDto {
	@IsNumber()
	id: number;
}
