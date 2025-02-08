import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    text!: string;

    @IsString()
    userId!: string;

    @IsOptional()
    @IsString()
    parentId?: string;
}
