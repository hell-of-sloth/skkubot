import { IsNotEmpty } from "class-validator";

export class questionDto {
    @IsNotEmpty()
    question: string;
}