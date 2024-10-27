import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  private readonly logger = new Logger(LocationService.name);

  async create(locationData: CreateLocationDto): Promise<Location> {
    this.logger.log(`Creating location: ${JSON.stringify(locationData)}`);
    const existingLocation = await this.locationsRepository.findOne({
      where: { locationNumber: locationData.locationNumber },
    });
  
    if (existingLocation) {
      this.logger.warn(`Location number ${locationData.locationNumber} already exists.`);
      throw new ConflictException('Location number must be unique.');
    }
    const location = await this.locationsRepository.save(locationData);
    this.logger.log(`Successfully created location with ID: ${location.id}`);
    return location;
  }

  async findAll(): Promise<Location[]> {
    this.logger.log(`Finding all locations`);
    return await this.locationsRepository.find({ relations: ['parent', 'children'], });
  }
  async findOne(id: number): Promise<Location> {
    this.logger.log(`Finding location with ID: ${id}`);
    const location = await this.locationsRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!location) {
      this.logger.error(`Location with ID ${id} not found`);
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(id: number, locationData: UpdateLocationDto): Promise<Location> {
    this.logger.log(`Attempting to update location with ID: ${id}`);
  
    
    const existingLocation = await this.findOne(id);  
    
    if (!existingLocation) {
      this.logger.error(`Location with ID: ${id} not found`);
      throw new NotFoundException(`Location with ID: ${id} not found`);
    }

    if (locationData.locationNumber) {
      const conflictingLocation = await this.locationsRepository.findOne({
        where: { locationNumber: locationData.locationNumber },
      });
  
      if (conflictingLocation && conflictingLocation.id !== id) {
        this.logger.warn(`Location number ${locationData.locationNumber} conflicts with existing location.`);
        throw new ConflictException('Location number must be unique.');
      }
    }
  
    // Merge existing data with the new data
    const updatedLocation = Object.assign(existingLocation, locationData);
  
    await this.locationsRepository.save(updatedLocation);
  
    this.logger.log(`Successfully updated location with ID: ${id}`);
    return updatedLocation;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Attempting to remove location with ID: ${id}`);
    const location = await this.findOne(id);
    await this.locationsRepository.remove(location);
    this.logger.log(`Successfully removed location with ID: ${id}`);
  }
}
