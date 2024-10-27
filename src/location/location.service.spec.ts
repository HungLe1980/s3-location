import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { Location } from './location.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockLocationRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('LocationService', () => {
  let service: LocationService;
  let repository: Repository<Location>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getRepositoryToken(Location),
          useFactory: mockLocationRepository,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    repository = module.get<Repository<Location>>(getRepositoryToken(Location));    
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('create', () => {
    it('should successfully create a location', async () => {
      const createLocationDto: CreateLocationDto = {
        locationNumber: '123', name: 'Test Location',
        building: 'A',
        area: 0,
        parentId: null
      };
      const savedLocation: Location = {
        id: 1,
        ...createLocationDto,
        parent: null,
        children: [],
        parentId: null
      };
  
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(savedLocation);
  
      const result = await service.create(createLocationDto);
      expect(result).toEqual(savedLocation);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { locationNumber: createLocationDto.locationNumber } });
      expect(repository.save).toHaveBeenCalledWith(createLocationDto);
    });

    it('should throw a ConflictException if location number already exists', async () => {
      const createLocationDto: CreateLocationDto = {
        locationNumber: '123', name: 'Test Location',
        building: 'A',
        area: 0,
        parentId: null
      };
      const existingLocation = { id: 2, locationNumber: '123', name: 'Existing Location', building: 'B',
        area: 0,
        parent: null,
        parentId: null,
        children: [] };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingLocation); // Simulate existing location

      await expect(service.create(createLocationDto)).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { locationNumber: createLocationDto.locationNumber } });
      expect(repository.save).not.toHaveBeenCalled(); // Ensure save is not called
    });
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const locations: Location[] = [
        { id: 1, name: 'Location 1', building: 'A', locationNumber: '001', area: 100, parent: null, children: [], parentId: null },
        { id: 2, name: 'Location 2', building: 'B', locationNumber: '002', area: 200, parent: null, children: [], parentId: null }
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(locations);

      const result = await service.findAll();
      expect(result).toEqual(locations);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['parent', 'children'] });
    });
    });
    

  describe('findOne', () => {
    it('should return a location by ID', async () => {
      const id = 1;
      const location: Location = {
        id,
        name: 'Test Location',
        building: 'A',
        locationNumber: '001',
        area: 100,
        parent: null,
        children: [],
        parentId: null
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(location); // Simulate finding a location

      const result = await service.findOne(id);
      expect(result).toEqual(location);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id }, relations: ['children'] });
    });

    it('should throw a NotFoundException if location does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null); // Simulate location not found

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id }, relations: ['children'] });
    });
  });

  describe('update', () => {
    it('should update and return the location', async () => {
      const id = 1;
      const updateLocationDto: UpdateLocationDto = { locationNumber: '123', name: 'Updated Location' };
      const existingLocation: Location = {
        id,
        locationNumber: '456',
        name: 'Existing Location',
        building: 'A',
        area: 100,
        parent: null,
        children: [],
        parentId: null
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingLocation); // Simulate finding the existing location
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null); // Simulate no conflict with another location number
      jest.spyOn(repository, 'save').mockResolvedValue({ ...existingLocation, ...updateLocationDto } as Location); // Simulate successful update

      const result = await service.update(id, updateLocationDto);
      expect(result).toEqual({ ...existingLocation, ...updateLocationDto });
      expect(repository.save).toHaveBeenCalledWith({ ...existingLocation, ...updateLocationDto });
    });

    it('should throw NotFoundException if location to update does not exist', async () => {
      const id = 1;
      const updateLocationDto: UpdateLocationDto = { locationNumber: '123', name: 'Updated Location' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(null); // Simulate not found

      await expect(service.update(id, updateLocationDto)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id }, relations: ['children'] });
    });
    
    it('should throw ConflictException if location number conflicts with existing location', async () => {
      const id = 1;
      const updateLocationDto: UpdateLocationDto = { locationNumber: '123' };
      const existingLocation = { id, locationNumber: '456' };
      const conflictingLocation: Location = {
        id: 2,
        locationNumber: '123',
        name: 'Conflicting Location',
        building: 'B',
        area: 200,
        parent: null,
        children: [],
        parentId: null
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingLocation as Location); // Simulate existing location
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(conflictingLocation); // Simulate conflict

      await expect(service.update(id, updateLocationDto)).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { locationNumber: updateLocationDto.locationNumber } });
    });
  });

  describe('remove', () => {
    it('should remove the location', async () => {
      const id = 1;
      const location: Location = {
        id,
        name: 'Test Location',
        locationNumber: '123',
        building: 'A',
        area: 100,
        parent: null,
        children: [],
        parentId: null
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(location); // Simulate finding the location

      await service.remove(id);
      expect(repository.remove).toHaveBeenCalledWith(location);
    });

    it('should throw NotFoundException if location to remove does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null); // Simulate not found

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id }, relations: ['children'] });
    });
  });
});
