import { ApiProperty } from '@nestjs/swagger';

export class SignContractDto {
    @ApiProperty({ example: 1, description: 'ID пользователя' })
    userId: number;
}