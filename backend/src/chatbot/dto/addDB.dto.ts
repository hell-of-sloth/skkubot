import { IsNotEmpty } from 'class-validator';

export class addDBDto {
    @IsNotEmpty()
    filename: string;
}