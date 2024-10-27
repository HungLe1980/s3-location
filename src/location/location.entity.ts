import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity("location")
export class Location {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the location', example: 1 })
  id: number;

  @Column()
  @ApiProperty({ description: 'The building of the location', example: 'A' })
  building: string;

  @Column()
  @ApiProperty({ description: 'The name of the location', example: 'Headquarters' })
  name: string;

  @Column({ name: 'location_number' })
  @ApiProperty({ description: 'The number of the location', example: 'HQ-001' })
  locationNumber: string;

  @Column()
  @ApiProperty({ description: 'The area of the location in square meters', example: 1000 })
  area: number;

  @ManyToOne(() => Location, location => location.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  @ApiPropertyOptional({ description: 'The parent location, if applicable', example: 1 })
  parent: Location;

  @Column({ name: 'parent_id', nullable: true })
  @ApiPropertyOptional({ description: 'The ID of the parent location, if applicable', example: 1 })
  parentId: number;

  @OneToMany(() => Location, location => location.parent)
  @ApiProperty({ description: 'The child locations', type: [Location] })  
  children: Location[];
}