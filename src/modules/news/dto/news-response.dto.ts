import { ApiProperty } from '@nestjs/swagger';
import { NewsBlockDto } from './news-block.dto';

export class NewsResponseDto {
  @ApiProperty({ example: '665f3a5a0f1b2c3d4e5f6a7b' })
  id: string;

  @ApiProperty({ example: 'ІЧМ отримав категорію А' })
  title: string;

  @ApiProperty({
    example: 'Короткий опис новини для превʼю на головній сторінці.',
  })
  description: string;

  @ApiProperty({
    type: [NewsBlockDto],
  })
  blocks: NewsBlockDto[];

  @ApiProperty({
    example: 'uploads/news/665f3a5a0f1b2c3d4e5f6a7b',
    description: 'Путь к папке для хранения файлов этой новости',
  })
  folderPath: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
