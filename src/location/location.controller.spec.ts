import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './location.entity';
import { NotFoundException } from '@nestjs/common';
// Mocking the LocationRepository
const mockLocationRepository = {
  create: jest.fn((dto: CreateLocationDto) => {
    return Promise.resolve({ id: 1, ...dto });
  }),
  findAll: jest.fn(() => {
    return Promise.resolve([{ id: 1, name: 'Test Location' }]);
  }),
  findOne: jest.fn((id: number) => {
    return Promise.resolve({ id, name: 'Test Location' });
  }),
  update: jest.fn((id: number, dto: UpdateLocationDto) => {
    return Promise.resolve({ id, ...dto });
  }),
  remove: jest.fn((id: number) => {
    return Promise.resolve();
  }),
};
describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  const mockLocationService = {
    create: jest.fn((dto: CreateLocationDto) => {
      return Promise.resolve({ id: 1, ...dto });
    }),
    findAll: jest.fn(() => {
      return Promise.resolve([{ id: 1, name: 'Test Location' }]);
    }),
    findOne: jest.fn((id: number) => {
      return Promise.resolve({ id, name: 'Test Location' });
    }),
    update: jest.fn((id: number, dto: UpdateLocationDto) => {
      return Promise.resolve({ id, ...dto });
    }),
    remove: jest.fn((id: number) => {
      return Promise.resolve();
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [{ provide: LocationService, useValue: mockLocationService },
        { provide: 'LocationRepository', useValue: mockLocationRepository },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  describe('create', () => {
    it('should create a location', async () => {
      const dto: CreateLocationDto = {
        name: 'New Location',
        building: 'A',
        locationNumber: 'HQ-001',
        area: 1000
      };
      expect(await controller.create(dto)).toEqual({ id: 1, ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      expect(await controller.findAll()).toEqual([{ id: 1, name: 'Test Location' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a location by ID', async () => {
      const id = 1;
      const expectedLocation = { id, name: 'Test Location' };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedLocation as Location); 

      const result = await controller.findOne(id);
      expect(result).toEqual(expectedLocation);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if location not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Location not found')); 

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a location', async () => {
      const id = 1;
      const dto: UpdateLocationDto = { name: 'Updated Location' };
      const updatedLocation: Partial<Location> = {
        id,
        name: 'Updated Location', // Explicitly set the name
        building: 'A',
        locationNumber: 'HQ-001',
        area: 1000, // Add required property
        parent: null,
        children: []
      };
      
      jest.spyOn(service, 'update').mockResolvedValue(updatedLocation as Location);
      
      expect(await controller.update(id, dto)).toEqual(updatedLocation);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });

    it('should throw NotFoundException if location not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException('Location not found')); // Mock to throw NotFoundException

      await expect(controller.update(999, {})).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, {});
    });
  });

  describe('remove', () => {
    it('should delete a location', async () => {
      const id = 1;
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    it('should throw an error if location not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValueOnce(new Error('Location not found'));
      await expect(controller.remove(999)).rejects.toThrow();
    });
  });
});
